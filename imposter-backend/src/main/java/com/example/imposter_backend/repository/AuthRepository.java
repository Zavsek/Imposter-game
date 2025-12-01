package com.example.imposter_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.imposter_backend.model.Auth;

@Repository
public interface AuthRepository  extends JpaRepository<Auth, Long>{
        Optional<Auth> findByEmail(String email);
        boolean existsByEmail(String email);
}
