package com.example.imposter_backend.service;

import com.example.imposter_backend.model.*;
import com.example.imposter_backend.repository.GameRepository;
import com.example.imposter_backend.repository.ParticipationRepository;
import com.example.imposter_backend.repository.PlayerRepository;
import com.example.imposter_backend.response.GameDTO.*;
import com.example.imposter_backend.response.PrivateGameDTO.ParticipantDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final ParticipationRepository participationRepository;
    private final PlayerRepository playerRepository;
    public GameService(GameRepository gameRepository,
                             ParticipationRepository participationRepository,
                             PlayerRepository playerRepository)
    {
        this.gameRepository = gameRepository;
        this.participationRepository = participationRepository;
        this.playerRepository = playerRepository;
        }
        @Transactional
        public GameLobbyDTO createGameLobby(Long hostId){
        Player host = playerRepository.findById(hostId).orElseThrow(() -> new IllegalArgumentException("Player with id " + hostId + " does not exist"));
        String code = generateUniqueCode(4);

        Game game = new Game();
        game.setHost(host);
        game.setCode(code);
        game.setState(State.LOBBY);

        Game createdGame = gameRepository.save(game);

        Participation participation = new Participation();
        participation.setGame(game);
        participation.setPlayer(host);
        participationRepository.save(participation);

        return new GameLobbyDTO(createdGame.getId(),code);
        }
        @Transactional
        public PublicGameDetailsDTO startGame(Long gameId ,StartGameDTO startGameDTO){

            int numImposters = startGameDTO.numImposters();
            List<Participation>  participants= participationRepository.findByGameId(gameId);
            if(participants.size() < 3 || participants.size() > 16) {
                throw new IllegalArgumentException("There must be between 3 and 16 names");
            }
            if(numImposters < 1  || numImposters > participants.size()/2 || numImposters > 4) {
                throw new IllegalArgumentException("Invalid number of imposters, there can only between 1 and 4 imposters, and the number of imposters cannot exceed half the number of players");
            }
            Game game = gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game does not exist"));
            game.setState(State.PLAYING);
            game.setStartedAt( LocalDateTime.now());
            game.setWord(startGameDTO.word());
            game.setHint(startGameDTO.hint());
            gameRepository.save(game);

            Collections.shuffle(participants);
            List<ParticipantDTO> participantsDto = new ArrayList<ParticipantDTO>();
            for(Participation participation : participants){
                if(numImposters >0){
                    participation.setRole(Role.IMPOSTER);
                    numImposters -= 1;
                }
                else participation.setRole(Role.KNOWER);
                participantsDto
                        .add(new
                                ParticipantDTO(participation.getPlayer().getUsername(),
                                participation.getRole().toString()));
                participationRepository.save(participation);
            }

            return new PublicGameDetailsDTO(game.getId(),game.getWord(), game.getHint(), participantsDto );
        }

        public PublicGameJoinDetailsDTO joinGame(Long gameId, Long playerId){
            Player player = playerRepository.findById(playerId).orElseThrow(() -> new IllegalArgumentException("Player does not exist"));
            Game game = gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game does not exist"));
            if(game.getState() != State.LOBBY){
                throw new IllegalArgumentException("Game has already started or ended");
            }
            boolean exists = participationRepository.existsByGameIdAndPlayerId(gameId, playerId);
            if(!exists){
            Participation participation = new Participation();
            participation.setGame(game);
            participation.setPlayer(player);
            participationRepository.save(participation);
            }
            List<Participation> participants = participationRepository.findByGameId(gameId);

            List<String> names = participants.stream()
                    .map(p->
                            p.getPlayer().getUsername()).toList();
            return new PublicGameJoinDetailsDTO(game.getId(),  names);
        }

        public String castVote(VoteCastingDTO voteCastingDTO){
            Long toPlayerId = voteCastingDTO.toPlayerId();
            Long fromPlayerId = voteCastingDTO.fromPlayerId();
            List<Player> players = participationRepository.findAllPlayersByGameId(voteCastingDTO.gameId());
            List<Long> Ids = players.stream()
                    .map(Player::getId).toList();
            if(!Ids.contains(fromPlayerId) ){
                throw new IllegalArgumentException("Invalid from user id");
            }
            if(!Ids.contains(toPlayerId) ){
                throw new IllegalArgumentException("Invalid to user id");
            }
            Player votedPlayer = players.stream().filter(p->p.getId().equals(toPlayerId)).findFirst().get();
            Participation participation = participationRepository.findByGameIdAndPlayerId(voteCastingDTO.gameId(), fromPlayerId);
            participation.setVote(votedPlayer);
            return "Successfully voted for " +votedPlayer.getUsername();

        }
        public String generateRandomCode(int length){
            Random random = new Random();
            String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            StringBuilder sb = new StringBuilder("");
            for(int i = 0; i < length; i++){
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            return sb.toString();
        }
        private static final int MAX_CODE_TRIES = 10;
        public String generateUniqueCode(int length){
            int tries = 0;
            while(tries < MAX_CODE_TRIES){
                String code = generateRandomCode(length);
                Optional<Game> game = gameRepository.findByCode(code);
                if(!game.isPresent())return code;
                tries++;
            }
            return generateUniqueCode(length + 1);
        }
}

