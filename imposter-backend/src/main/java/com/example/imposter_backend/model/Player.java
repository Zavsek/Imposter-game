package com.example.imposter_backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;


@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.Size(min = 5, max = 20, message = "Username must be between 5 and 20 characters long.")
    @Column(name = "name")
    private String username;

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @JoinColumn(name="auth_id")
    private Auth auth;
    
    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable=true)
    private LocalDateTime createdAt;

    public Player(){
    }
    public Player(String username, Auth auth, LocalDateTime createdAt){
        this.username= username;
        this.auth = auth;
        this.createdAt = createdAt;
    }
    public Player(String username, LocalDateTime createdAt){
        this.username= username;
        this.createdAt = createdAt;
    }
    public Player(Long id, String username, Auth auth, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.auth = auth;
        this.createdAt = createdAt;
    }


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public Auth getAuth(){
        return auth;
    }
    public void setAuth(Auth auth){
        this.auth = auth;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    @PrePersist
    private void setCreationTimestamp(){
        this.createdAt = LocalDateTime.now();
    }
}
