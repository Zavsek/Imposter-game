package com.example.imposter_backend.repository;

import com.example.imposter_backend.model.PrivateParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivateParticipantRepository extends JpaRepository<PrivateParticipant, Long> {
}
