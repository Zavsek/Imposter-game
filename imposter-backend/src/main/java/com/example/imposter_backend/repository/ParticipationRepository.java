package com.example.imposter_backend.repository;

import com.example.imposter_backend.model.Participation;
import com.example.imposter_backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation,Long> {
    List<Participation> findByGameId(Long id);
    boolean existsByGameIdAndPlayerId(Long gameId, Long playerId);
    Participation findByGameIdAndPlayerId(Long gameId, Long playerId);
    @Query("SELECT p.player FROM Participation p WHERE p.game.id = :gameId")
    List<Player> findAllPlayersByGameId(@Param("gameId") Long gameId);
}
