package com.example.imposter_backend.service;

import com.example.imposter_backend.model.Player;
import com.example.imposter_backend.model.PrivateGame;
import com.example.imposter_backend.model.PrivateParticipant;
import com.example.imposter_backend.model.Role;
import com.example.imposter_backend.repository.PlayerRepository;
import com.example.imposter_backend.repository.PrivateGameRepository;
import com.example.imposter_backend.repository.PrivateParticipantRepository;
import com.example.imposter_backend.response.PrivateGameDTO.GameDetailsDTO;
import com.example.imposter_backend.response.PrivateGameDTO.ParticipantDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PrivateGameService {

    private final PrivateGameRepository privateGameRepository;
    private final PlayerService playerService;
    private final PrivateParticipantRepository privateParticipantRepository;
    public PrivateGameService(PrivateGameRepository privateGameRepository, PlayerService playerService, PrivateParticipantRepository privateParticipantRepository) {
        this.playerService = playerService;
        this.privateGameRepository = privateGameRepository;
        this.privateParticipantRepository = privateParticipantRepository;
    }
    @Transactional
    public GameDetailsDTO createGame(Long id, ArrayList<String> names, int numOfImposters,  String word, String imposterHint) {
        Player player = playerService.getPlayerById(id);
        if(player == null) {
            throw new IllegalArgumentException("Player not found");
        }
        if(names.size() < 3 || names.size() > 16) {
            throw new IllegalArgumentException("There must be between 3 and 16 names");
        }
        if(numOfImposters < 1  || numOfImposters > names.size()/2 || numOfImposters > 4) {
            throw new IllegalArgumentException("Invalid number of imposters, there can only between 1 and 4 imposters, and the number of imposters cannot exceed half the number of players");
        }
        List<String> imposterNames = determineImposters(names, numOfImposters);
        PrivateGame game = new PrivateGame();
        game.setHost(player);
        game.setFinishedAt(null);
        game.setImposterHint(imposterHint);
        game.setWord(word);
        PrivateGame createdGame = privateGameRepository.save(game);
        List<ParticipantDTO> participantDTOs = new ArrayList<>();
        for(String name : names){
            PrivateParticipant participant = new PrivateParticipant();
            participant.setGame(createdGame);
            participant.setParticipantName(name);
            if(imposterNames.contains(name)){
                participant.setRole(Role.IMPOSTER);
            }
            else participant.setRole(Role.KNOWER);
            participantDTOs.add(new ParticipantDTO(participant.getParticipantName(), participant.getRole().name()));
            privateParticipantRepository.save(participant);
        }
        return new GameDetailsDTO(
                createdGame.getId(),
                createdGame.getWord(),
                createdGame.getImposterHint(),
                participantDTOs
        );
    }

    public String finishGame(Long id, LocalDateTime finishTime) {
        PrivateGame game =  privateGameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));
        game.setFinishedAt(finishTime);
        privateGameRepository.save(game);
        return "Game has successfully finished.";
    }

    private List<String> determineImposters(List<String> allNames, int numOfImposters) {

        List<String> participants = new ArrayList<>(allNames);
        //return beginning of list as list of imposters
        Collections.shuffle(participants);
        return participants.subList(0, numOfImposters);
    }
}
