package com.example.imposter_backend.service;


import org.springframework.stereotype.Service;

import com.example.imposter_backend.repository.PlayerRepository;
import com.example.imposter_backend.response.LoginRequestDTO;


import org.mindrot.jbcrypt.*;

@Service
public class AuthService {
    private final PlayerRepository playerRepository;
    public AuthService (PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    }
    public String hashPassword(String password){
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        return hashedPassword;
    }
    public String checkPassword(LoginRequestDTO request ){
       return "";
    }
}
