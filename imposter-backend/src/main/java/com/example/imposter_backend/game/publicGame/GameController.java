package com.example.imposter_backend.game.publicGame;

import com.example.imposter_backend.game.publicGame.models.response.GameLobbyDTO;
import com.example.imposter_backend.game.publicGame.models.response.StartGameDTO;
import com.example.imposter_backend.game.publicGame.models.response.VoteCastingDTO;
import com.example.imposter_backend.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class GameController {
    private final GameService gameService;
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    //REST ENDPOINTS
    @PostMapping(value = "api/v1/game/create-game")
    @ResponseBody
    public ResponseEntity<ApiResponse> createGameLoby(@RequestBody Long hostId){
        GameLobbyDTO cratedGame = gameService.createGameLobby(hostId);
        return ResponseEntity.ok(new ApiResponse("Lobby created", cratedGame));
    }
    @PostMapping(value = "/api/v1/game/{gameId}/start")
    @ResponseBody
    public ResponseEntity<ApiResponse> startGame(@PathVariable("gameId") Long gameId, @RequestBody StartGameDTO startGameDTO) {
        gameService.startGame(gameId, startGameDTO);
        return ResponseEntity.ok(new ApiResponse("Game started", null));
    }

    //----------------------------------------------------------------
    //WebSockets


    // /app/game/join/{code}
    @MessageMapping("/game/join/{code}")
    public void joinGame(@DestinationVariable String code, @Payload Long playerId) {
        gameService.joinGame(code, playerId);
    }

    // /app/game/vote
    @MessageMapping("/game/vote")
    public void castVote(@Payload VoteCastingDTO voteCastingDTO) {
        gameService.castVote(voteCastingDTO);
    }

    // /app/game/{gameId}/process-round
    @MessageMapping("/game/{gameId}/process-round")
    public void processRound(@DestinationVariable Long gameId) {
        gameService.processVotingRound(gameId);
    }
}
