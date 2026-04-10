package com.jobportal.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public final class CandidateDtos {
    private CandidateDtos() {
    }

    public record CandidateProfileResponse(
            Long id,
            String name,
            String email,
            int experience,
            String skills,
            String location
    ) {
    }

    public record UpdateCandidateProfileRequest(
            @NotBlank String name,
            @NotNull @PositiveOrZero Integer experience,
            String skills,
            String location
    ) {
    }
}

