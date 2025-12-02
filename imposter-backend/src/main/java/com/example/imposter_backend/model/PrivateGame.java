package com.example.imposter_backend.model;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name ="private_game")
public class PrivateGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name= "host_id", nullable = false)
    private Player host;

    @Column(name="word", nullable=false, updatable=false)
    private String word;

    @Column(name="imposter_hint", nullable = false, updatable = false)
    private String imposterHint;

    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable=false)
    private LocalDateTime createdAt;

    @Column(name="finished_at", nullable = false, updatable=true)
    private LocalDateTime finishedAt;


    public long getId() {
        return id;
    }

    public Player getHost() {
        return host;
    }

    public String getWord() {
        return word;
    }

    public String getImposterHint() {
        return imposterHint;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setHost(Player host) {
        this.host = host;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public void setImposterHint(String imposterHint) {
        this.imposterHint = imposterHint;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
