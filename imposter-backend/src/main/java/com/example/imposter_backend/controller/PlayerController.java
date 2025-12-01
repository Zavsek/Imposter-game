package com.example.imposter_backend.controller;

import java.util.List;

import com.example.imposter_backend.response.AuthDTO.RegistrationRequestDTO;
import com.example.imposter_backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.response.ApiResponse;
import com.example.imposter_backend.response.AuthDTO.LoginRequestDTO;
import com.example.imposter_backend.response.AuthDTO.LoginResponseDTO;
import com.example.imposter_backend.service.PlayerService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/users")
public class PlayerController {
    
        private final PlayerService playerService;
        private final AuthService authService;
    public PlayerController(PlayerService playerService,  AuthService authService) {
        this.playerService = playerService;
        this.authService = authService;
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
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerPlayer( @RequestBody RegistrationRequestDTO request){
        String response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse(response, null));
    }
    @PostMapping("/login")
    public ResponseEntity<Player> loginPlayer(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse("Login succesfull", null));
    }
    
}
