package com.example.imposter_backend.service;


import com.example.imposter_backend.response.AuthDTO.LoginResponseDTO;
import org.springframework.stereotype.Service;

import com.example.imposter_backend.model.Auth;
import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.repository.AuthRepository;
import com.example.imposter_backend.repository.PlayerRepository;
import com.example.imposter_backend.response.AuthDTO.LoginRequestDTO;
import com.example.imposter_backend.response.AuthDTO.RegistrationRequestDTO;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

import org.mindrot.jbcrypt.*;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PlayerRepository playerRepository;
    private final JwtService jwtService;
    public AuthService (PlayerRepository playerRepository, AuthRepository authRepository, JwtService jwtService) {
        this.playerRepository = playerRepository;
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    public String hashPassword(String password){
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        return hashedPassword;
    }
    @Transactional
    public String register (RegistrationRequestDTO request){
        if(playerRepository.existstByEmail(request.email())){
            throw new IllegalArgumentException("Email is already registered");
        }

        Auth auth = new Auth();
        auth.setEmail(request.email());
        auth.setHashedPassword(hashPassword(request.password()));
        
        authRepository.save(auth);

        Player player = new Player();
        player.setUsername(request.username());
        player.setAuth(auth);
        
        playerRepository.save(player);

        return "Registration Successfull";
    }
     public LoginResponseDTO login(LoginRequestDTO request){
            Auth auth= authRepository.findByEmail(request.email()).orElseThrow(()-> new IllegalArgumentException("Credential not found"));

                String requestPass = request.password();
                String userPass = auth.getHashedPassword();
                boolean authenticated = BCrypt.checkpw(requestPass, userPass);
                if(!authenticated) throw new IllegalArgumentException("Credential do not match");
                Player player = playerRepository.findByAuth(auth).orElseThrow(()-> new IllegalStateException("Player not found for auth record"));
                String token = jwtService.generateToken(player);

                return new LoginResponseDTO(player.getId(), player.getUsername(), token, LocalDateTime.now());


        }
}
