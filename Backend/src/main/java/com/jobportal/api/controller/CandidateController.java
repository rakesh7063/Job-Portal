package com.jobportal.api.controller;

import com.jobportal.api.dto.CandidateDtos;
import com.jobportal.security.SecurityUtils;
import com.jobportal.security.UserRole;
import com.jobportal.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {
    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<CandidateDtos.CandidateProfileResponse> profile() {
        var user = SecurityUtils.currentUser();
        if (user.role() != UserRole.ROLE_CANDIDATE) {
            throw new IllegalStateException("Unexpected role");
        }
        return  new ResponseEntity<>(candidateService.getProfile(user.userId()), HttpStatus.OK);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<CandidateDtos.CandidateProfileResponse> update(@Valid @RequestBody CandidateDtos.UpdateCandidateProfileRequest req) {
        var user = SecurityUtils.currentUser();
        return new ResponseEntity<>( candidateService.updateProfile(user.userId(), req), HttpStatus.OK);
    }

    @PostMapping( value = "/profile/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<CandidateDtos.CandidateProfileResponse> uploadResume(@RequestParam("resume") MultipartFile file) {
        var user = SecurityUtils.currentUser();
        if (user.role() != UserRole.ROLE_CANDIDATE) {
            throw new IllegalStateException("Unexpected role");
        }

        try {
            candidateService.uploadResume(user.userId(), file.getBytes(), file.getOriginalFilename());
            return new ResponseEntity<>(candidateService.getProfile(user.userId()), HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read resume file", e);
        }
    }

    @GetMapping("/{candidateId}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<CandidateDtos.CandidateProfileResponse> getCandidateProfile(@PathVariable Long candidateId) {
        return new ResponseEntity<>(candidateService.getProfile(candidateId), HttpStatus.OK);
    }
}

