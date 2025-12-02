package com.example.imposter_backend.service;

import com.example.imposter_backend.repository.PrivateGameRepository;
import org.springframework.stereotype.Service;

@Service
public class PrivateGameService {

    private final PrivateGameRepository privateGameRepository;
    public PrivateGameService(PrivateGameRepository privateGameRepository) {
        this.privateGameRepository = privateGameRepository;
    }
}
