package com.jobportal.api.controller;

import com.jobportal.api.dto.JobDtos;
import com.jobportal.security.SecurityUtils;
import com.jobportal.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}

