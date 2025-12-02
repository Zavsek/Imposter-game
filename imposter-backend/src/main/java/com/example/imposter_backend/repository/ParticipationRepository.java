package com.example.imposter_backend.repository;

import com.example.imposter_backend.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation,Long> {
}
