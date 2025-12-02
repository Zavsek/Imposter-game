package com.example.imposter_backend.service;

import com.example.imposter_backend.repository.GameRepository;
import com.example.imposter_backend.repository.ParticipationRepository;
import org.springframework.stereotype.Service;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final ParticipationRepository participationRepository;
    public GameService(GameRepository gameRepository,  ParticipationRepository participationRepository) {
        this.gameRepository = gameRepository;
        this.participationRepository = participationRepository;
    }
}
