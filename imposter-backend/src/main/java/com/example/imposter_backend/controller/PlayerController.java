package com.example.imposter_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.response.ApiResponse;
import com.example.imposter_backend.service.PlayerService;

@RestController
@RequestMapping("/api/users")
public class PlayerController {
    
        private final PlayerService playerService;
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }


    @GetMapping("/")
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        if(player == null) {
            return new ResponseEntity<>(new ApiResponse("Player not found", null), HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(new ApiResponse("Player found", player));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePlayer(@PathVariable Long id, @RequestBody Player updatedPlayer) {
        Player player = playerService.updatePlayer(id, updatedPlayer);
        if(player == null) {
            return new ResponseEntity<>(new ApiResponse("Player not found", null), HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(new ApiResponse("Player found", player));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePlayer(@PathVariable Long id) {
        boolean isDeleted = playerService.deletePlayer(id);
        if(!isDeleted) {
            return new ResponseEntity<>(new ApiResponse("Player not found", null), HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(new ApiResponse("Player deleted successfully", null));
    }   
}
