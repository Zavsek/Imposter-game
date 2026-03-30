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
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import static com.example.imposter_backend.game.CommonUtils.validateImposterCountIsValid;

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
    // ------------------------------------------------------------------------------------------

    private static final int MAX_CODE_TRIES = 10;
    @Transactional
        public GameLobbyDTO createGameLobby(Long hostId){
        Player gameHost = playerRepository.findById(hostId).orElseThrow(() -> new IllegalArgumentException("Player with id " + hostId + " does not exist"));
        String gameCode = generateUniqueCode(4);

        Game game = createNewGame(gameHost,gameCode);
        Game createdGame = gameRepository.save(game);

        return new GameLobbyDTO(createdGame.getId(),gameCode);
        }

        //HELPERS

        public String generateRandomCode(int length){
        Random random = new Random();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder("");
        for(int i = 0; i < length; i++){
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

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

        private Game createNewGame(Player host, String code) {
        Game game = new Game();
        game.setHost(host);
        game.setCode(code);
        return game;
    }

    // ------------------------------------------------------------------------------------------
    @Transactional
        public void startGame(Long gameId , @org.jetbrains.annotations.NotNull StartGameDTO startGameDTO){

            int numOfImposters = startGameDTO.numImposters();
            List<Participation>  participants= participationRepository.findByGameId(gameId);

            validateImposterCountIsValid(numOfImposters, participants.size());
            Game game = updateGameStatesAndReturnGame(gameId, startGameDTO.word(), startGameDTO.hint());

            setPlayerRolesAndNotify(participants, numOfImposters, game);

            messagingTemplate.convertAndSend("/topic/game/" + gameId, "START_GAME");
        }

        //HELPERS



        private Game updateGameStatesAndReturnGame(Long gameId,
                                                   String word,
                                                   String hint) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game does not exist"));
        game.setState(State.PLAYING);
        game.setStartedAt( LocalDateTime.now());
        game.setWord(word);
        game.setHint(hint);
        gameRepository.save(game);
        return game;

    }

        private void setPlayerRolesAndNotify(List<Participation> participants,
                                                                     int numOfImposters,
                                                                     Game game) {
        Collections.shuffle(participants);

        for(Participation participation : participants) {
            if (numOfImposters > 0) {
                participation.setRole(Role.IMPOSTER);
                numOfImposters -= 1;
            } else participation.setRole(Role.KNOWER);
        }
            participationRepository.saveAll(participants);
        for(Participation participation : participants) {
            notifyUser(participation, game);
        }
    }

        private void notifyUser(Participation participation, Game game) {
        String dataToShow;
        if (participation.getRole() == Role.IMPOSTER) {
            dataToShow = "HINT: " + game.getHint();
        } else {
            dataToShow = "WORD: " + game.getWord();
        }

        PlayerRoleDto playerRoleAndWord = new PlayerRoleDto(
                participation.getRole().toString(),
                dataToShow
        );

        messagingTemplate.convertAndSendToUser(
                participation.getPlayer().getId().toString(),
                "/queue/game-details",
                playerRoleAndWord
        );
    }

    // ------------------------------------------------------------------------------------------

    //returns PublicGameJoinDetailsDto via WebSocket
        public void joinGame(String code, Long playerId){
            Player player = playerRepository.findById(playerId).orElseThrow(() -> new IllegalArgumentException("Player does not exist"));
            Game game = checkGameValidity(code);

            boolean exists = participationRepository.existsByGameIdAndPlayerId(game.getId(), playerId);
            if(!exists){
                addPlayerToGame(game,player);
            }

            List<Participation> gameParticipants = participationRepository.findByGameId(game.getId());

            List<String> names = getNamesOfParticipants(gameParticipants);

             PublicGameJoinDetailsDTO details = new PublicGameJoinDetailsDTO(game.getId(),  names);
             messagingTemplate.convertAndSend("/topic/game/"+ game.getId(), details);
        }

        //HELPERS

        private List<String> getNamesOfParticipants(List<Participation> gameParticipants) {
        return gameParticipants.stream()
                .map(p->
                        p.getPlayer().getUsername()).toList();
    }

        private void addPlayerToGame(Game game, Player player) {
        Participation participation = new Participation();
        participation.setGame(game);
        participation.setPlayer(player);
        participationRepository.save(participation);
    }

        private Game checkGameValidity(String code) {
        Game game = gameRepository.findByCode(code).orElseThrow(() -> new IllegalArgumentException("Game does not exist"));
        if(game.getState() != State.LOBBY){
            throw new IllegalArgumentException("Game has already started or ended");
        }
        return game;
    }

    // ------------------------------------------------------------------------------------------

    //returns VoteUpdateDto via WebSocket
    @Transactional
        public void castVote(VoteCastingDTO voteCastingDTO){
            Long gameId = voteCastingDTO.gameId();
            Long toPlayerId = voteCastingDTO.toPlayerId();
            Long fromPlayerId = voteCastingDTO.fromPlayerId();


            List<Participation> participants = participationRepository.findByGameId(gameId);


            Participation voter = validateAndGetVoter(participants, fromPlayerId);
            Player votedPlayer = validateAndGetTargetPlayer(participants, toPlayerId);

            voter.setVote(votedPlayer);
            participationRepository.save(voter);

            broadcastVoteUpdate(gameId, fromPlayerId);
        }

        //HELPERS

        private Participation validateAndGetVoter(List<Participation> participants, Long fromId) {
        Participation voter = participants.stream()
                .filter(p -> p.getPlayer().getId().equals(fromId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Voter is not part of this game"));

        if (Boolean.TRUE.equals(voter.getIsEliminated())) {
            throw new IllegalArgumentException("Eliminated players cannot vote");
        }
        return voter;
    }

        private Player validateAndGetTargetPlayer(List<Participation> participants, Long toId) {
        return participants.stream()
                .filter(p -> p.getPlayer().getId().equals(toId))
                .map(Participation::getPlayer)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Target player is not in this game"));
    }

        private void broadcastVoteUpdate(Long gameId, Long fromPlayerId) {
        VoteUpdateDto update = new VoteUpdateDto(fromPlayerId, true);
        messagingTemplate.convertAndSend("/topic/game/" + gameId + "/votes", update);
    }


    // ------------------------------------------------------------------------------------------
    //returns id of eliminated player via WebSocket
    @Transactional
        public void processVotingRound(Long gameId) {
        List<Participation> participations = participationRepository.findByGameId(gameId);


        Map<Long, Integer> voteCount = countVotes(participations);


        if (voteCount.isEmpty()) {
            handleNoVotes(gameId, participations);
            return;
        }


        Long eliminatedPlayerId = determineEliminatedPlayerId(voteCount);
        eliminatePlayer(participations, eliminatedPlayerId);


        checkGameStatus(gameId, participations, eliminatedPlayerId);
    }

        //HELPERS

        private void resetVotesForNextRound(List<Participation> participations) {
        for (Participation p : participations) {
            p.setVote(null);
        }
            participationRepository.saveAll(participations);
    }

        private Map<Long, Integer> countVotes(List<Participation> participations) {
        Map<Long, Integer> voteCount = new HashMap<>();
        for (Participation p : participations) {
            if (p.getvotedForPlayer() != null) {
                Long votedId = p.getvotedForPlayer().getId();
                voteCount.put(votedId, voteCount.getOrDefault(votedId, 0) + 1);
            }
        }
        return voteCount;
    }

        private Long determineEliminatedPlayerId(Map<Long, Integer> voteCount) {
        int maxVotes = Collections.max(voteCount.values());
        List<Long> candidates = voteCount.entrySet().stream()
                .filter(entry -> entry.getValue() == maxVotes)
                .map(Map.Entry::getKey)
                .toList();

        if (candidates.size() > 1) {
            List<Long> mutableCandidates = new ArrayList<>(candidates);
            Collections.shuffle(mutableCandidates);
            return mutableCandidates.get(0);
        }
        return candidates.get(0);
    }

        private void eliminatePlayer(List<Participation> participations, Long targetId) {
        Participation eliminated = participations.stream()
                .filter(p -> p.getPlayer().getId().equals(targetId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not found"));

        eliminated.setIsEliminated(true);
        participationRepository.save(eliminated);
    }

        private void checkGameStatus(Long gameId, List<Participation> participations, Long lastEliminatedId) {
        long totalImposters = participations.stream()
                .filter(p -> p.getRole() == Role.IMPOSTER)
                .count();

        long eliminatedImposters = participations.stream()
                .filter(p -> p.getRole() == Role.IMPOSTER && p.getIsEliminated())
                .count();


        if (eliminatedImposters >= totalImposters) {
            finishGame(gameId, participations);
        } else {
            resetVotesForNextRound(participations);
            sendNextRoundSignal(gameId, lastEliminatedId);
        }
    }

        private void handleNoVotes(Long gameId, List<Participation> participations) {
        resetVotesForNextRound(participations);
        sendNextRoundSignal(gameId, null);
    }

        private void sendNextRoundSignal(Long gameId, Long lastEliminatedId) {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "NEXT_ROUND");
        data.put("lastEliminatedId", lastEliminatedId);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, (Object) data);
    }

    // ------------------------------------------------------------------------------------------

    //returns a Map containing game status, result, list of imposters and list od voted out users
    @Transactional
        private void finishGame(Long gameId, List<Participation> participations) {

        setFinishedGameState(gameId);

        List<Participation> eliminatedParticipations = getEliminatedParticipants(participations);
        boolean allEliminatedWereImposters = checkIfAllImpostersEliminated(eliminatedParticipations);
        List<String> impostersNames = getNamesOfImposters(participations);


        Map<String, Object> results = getGameResults(eliminatedParticipations, allEliminatedWereImposters, impostersNames);

        messagingTemplate.convertAndSend("/topic/game/" + gameId, (Object) results);


    }

        //HELPERS

        private void setFinishedGameState(Long gameId) {
        Game game =  gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game not found"));
        game.setFinishedAt(LocalDateTime.now());
        game.setState(State.FINISHED);
        gameRepository.save(game);
    }


        private List<Participation> getEliminatedParticipants(List<Participation> participations) {
        return  participations.stream()
                .filter(Participation::getIsEliminated)
                .toList();
    }

        private boolean checkIfAllImpostersEliminated(List<Participation> eliminatedParticipations) {
        return  eliminatedParticipations.stream()
                .allMatch(p -> p.getRole() == Role.IMPOSTER);
    }

        private List<String> getNamesOfImposters(List<Participation> participations) {
        return  participations.stream()
                .filter(p-> p.getRole().equals(Role.IMPOSTER))
                .map(Participation::getPlayer)
                .map(Player::getUsername)
                .toList();
    }



        private Map<String, Object> getGameResults(List<Participation> eliminatedParticipations, boolean allEliminatedWereImposters, List<String> impostersNames) {
        Map<String, Object> results = new HashMap<>();
        results.put("status", "FINISHED");
        results.put("impostersEliminated",  allEliminatedWereImposters);
        results.put("imposters", impostersNames);
        results.put("eliminatedPlayers",  eliminatedParticipations.stream()
                .map(p->p.getPlayer().getUsername())
                .toList());
        return results;
    }




}

