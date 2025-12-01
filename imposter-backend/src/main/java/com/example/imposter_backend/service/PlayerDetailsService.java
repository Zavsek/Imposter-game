package com.example.imposter_backend.service;// package com.example.imposter_backend.service;
// Uvozi: import org.springframework.security.core.userdetails.*; 

import com.example.imposter_backend.repository.PlayerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PlayerDetailsService implements UserDetailsService {

    private final PlayerRepository playerRepository;

    public PlayerDetailsService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String playerId) throws UsernameNotFoundException {


        Long id;
        try {
            id = Long.parseLong(playerId);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid player ID format.");
        }

        return playerRepository.findById(id)
                .map(player -> {

                    return new User(
                            player.getId().toString(),
                            "",
                            new ArrayList<>()
                    );
                })
                .orElseThrow(() -> new UsernameNotFoundException("Player not found with id: " + playerId));
    }
}