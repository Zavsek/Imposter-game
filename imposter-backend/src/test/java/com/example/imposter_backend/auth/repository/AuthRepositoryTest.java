package com.example.imposter_backend.auth.repository;

import com.example.imposter_backend.auth.models.Auth;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
@ActiveProfiles("test")
class AuthRepositoryTest {
    @Autowired
    private AuthRepository authRepository;

    @Test
    void testFindByEmail() {
        String email = "test@imposter.com";
        String password = "secret123";
        Auth mockAuth = new Auth();
        mockAuth.setEmail(email);
        mockAuth.setHashedPassword(password);
        authRepository.save(mockAuth);
        Optional<Auth> auth = authRepository.findByEmail(email);
        assertTrue(auth.isPresent());
        assertEquals(email, auth.get().getEmail());
    }


    @Test
    void shouldReturnTrueWhenEmailExists() {

        Auth auth = new Auth();
        auth.setEmail("exists@imposter.com");
        auth.setHashedPassword("hash");
        authRepository.save(auth);


        boolean exists = authRepository.existsByEmail("exists@imposter.com");


        assertTrue(exists);
    }

    @Test
    void shouldReturnFalseWhenEmailDoesNotExist() {
        // WHEN
        boolean exists = authRepository.existsByEmail("non-existent@imposter.com");

        // THEN
        assertFalse(exists);
    }
}