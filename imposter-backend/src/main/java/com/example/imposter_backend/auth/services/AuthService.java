package com.example.imposter_backend.auth.services;


import com.example.imposter_backend.auth.models.response.LoginResponseDTO;
import org.springframework.stereotype.Service;

import com.example.imposter_backend.auth.models.Auth;
import com.example.imposter_backend.auth.models.Player;
import com.example.imposter_backend.auth.repository.AuthRepository;
import com.example.imposter_backend.auth.repository.PlayerRepository;
import com.example.imposter_backend.auth.models.response.LoginRequestDTO;
import com.example.imposter_backend.auth.models.response.RegistrationRequestDTO;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

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
        return BCrypt.hashpw(password, BCrypt.gensalt());

    }

    public void checkPassword(String password, String hashedPassword){
        boolean authenticated =  BCrypt.checkpw(password, hashedPassword);
        if(!authenticated) throw new IllegalArgumentException("Credential do not match");
    }
    @Transactional
    public String register (RegistrationRequestDTO request){
        String email = request.email().toLowerCase();
        if(authRepository.existsByEmail(email)){
            throw new IllegalArgumentException("Email is already registered");
        }
        if(!checkEmailValidity(email)){
            throw new IllegalArgumentException("Email is not valid");
        }

        Auth auth = createAndSaveAuthInstance(email, request.password());
        createAndSavePlayerInstance(request.username(), auth);

        return "Registration Successful";
    }

    private void createAndSavePlayerInstance(String username, Auth auth) {
        Player player = new Player();
        player.setUsername(username);
        player.setAuth(auth);
        playerRepository.save(player);
    }

    private Auth createAndSaveAuthInstance(String email, String password) {
        Auth auth = new Auth();
        auth.setEmail(email);
        auth.setHashedPassword(hashPassword(password));
        authRepository.save(auth);
        return auth;
    }

    public boolean checkEmailValidity(String email){
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
        return Pattern.compile(regexPattern).matcher(email).matches();
    }

    // ------------------------------------------------------------------------------------------

    public LoginResponseDTO login(LoginRequestDTO request){
            Auth auth= authRepository.findByEmail(request.email().toLowerCase())
                    .orElseThrow(()-> new IllegalArgumentException("Credential not found"));


                checkPassword(request.password(), auth.getHashedPassword());
                Player player = playerRepository.findByAuth(auth)
                        .orElseThrow(()-> new IllegalStateException("Player not found for auth record"));
                String token = jwtService.generateToken(player);

                return new LoginResponseDTO(player.getId(),
                        player.getUsername(),
                        token,
                        LocalDateTime.now());
        }


}
