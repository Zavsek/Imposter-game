package com.example.imposter_backend.service;

import java.util.List;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.imposter_backend.model.Auth;
import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.repository.AuthRepository;
import com.example.imposter_backend.repository.PlayerRepository;
import com.example.imposter_backend.response.LoginRequestDTO;
import com.example.imposter_backend.response.RegistrationRequestDTO;
@Service    
public class PlayerService {

    private final AuthRepository authRepository;
    private final PlayerRepository playerRepository;
    private final AuthService authService;
    public PlayerService(PlayerRepository playerRepository, AuthService authService, AuthRepository authRepository) {
        this.playerRepository = playerRepository;
        this.authService = authService;
        this.authRepository = authRepository;
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
    
    public String register (RegistrationRequestDTO request){
        if(playerRepository.existstByEmail(request.email())){
            throw new IllegalArgumentException("Email is already registered");
        }

        Auth auth = new Auth();
        auth.setEmail(request.email());
        auth.setHashedPassword(authService.hashPassword(request.password()));
        
        authRepository.save(auth);

        Player player = new Player();
        player.setUsername(request.username());
        player.setAuth(auth);
        
        playerRepository.save(player);

        return "Registration Successfull";
    }
    public Player login(LoginRequestDTO request){
            Optional<Auth> authExists = authRepository.findByEmail(request.email());
            if(authExists.isPresent()){
                String requestPass = request.password();
                Auth auth = authExists.get();
                String userPass = auth.getHashedPassword();
                boolean authenticated = BCrypt.checkpw(requestPass, userPass);
                if(authenticated) {
                    return playerRepository.findByAuth(auth);
                }
                else throw new IllegalArgumentException("Creadentials do not match");
            }
            else throw new IllegalArgumentException("Creadentials do not match");
        }
    }


