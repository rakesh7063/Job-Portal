package com.jobportal.api.controller;

import com.jobportal.api.dto.JobDtos;
import com.jobportal.security.SecurityUtils;
import com.jobportal.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final JobService jobService;

    public ApplicationController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<JobDtos.ApplicationsResponse> applicants(@PathVariable Long jobId) {
        var user = SecurityUtils.currentUser();
        return new ResponseEntity<>( jobService.applicantsForJob(jobId, user.userId()), HttpStatus.OK);
    }

    @GetMapping("/{jobId}/candidates/{candidateId}/resume")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long jobId, @PathVariable Long candidateId) {
        var user = SecurityUtils.currentUser();

        // Verify recruiter owns the job
        JobDtos.ApplicationsResponse apps = jobService.applicantsForJob(jobId, user.userId());

        // Find the candidate in the applications
        JobDtos.CandidateSummary candidate = apps.applications().stream()
                .filter(app -> app.candidate().id().equals(candidateId))
                .map(JobDtos.ApplicationResponse::candidate)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Candidate not found in job applications"));

        if (candidate.resumePath() == null) {
            throw new RuntimeException("No resume available for this candidate");
        }

        // Load the file
        Path filePath = Paths.get(candidate.resumePath());
        Resource resource = new FileSystemResource(filePath);

        if (!resource.exists()) {
            throw new RuntimeException("Resume file not found");
        }

        // Determine content type
        String contentType = "application/pdf"; // Default to PDF
        try {
            contentType = Files.probeContentType(filePath);
        } catch (Exception e) {
            // Keep default
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + candidate.name() + "_resume.pdf\"")
                .body(resource);
    }
}

