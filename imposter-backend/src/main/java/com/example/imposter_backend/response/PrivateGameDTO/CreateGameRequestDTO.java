package com.example.imposter_backend.response.PrivateGameDTO;

import java.util.ArrayList;

public record CreateGameRequestDTO(Long hostId,
                                   ArrayList<String> names,
                                   int numOfImposters,
                                   String word,
                                   String imposterHint) {
}
