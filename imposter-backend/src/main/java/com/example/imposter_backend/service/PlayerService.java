package com.example.imposter_backend.service;

import java.util.List;
import java.util.Optional;

import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.repository.PlayerRepository;

public class PlayerService {
    private final PlayerRepository playerRepository;
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
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
}
