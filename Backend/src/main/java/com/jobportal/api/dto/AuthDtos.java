package com.jobportal.api.dto;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterCandidateRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank
            @Pattern(
                    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$",
                    message = "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
            )
            String password,
            @NotNull @PositiveOrZero Integer experience,
            String skills,
            String location
    ) {
    }

    public record RegisterRecruiterRequest(
            @NotBlank String name,
            @NotBlank String company,
            @Email @NotBlank String email,
            @NotBlank
            @Pattern(
                    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$",
                    message = "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
            )
            String password
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record ForgotPasswordRequest(
         @Email @NotNull String email,
         @NotBlank
         @Pattern(
                 regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$",
                 message = "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
         )
         String password
    ){}

    public record AuthResponse(
            String token,
            String role
    ) {
    }
}

