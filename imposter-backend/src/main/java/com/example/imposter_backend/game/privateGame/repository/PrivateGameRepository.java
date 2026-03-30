package com.example.imposter_backend.game.privateGame.repository;

import com.example.imposter_backend.game.privateGame.models.PrivateGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivateGameRepository extends JpaRepository<PrivateGame,Long> {
}
