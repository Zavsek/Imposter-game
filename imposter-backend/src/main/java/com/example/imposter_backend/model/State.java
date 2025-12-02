package com.example.imposter_backend.model;

public enum State {
    LOBBY("Lobby"),
    PLAYING("Playing"),
    FINISHED("Finished");

    private final String displayValue;

    State(String displayValue) {
        this.displayValue = displayValue;
    }
    public String getDisplayValue() {
        return displayValue;
    }
}
