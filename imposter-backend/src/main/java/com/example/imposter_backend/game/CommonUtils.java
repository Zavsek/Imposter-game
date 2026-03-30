package com.example.imposter_backend.game;

import com.example.imposter_backend.game.publicGame.models.Participation;

import java.util.List;

public class CommonUtils {
    public static  void validateImposterCountIsValid(int numImposters,
                                              int numOfParticipants) {
        if(numOfParticipants < 3 || numOfParticipants > 16) {
            throw new IllegalArgumentException("There must be between 3 and 16 Participants");
        }
        if(numImposters < 1  || numImposters > numOfParticipants/2 || numImposters > 4) {
            throw new IllegalArgumentException("Invalid number of imposters, there can only between 1 and 4 imposters, and the number of imposters cannot exceed half the number of players");
        }
    }
}
