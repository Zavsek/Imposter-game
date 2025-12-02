package com.example.imposter_backend.service;// package com.example.imposter_backend.service;
// Uvozi: import org.springframework.security.core.userdetails.*; 

import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.repository.PlayerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class PlayerDetailsService implements UserDetailsService {

    private final PlayerRepository playerRepository;

    public PlayerDetailsService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String playerIdString) throws UsernameNotFoundException {
        Long id = Long.parseLong(playerIdString); // Ne potrebujemo več try-catch, če je koda pravilna.

        return playerRepository.findById(id)
                .map(player -> {

                    return new org.springframework.security.core.userdetails.User(
                            player.getId().toString(), // Username = ID
                            player.getAuth().getHashedPassword(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                })
                .orElseThrow(() -> new UsernameNotFoundException("Player not found with id: " + playerIdString));
        }


    }
