package com.example.imposter_backend.game.publicGame;

import com.example.imposter_backend.auth.models.Player;
import com.example.imposter_backend.game.publicGame.models.Game;
import com.example.imposter_backend.game.publicGame.models.Participation;
import com.example.imposter_backend.game.publicGame.models.Role;
import com.example.imposter_backend.game.publicGame.models.State;
import com.example.imposter_backend.game.publicGame.models.response.*;
import com.example.imposter_backend.game.publicGame.repository.GameRepository;
import com.example.imposter_backend.game.publicGame.repository.ParticipationRepository;
import com.example.imposter_backend.auth.repository.PlayerRepository;
import com.example.imposter_backend.game.privateGame.models.response.ParticipantDTO;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final ParticipationRepository participationRepository;
    private final PlayerRepository playerRepository;
    private final SimpMessagingTemplate messagingTemplate;
    public GameService(GameRepository gameRepository,
                             ParticipationRepository participationRepository,
                             PlayerRepository playerRepository,
                             SimpMessagingTemplate messagingTemplate)
    {
        this.gameRepository = gameRepository;
        this.participationRepository = participationRepository;
        this.playerRepository = playerRepository;
        this.messagingTemplate = messagingTemplate;
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

        return new GameLobbyDTO(createdGame.getId(),code);
        }



        @Transactional
        public void startGame(Long gameId , @org.jetbrains.annotations.NotNull StartGameDTO startGameDTO){

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
                participationRepository.save(participation);

                String dataToShow;
                if (participation.getRole() == Role.IMPOSTER) {
                    dataToShow = "HINT: " + game.getHint();
                } else {
                    dataToShow = "WORD: " + game.getWord();
                }
                PlayerRoleDto privatePayload = new PlayerRoleDto(
                        participation.getRole().toString(),
                        dataToShow
                );
                messagingTemplate.convertAndSendToUser(
                        participation.getPlayer().getId().toString(),
                        "/queue/game-details",
                        privatePayload
                );
            }

            messagingTemplate.convertAndSend("/topic/game/" + gameId, "START_GAME");
        }


        //returns PublicGameJoinDetailsDto via WebSocket
        public void joinGame(String code, Long playerId){
            Player player = playerRepository.findById(playerId).orElseThrow(() -> new IllegalArgumentException("Player does not exist"));
            Game game = gameRepository.findByCode(code).orElseThrow(() -> new IllegalArgumentException("Game does not exist"));
            if(game.getState() != State.LOBBY){
                throw new IllegalArgumentException("Game has already started or ended");
            }
            boolean exists = participationRepository.existsByGameIdAndPlayerId(game.getId(), playerId);
            if(!exists){
            Participation participation = new Participation();
            participation.setGame(game);
            participation.setPlayer(player);
            participationRepository.save(participation);
            }
            List<Participation> participants = participationRepository.findByGameId(game.getId());

            List<String> names = participants.stream()
                    .map(p->
                            p.getPlayer().getUsername()).toList();
             PublicGameJoinDetailsDTO details = new PublicGameJoinDetailsDTO(game.getId(),  names);
             messagingTemplate.convertAndSend("/topic/game/"+ game.getId(), details);
        }


        //returns VoteUpdateDto via WebSocket
        @Transactional
        public void castVote(VoteCastingDTO voteCastingDTO){
            Long toPlayerId = voteCastingDTO.toPlayerId();
            Long fromPlayerId = voteCastingDTO.fromPlayerId();
            Participation voter = participationRepository.findById(fromPlayerId).orElseThrow(() -> new IllegalArgumentException("Player does not exist"));
            if(voter.getIsEliminated() == true){
                throw new IllegalArgumentException("Vote has already been eliminated");
            }
            List<Player> players = participationRepository.findAllPlayersByGameId(voteCastingDTO.gameId());
            List<Long> ids = players.stream()
                    .map(Player::getId).toList();
            if(!ids.contains(fromPlayerId) ){
                throw new IllegalArgumentException("Invalid from user id");
            }
            if(!ids.contains(toPlayerId) ){
                throw new IllegalArgumentException("Invalid to user id");
            }
            Player votedPlayer = players.stream().filter(p->p.getId().equals(toPlayerId)).findFirst().get();
            Participation participation = participationRepository.findByGameIdAndPlayerId(voteCastingDTO.gameId(), fromPlayerId);
            participation.setVote(votedPlayer);
            participationRepository.save(participation);
            VoteUpdateDto update = new VoteUpdateDto(
                    voteCastingDTO.fromPlayerId(),
                    true
            );
            messagingTemplate.convertAndSend("/topic/game/" + voteCastingDTO.gameId() + "/votes", update);

        }


        //returns id of eliminated player via WebSocket
    @Transactional
    public void processVotingRound(Long gameId) {
        List<Participation> participations = participationRepository.findByGameId(gameId);

        Map<Long, Integer> voteCount = new HashMap<>();
        for (Participation p : participations) {
            if (p.getvotedForPlayer() != null) {
                Long votedId = p.getvotedForPlayer().getId();
                voteCount.put(votedId, voteCount.getOrDefault(votedId, 0) + 1);
            }
        }

        if (voteCount.isEmpty()) {

            resetVotesForNextRound(participations);

            Map<String, Object> nextRoundData = new HashMap<>();
            nextRoundData.put("status", "NEXT_ROUND");
            nextRoundData.put("lastEliminatedId", null);
            messagingTemplate.convertAndSend("/topic/game/" + gameId, (Object) nextRoundData);
            return;
        }


        int maxVotes = Collections.max(voteCount.values());
        List<Long> candidates = voteCount.entrySet().stream()
                .filter(entry -> entry.getValue() == maxVotes)
                .map(Map.Entry::getKey)
                .toList();

        Long eliminatedPlayerId;
        if (candidates.size() > 1) {

            List<Long> mutableCandidates = new ArrayList<>(candidates);
            Collections.shuffle(mutableCandidates);
            eliminatedPlayerId = mutableCandidates.get(0);
        } else {
            eliminatedPlayerId = candidates.get(0);
        }


        final Long targetId = eliminatedPlayerId;
        Participation eliminatedParticipation = participations.stream()
                .filter(p -> p.getPlayer().getId().equals(targetId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not found in this game"));

        eliminatedParticipation.setIsEliminated(true);
        participationRepository.save(eliminatedParticipation);


        long numberOfImposters = participations.stream()
                .filter(p -> p.getRole() == Role.IMPOSTER)
                .count();

        long totalEliminated = participations.stream()
                .filter(Participation::getIsEliminated)
                .count();

        if (totalEliminated >= numberOfImposters) {
            finishGame(gameId, participations);
        } else {
            resetVotesForNextRound(participations);

            Map<String, Object> nextRoundData = new HashMap<>();
            nextRoundData.put("status", "NEXT_ROUND");
            nextRoundData.put("lastEliminatedId", eliminatedPlayerId);
            messagingTemplate.convertAndSend("/topic/game/" + gameId, (Object) nextRoundData);
        }
    }
        //returns Map containing game status, result, list of imposters and list od voted out users



    @Transactional
    private void finishGame(Long gameId, List<Participation> participations) {
        Game game =  gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game not found"));
        game.setFinishedAt(LocalDateTime.now());
        game.setState(State.FINISHED);
        gameRepository.save(game);

        List<Participation> eliminatedParticipations = participations.stream()
                .filter(Participation::getIsEliminated)
                .toList();


        boolean allEliminatedWereImposters = eliminatedParticipations.stream()
                .allMatch(p -> p.getRole() == Role.IMPOSTER);


        List<String> imposters = participations.stream()
                .filter(p-> p.getRole().equals(Role.IMPOSTER))
                .map(Participation::getPlayer)
                .map(Player::getUsername)
                .toList();

        Map<String, Object> results = new HashMap<>();
        results.put("status", "FINISHED");
        results.put("impostersEliminated",  allEliminatedWereImposters);
        results.put("imposters", imposters);
        results.put("eliminatedPlayers",  eliminatedParticipations.stream()
                .map(p->p.getPlayer().getUsername())
                .toList());
        messagingTemplate.convertAndSend("/topic/game/" + gameId, (Object) results);


    }


    private void resetVotesForNextRound(List<Participation> participations) {
        for (Participation p : participations) {
            p.setVote(null);
            participationRepository.save(p);
        }
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
                if(game.isEmpty())return code;
                tries++;
            }
            return generateUniqueCode(length + 1);
        }
}

