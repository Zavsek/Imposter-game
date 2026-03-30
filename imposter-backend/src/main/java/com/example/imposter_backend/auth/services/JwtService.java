package com.example.imposter_backend.auth.services;

import com.example.imposter_backend.auth.models.Player;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.function.Function;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String SECRET_KEY ;
    @Value("${app.jwt.expiration-ms}")
    private  int EXPIRATION_TIME;

    public String generateToken(Player player) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, player.getId().toString());
    }
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder().
                claims(claims).
                subject(subject).
                issuedAt(now).
                expiration(expirationDate).
                signWith(getSigningKey()).
                compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String playerIdFromToken = extractSubject(token);
        final String playerIdFromDetails = userDetails.getUsername();

        return (playerIdFromToken.equals(playerIdFromDetails) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
