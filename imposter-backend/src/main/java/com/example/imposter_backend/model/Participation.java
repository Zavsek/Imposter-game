package com.example.imposter_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="participation")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="role", nullable = false)
    private Role role;

    @Column(name="is_eliminated", nullable = false)
    private Boolean isEliminated = false;

    @ManyToOne
    @JoinColumn(name="player_id", nullable = false)
    private Player player;
    @ManyToOne
    @JoinColumn(name="game_id", nullable = false)
    private Game game;

    @ManyToOne
    @JoinColumn(name="voted_for_player_id", nullable = false)
    private Player votedForPlayer;

    public void setId(Long id) {
        this.id = id;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    public void setIsEliminated(Boolean isEliminated) {
        this.isEliminated = isEliminated;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void setVote(Player votedForPlayer) {
        this.votedForPlayer = votedForPlayer;
    }

    public Long getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }
    public Boolean getIsEliminated() {
        return isEliminated;
    }
    public Player getPlayer() {
        return player;
    }

    public Game getGame() {
        return game;
    }

    public Player getvotedForPlayer() {
        return votedForPlayer;
    }
}
