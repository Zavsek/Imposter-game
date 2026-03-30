package com.example.imposter_backend.game.privateGame.models;


import com.example.imposter_backend.game.publicGame.models.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "private_participant")
public class PrivateParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private PrivateGame game;

    @Column(name="participant_name", nullable = false)
    private String participantName;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable = false)
    private Role role;

    public Long getId() {
        return id;
    }

    public PrivateGame getGame() {
        return game;
    }

    public String getParticipantName() {
        return participantName;
    }

    public Role getRole() {
        return role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setGame(PrivateGame game) {
        this.game = game;
    }

    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
