package com.example.imposter_backend.game.publicGame.models;

public enum Role {
    IMPOSTER("Imposter"),
    KNOWER("Knower");

    private final String displayValue;

    Role(String displayValue) {
        this.displayValue = displayValue;
    }
    public String getDisplayValue() {
        return displayValue;
    }
}
