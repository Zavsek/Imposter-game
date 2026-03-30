package com.example.imposter_backend.game.privateGame;

import com.example.imposter_backend.auth.models.Player;
import com.example.imposter_backend.auth.services.PlayerService;
import com.example.imposter_backend.game.CommonUtils;
import com.example.imposter_backend.game.privateGame.models.PrivateGame;
import com.example.imposter_backend.game.privateGame.models.PrivateParticipant;
import com.example.imposter_backend.game.privateGame.repository.PrivateGameRepository;
import com.example.imposter_backend.game.publicGame.models.Participation;
import com.example.imposter_backend.game.publicGame.models.Role;
import com.example.imposter_backend.game.privateGame.repository.PrivateParticipantRepository;
import com.example.imposter_backend.game.privateGame.models.response.GameDetailsDTO;
import com.example.imposter_backend.game.privateGame.models.response.ParticipantDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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
        checkForDuplicateNames(names);
        Player player = playerService.getPlayerById(id);
        if(player == null) {
            throw new IllegalArgumentException("Player not found");
        }
        CommonUtils.validateImposterCountIsValid(numOfImposters, names.size());

        List<String> imposterNames = determineImposters(names, numOfImposters);
        PrivateGame createdGame = createPrivateGameInstance(player,imposterHint,word);

        List<ParticipantDTO> participantDTOs = getParticipantsList(names,createdGame, imposterNames);

        return new GameDetailsDTO(
                createdGame.getId(),
                createdGame.getWord(),
                createdGame.getImposterHint(),
                participantDTOs
        );
    }

    private void checkForDuplicateNames(ArrayList<String> names) {
        Set<String> uniqueNames = new HashSet<>(names);
        if(uniqueNames.size() != names.size()) {throw new IllegalArgumentException("Duplicate names are not allowed");}
    }

    private List<ParticipantDTO> getParticipantsList(ArrayList<String> names,
                                                     PrivateGame createdGame,
                                                     List<String> imposterNames) {
        List<ParticipantDTO> participantDTOs = new ArrayList<>();
        List<PrivateParticipant> participations = new ArrayList<>();
        for(String name : names){
            PrivateParticipant participant = new PrivateParticipant();
            participant.setGame(createdGame);
            participant.setParticipantName(name);
            if(imposterNames.contains(name)){
                participant.setRole(Role.IMPOSTER);
            }
            else participant.setRole(Role.KNOWER);
            participations.add(participant);
            participantDTOs.add(new ParticipantDTO(participant.getParticipantName(), participant.getRole().name()));
        }
        privateParticipantRepository.saveAll(participations);
        return participantDTOs;
    }

    private PrivateGame createPrivateGameInstance(Player player, String imposterHint, String word) {
        PrivateGame game = new PrivateGame();
        game.setHost(player);
        game.setImposterHint(imposterHint);
        game.setWord(word);
        PrivateGame createdGame = privateGameRepository.save(game);
        return createdGame;
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
        //return the beginning of the list as a list of imposters
        Collections.shuffle(participants);
        return participants.subList(0, numOfImposters);
    }
}
