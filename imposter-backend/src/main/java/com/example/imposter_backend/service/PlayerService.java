package com.example.imposter_backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


import com.example.imposter_backend.response.AuthDTO.LoginResponseDTO;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;


import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.repository.AuthRepository;
import com.example.imposter_backend.repository.PlayerRepository;

@Service    
public class PlayerService {


    private final PlayerRepository playerRepository;
    private final JwtService jwtService;
    public PlayerService(PlayerRepository playerRepository, JwtService jwtService) {
        this.playerRepository = playerRepository;
        this.jwtService = jwtService;

    }

    public List<Player> getAllPlayers(){
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id){
        return playerRepository.findById(id).orElse(null);
    }

    public Player updatePlayer(Long id, Player updatedPlayer){
        Optional<Player> existingPlayer = playerRepository.findById(id);
        if (existingPlayer.isPresent()) {
            Player player = existingPlayer.get();
            player.setUsername(updatedPlayer.getUsername());
            return playerRepository.save(player);
        }
        return null;
    }
    
    public boolean deletePlayer(Long id){
          Optional<Player> player = playerRepository.findById(id);
        if (player.isPresent()) {
            playerRepository.delete(player.get());
            return true;
        }
        return false;
    }
    public LoginResponseDTO createGuest(Optional<String> userName){
        String finalUsername = userName.orElseGet(() -> {
              return generateRandomUsername();
        });
        Player guest = new Player();
        guest.setUsername(finalUsername);
        guest.setAuth(null);

        Player savedGuest = playerRepository.save(guest);

        String token = jwtService.generateToken(savedGuest);
        return new LoginResponseDTO(
                savedGuest.getId(),
                savedGuest.getUsername(),
                token,
                savedGuest.getCreatedAt()
        );
    }

    private String generateRandomUsername(){
        String shortUuid = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "Gost_" + shortUuid;
    }
    

    }


