package com.example.imposter_backend.game.publicGame;

import com.example.imposter_backend.auth.models.Player;
import com.example.imposter_backend.auth.repository.PlayerRepository;
import com.example.imposter_backend.game.publicGame.models.Game;
import com.example.imposter_backend.game.publicGame.models.Participation;
import com.example.imposter_backend.game.publicGame.models.Role;
import com.example.imposter_backend.game.publicGame.models.State;
import com.example.imposter_backend.game.publicGame.models.response.*;
import com.example.imposter_backend.game.publicGame.repository.GameRepository;
import com.example.imposter_backend.game.publicGame.repository.ParticipationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;
    @Mock
    private ParticipationRepository participationRepository;
    @Mock
    private PlayerRepository playerRepository;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private GameService gameService;

    private Player host;
    private Player player2;
    private Player player3;
    private Game game;

    @BeforeEach
    void setUp() {
        host = new Player();
        host.setId(1L);
        host.setUsername("hostUser");

        player2 = new Player();
        player2.setId(2L);
        player2.setUsername("player2");

        player3 = new Player();
        player3.setId(3L);
        player3.setUsername("player3");

        game = new Game();
        game.setId(100L);
        game.setHost(host);
        game.setCode("ABCD");
        game.setState(State.LOBBY);
    }

    @Test
    void createGameLobby_ShouldSucceed() {
        when(playerRepository.findById(1L)).thenReturn(Optional.of(host));
        when(gameRepository.findByCode(anyString())).thenReturn(Optional.empty());
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game savedGame = invocation.getArgument(0);
            savedGame.setId(100L);
            return savedGame;
        });

        GameLobbyDTO result = gameService.createGameLobby(1L);

        assertNotNull(result);
        assertEquals(100L, result.gameId());
        assertNotNull(result.code());
        assertEquals(4, result.code().length());
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void createGameLobby_ShouldThrowException_WhenPlayerNotFound() {
        when(playerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> gameService.createGameLobby(99L));
    }

    @Test
    void joinGame_ShouldSucceed() {
        when(playerRepository.findById(2L)).thenReturn(Optional.of(player2));
        when(gameRepository.findByCode("ABCD")).thenReturn(Optional.of(game));
        when(participationRepository.existsByGameIdAndPlayerId(100L, 2L)).thenReturn(false);
        
        Participation p1 = new Participation();
        p1.setPlayer(host);
        p1.setGame(game);
        Participation p2 = new Participation();
        p2.setPlayer(player2);
        p2.setGame(game);
        
        when(participationRepository.findByGameId(100L)).thenReturn(Arrays.asList(p1, p2));

        gameService.joinGame("ABCD", 2L);

        verify(participationRepository).save(any(Participation.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/game/100"), any(PublicGameJoinDetailsDTO.class));
    }

    @Test
    void joinGame_ShouldThrowException_WhenGameNotLobby() {
        game.setState(State.PLAYING);
        when(playerRepository.findById(2L)).thenReturn(Optional.of(player2));
        when(gameRepository.findByCode("ABCD")).thenReturn(Optional.of(game));

        assertThrows(IllegalArgumentException.class, () -> gameService.joinGame("ABCD", 2L));
    }

    @Test
    void startGame_ShouldSucceed() {
        StartGameDTO dto = new StartGameDTO("Apple", "Fruit", 1);
        
        Participation p1 = new Participation(); p1.setPlayer(host); p1.setGame(game);
        Participation p2 = new Participation(); p2.setPlayer(player2); p2.setGame(game);
        Participation p3 = new Participation(); p3.setPlayer(player3); p3.setGame(game);
        List<Participation> participations = Arrays.asList(p1, p2, p3);

        when(participationRepository.findByGameId(100L)).thenReturn(participations);
        when(gameRepository.findById(100L)).thenReturn(Optional.of(game));

        gameService.startGame(100L, dto);

        assertEquals(State.PLAYING, game.getState());
        assertEquals("Apple", game.getWord());
        assertEquals("Fruit", game.getHint());
        
        long imposterCount = participations.stream().filter(p -> p.getRole() == Role.IMPOSTER).count();
        assertEquals(1, imposterCount);
        
        verify(messagingTemplate, times(3)).convertAndSendToUser(anyString(), eq("/queue/game-details"), any(PlayerRoleDto.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/game/100"), eq("START_GAME"));
    }

    @Test
    void startGame_ShouldThrowException_WhenTooFewPlayers() {
        StartGameDTO dto = new StartGameDTO("Apple", "Fruit", 1);
        Participation p1 = new Participation();
        when(participationRepository.findByGameId(100L)).thenReturn(Collections.singletonList(p1));

        assertThrows(IllegalArgumentException.class, () -> gameService.startGame(100L, dto));
    }

    @Test
    void castVote_ShouldSucceed() {
        VoteCastingDTO dto = new VoteCastingDTO(100L, 2L, 1L);
        
        Participation voter = new Participation();
        voter.setId(1L);
        voter.setPlayer(host);
        voter.setIsEliminated(false);
        
        when(participationRepository.findById(1L)).thenReturn(Optional.of(voter));
        when(participationRepository.findAllPlayersByGameId(100L)).thenReturn(Arrays.asList(host, player2, player3));
        when(participationRepository.findByGameIdAndPlayerId(100L, 1L)).thenReturn(voter);

        gameService.castVote(dto);

        assertEquals(player2, voter.getvotedForPlayer());
        verify(participationRepository).save(voter);
        verify(messagingTemplate).convertAndSend(eq("/topic/game/100/votes"), any(VoteUpdateDto.class));
    }

    @Test
    void castVote_ShouldThrowException_WhenVoterEliminated() {
        VoteCastingDTO dto = new VoteCastingDTO(100L, 2L, 1L);
        Participation voter = new Participation();
        voter.setIsEliminated(true);
        when(participationRepository.findById(1L)).thenReturn(Optional.of(voter));

        assertThrows(IllegalArgumentException.class, () -> gameService.castVote(dto));
    }

    @Test
    void processVotingRound_ShouldEliminatePlayer() {
        Participation p1 = new Participation(); p1.setPlayer(host); p1.setRole(Role.KNOWER);
        Participation p2 = new Participation(); p2.setPlayer(player2); p2.setRole(Role.IMPOSTER);
        Participation p3 = new Participation(); p3.setPlayer(player3); p3.setRole(Role.KNOWER);
        
        p1.setVote(player2);
        p3.setVote(player2);
        
        List<Participation> participations = Arrays.asList(p1, p2, p3);
        when(participationRepository.findByGameId(100L)).thenReturn(participations);
        when(gameRepository.findById(100L)).thenReturn(Optional.of(game));

        gameService.processVotingRound(100L);

        assertTrue(p2.getIsEliminated());
        verify(participationRepository).save(p2);
        // Since p2 was the only imposter and it's now eliminated, game should finish
        verify(gameRepository).findById(100L);
    }

    @Test
    void processVotingRound_NoVotes_ShouldStartNextRound() {
        Participation p1 = new Participation(); p1.setPlayer(host);
        Participation p2 = new Participation(); p2.setPlayer(player2);
        List<Participation> participations = Arrays.asList(p1, p2);
        when(participationRepository.findByGameId(100L)).thenReturn(participations);

        gameService.processVotingRound(100L);

        verify(messagingTemplate).convertAndSend(eq("/topic/game/100"), (Object) argThat(argument -> {
            Map<String, Object> data = (Map<String, Object>) argument;
            return "NEXT_ROUND".equals(data.get("status")) && data.get("lastEliminatedId") == null;
        }));
    }

    @Test
    void generateUniqueCode_ShouldRetryIfAlreadyExists() {

        when(gameRepository.findByCode(anyString()))
            .thenReturn(Optional.of(new Game()))
            .thenReturn(Optional.empty());

        String code = gameService.generateUniqueCode(4);
        
        assertNotNull(code);
        assertEquals(4, code.length());
        verify(gameRepository, times(2)).findByCode(anyString());
    }
    @Test
    void startGame_ShouldThrowException_WhenInvalidImposterCount() {
        // 3 players, 2 imposters (exceeds half)
        StartGameDTO dto = new StartGameDTO("Apple", "Fruit", 2);
        Participation p1 = new Participation();
        Participation p2 = new Participation();
        Participation p3 = new Participation();
        when(participationRepository.findByGameId(100L)).thenReturn(Arrays.asList(p1, p2, p3));

        assertThrows(IllegalArgumentException.class, () -> gameService.startGame(100L, dto));
    }

    @Test
    void processVotingRound_Tie_ShouldEliminateRandom() {
        Participation p1 = new Participation(); p1.setPlayer(host); p1.setRole(Role.KNOWER);
        Participation p2 = new Participation(); p2.setPlayer(player2); p2.setRole(Role.KNOWER);
        Participation p3 = new Participation(); p3.setPlayer(player3); p3.setRole(Role.IMPOSTER);
        
        // p1 votes for p2, p2 votes for p1 -> tie
        p1.setVote(player2);
        p2.setVote(host);
        
        List<Participation> participations = Arrays.asList(p1, p2, p3);
        when(participationRepository.findByGameId(100L)).thenReturn(participations);
        when(gameRepository.findById(100L)).thenReturn(Optional.of(game));

        gameService.processVotingRound(100L);

        // One of them should be eliminated
        assertTrue(p1.getIsEliminated() || p2.getIsEliminated());
        assertFalse(p1.getIsEliminated() && p2.getIsEliminated());
    }

    @Test
    void processVotingRound_ShouldFinishGame_WhenAllImpostersEliminated() {
        Participation p1 = new Participation(); p1.setPlayer(host); p1.setRole(Role.KNOWER);
        Participation p2 = new Participation(); p2.setPlayer(player2); p2.setRole(Role.IMPOSTER);
        
        p1.setVote(player2);
        
        List<Participation> participations = Arrays.asList(p1, p2);
        when(participationRepository.findByGameId(100L)).thenReturn(participations);
        when(gameRepository.findById(100L)).thenReturn(Optional.of(game));

        gameService.processVotingRound(100L);

        assertEquals(State.FINISHED, game.getState());
        verify(messagingTemplate).convertAndSend(eq("/topic/game/100"), (Object) argThat(argument -> {
            if (!(argument instanceof Map)) return false;
            Map<String, Object> data = (Map<String, Object>) argument;
            return "FINISHED".equals(data.get("status")) && Boolean.TRUE.equals(data.get("impostersEliminated"));
        }));
    }

    @Test
    void generateUniqueCode_ShouldIncreaseLengthIfMaxTriesExceeded() {
        // Mock gameRepository.findByCode to always return a game (simulating code collision)
        when(gameRepository.findByCode(anyString())).thenReturn(Optional.of(new Game()));

        // Reset and mock specifically
        reset(gameRepository);
        // 10 times returns existing game, 11th time returns empty
        when(gameRepository.findByCode(anyString()))
            .thenReturn(Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()), 
                        Optional.of(new Game()))
            .thenReturn(Optional.empty());

        String code = gameService.generateUniqueCode(4);
        
        assertNotNull(code);
        // After 10 failures of length 4, it should try length 5
        assertEquals(5, code.length());
    }
}
