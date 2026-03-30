package com.example.imposter_backend.game.privateGame.repository;

import com.example.imposter_backend.game.privateGame.models.PrivateParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivateParticipantRepository extends JpaRepository<PrivateParticipant, Long> {
}
