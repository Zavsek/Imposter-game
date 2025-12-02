package com.example.imposter_backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="game")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="code", nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name="state")
    private State state;

    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable=false)
    private LocalDateTime createdAt;

    @Column(name="started_at", nullable = true, updatable = true)
    private LocalDateTime startedAt;

    @Column(name="finished_at", nullable = true, updatable=true)
    private LocalDateTime finishedAt;

    @Column(name="outcome", nullable = true, updatable=true)
    private String outcome;

    @Column(name="word", nullable = true)
    private String word;

    @Column(name="hint", nullable = true)
    private String hint;

    @ManyToOne
    @JoinColumn(name= "host_id", nullable = false)
    private Player host;

    public void setId(Long id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public void setHost(Player host) {
        this.host = host;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public State getState() {
        return state;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public String getOutcome() {
        return outcome;
    }

    public String getWord() {
        return word;
    }

    public String getHint() {
        return hint;
    }

    public Player getHost() {
        return host;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }
}
