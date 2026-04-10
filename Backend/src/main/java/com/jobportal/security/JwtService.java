package com.jobportal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final String secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-seconds}") long expirationSeconds
    ) {
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(AuthenticatedUser user) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
                .setSubject(user.email())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .addClaims(Map.of(
                        "role", user.role().name(),
                        "userId", user.userId()
                ))
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public AuthenticatedUser parse(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();
        String roleRaw = claims.get("role", String.class);
        Number userId = claims.get("userId", Number.class);
        if (email == null || roleRaw == null || userId == null) {
            throw new IllegalArgumentException("Invalid JWT claims");
        }
        return new AuthenticatedUser(userId.longValue(), email, UserRole.valueOf(roleRaw));
    }

    private SecretKey signingKey() {
        // Treat as Base64 only when it actually looks like Base64; otherwise use raw text.
        byte[] keyBytes = looksLikeBase64(secret)
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes(StandardCharsets.UTF_8);

        // HS256 needs >= 256-bit key. If shorter, derive a fixed 32-byte key.
        if (keyBytes.length < 32) {
            keyBytes = sha256(keyBytes);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static boolean looksLikeBase64(String s) {
        if (s == null) return false;
        String t = s.trim();
        // Base64 alphabet only (no '-' or '_'; those are Base64URL)
        return !t.isEmpty() && t.matches("^[A-Za-z0-9+/=]+$");
    }

    private static byte[] sha256(byte[] input) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(input);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}

