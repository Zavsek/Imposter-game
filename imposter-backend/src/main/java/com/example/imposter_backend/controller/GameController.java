package com.example.imposter_backend.controller;

import com.example.imposter_backend.response.ApiResponse;
import com.example.imposter_backend.response.GameDTO.GameLobbyDTO;
import com.example.imposter_backend.response.GameDTO.PublicGameDetailsDTO;
import com.example.imposter_backend.response.GameDTO.PublicGameJoinDetailsDTO;
import com.example.imposter_backend.response.GameDTO.StartGameDTO;
import com.example.imposter_backend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game/")
public class GameController {
    private final GameService gameService;
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }


    //TODO JWT authentication
    @PostMapping("/create-game/")
    public ResponseEntity<ApiResponse> createGameLoby(@RequestBody Long hostId){
        GameLobbyDTO cratedGame = gameService.createGameLobby(hostId);
        return ResponseEntity.ok(new ApiResponse("Lobby created", cratedGame));
    }
    @PostMapping("/join/{gameId}")
    public ResponseEntity<ApiResponse> joinGame(@PathVariable("gameId") Long gameId, @RequestBody Long playerId){
        PublicGameJoinDetailsDTO game = gameService.joinGame(gameId, playerId);
        return ResponseEntity.ok(new ApiResponse("Game joined", game));
    }
    @PostMapping("{gameId}/start")
    public ResponseEntity<ApiResponse> startGame(@PathVariable("gameId") Long gameId, @RequestBody StartGameDTO startGameDTO){
        PublicGameDetailsDTO details = gameService.startGame(gameId, startGameDTO);
        return ResponseEntity.ok(new ApiResponse("Game started", details));
    }
}
