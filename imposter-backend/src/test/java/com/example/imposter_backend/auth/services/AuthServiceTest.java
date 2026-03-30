package com.example.imposter_backend.auth.services;

import com.example.imposter_backend.auth.models.Auth;
import com.example.imposter_backend.auth.models.Player;
import com.example.imposter_backend.auth.models.response.RegistrationRequestDTO;
import com.example.imposter_backend.auth.repository.AuthRepository;
import com.example.imposter_backend.auth.repository.PlayerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthRepository authRepository;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService underTest;
    private RegistrationRequestDTO validRequest;
    @BeforeEach
    void setUp() {
        validRequest = new RegistrationRequestDTO("Janez", "janez@email.com", "geslo123");
    }
    //1.
    @Test
    void register_ShouldSuccess_WhenDataIsValid() {

        when(authRepository.existsByEmail(anyString())).thenReturn(false);


        String response = underTest.register(validRequest);


        assertEquals("Registration Successfull", response);

        verify(authRepository, times(1)).save(any(Auth.class));
        verify(playerRepository, times(1)).save(any(Player.class));
    }



    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {

        when(authRepository.existsByEmail(validRequest.email())).thenReturn(true);


        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            underTest.register(validRequest);
        });

        assertEquals("Email is already registered", exception.getMessage());


        verify(authRepository, never()).save(any());
    }

    @Test
    void register_ShouldThrowException_WhenEmailIsInvalid() {

        RegistrationRequestDTO badEmailRequest = new RegistrationRequestDTO("Janez", "slaba-email-adresa", "geslo123");


        assertThrows(IllegalArgumentException.class, () -> {
            underTest.register(badEmailRequest);
        });
    }
}