package com.jobportal.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterCandidateRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank String password,
            @NotNull @PositiveOrZero Integer experience,
            String skills,
            String location
    ) {
    }

    public record RegisterRecruiterRequest(
            @NotBlank String name,
            @NotBlank String company,
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String token,
            String role
    ) {
    }
}

