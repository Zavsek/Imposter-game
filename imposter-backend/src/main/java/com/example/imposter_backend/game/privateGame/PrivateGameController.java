package com.example.imposter_backend.game.privateGame;


import com.example.imposter_backend.response.ApiResponse;
import com.example.imposter_backend.game.privateGame.models.response.CreateGameRequestDTO;
import com.example.imposter_backend.game.privateGame.models.response.GameDetailsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;


@RestController
@RequestMapping(value = "/api/v1/private-game/")
public class PrivateGameController {

    private final PrivateGameService privateGameService;
    public PrivateGameController(PrivateGameService privateGameService) {
        this.privateGameService = privateGameService;
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> createPrivateGame(@RequestBody CreateGameRequestDTO requestDTO) {
        GameDetailsDTO game = privateGameService.createGame(
                requestDTO.hostId(),
                requestDTO.names(),
                requestDTO.numOfImposters(),
                requestDTO.word(),
                requestDTO.imposterHint());

        return ResponseEntity.ok(new ApiResponse("Game created successfully", game));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> finishGame(@PathVariable Long id, @RequestBody LocalDateTime finishedAt) {
        String response =  privateGameService.finishGame(id, finishedAt);
        return ResponseEntity.ok(new ApiResponse( response, null));
    }


}
