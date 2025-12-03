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
import java.util.List;

@Service
public class PlayerDetailsService implements UserDetailsService {

    private final PlayerRepository playerRepository;

    public PlayerDetailsService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String playerIdString) throws UsernameNotFoundException {
        Long id;
        try {
            id = Long.parseLong(playerIdString);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid player ID format");
        }

        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Player not found with id: " + id));


        String password;
        List<SimpleGrantedAuthority> authorities;

        if (player.getAuth() != null) {
            //Registered
            password = player.getAuth().getHashedPassword();
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        } else {
            // Guest

            password = "";
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST"));
        }


        return new User(
                player.getId().toString(),
                password,
                authorities
        );
        }


    }
