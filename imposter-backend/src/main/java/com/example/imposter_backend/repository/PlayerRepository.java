package com.example.imposter_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.imposter_backend.model.Auth;
import com.example.imposter_backend.model.Player;


@Repository
public interface PlayerRepository  extends JpaRepository<Player, Long> {
    Optional<Player> findByAuth(Auth auth);
    }

