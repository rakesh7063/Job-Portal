package com.jobportal.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.Instant;
import java.util.List;

public final class JobDtos {
    private JobDtos() {
    }

    public record JobResponse(
            Long id,
            String title,
            String description,
            String requiredSkills,
            int experienceRequired,
            String location,
            RecruiterSummary postedBy
    ) {
    }

    public record RecruiterSummary(
            Long id,
            String name,
            String company
    ) {
    }

    public record CreateJobRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotBlank String requiredSkills,
            @NotNull @PositiveOrZero Integer experienceRequired,
            @NotBlank String location
    ) {
    }

    public record ApplicationResponse(
            Long id,
            Instant appliedAt,
            CandidateSummary candidate
    ) {
    }

    public record CandidateSummary(
            Long id,
            String name,
            String email,
            int experience,
            String skills,
            String location,
            String resumePath
    ) {
    }

    public record ApplicationsResponse(
            Long jobId,
            List<ApplicationResponse> applications
    ) {
    }
}

