package com.jobportal.api.controller;

import com.jobportal.api.dto.JobDtos;
import com.jobportal.security.SecurityUtils;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<JobDtos.JobResponse>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return new ResponseEntity<>( jobService.listAllPaged(page, size), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDtos.JobResponse> details(@PathVariable Long id) {
        return new ResponseEntity<>( jobService.getById(id), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<JobDtos.JobResponse> >search(
            @RequestParam(required = false) String skill,     // backward-compatible
            @RequestParam(required = false) String skills,    // bonus: comma-separated list
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String effectiveSkills = (skills != null && !skills.isBlank()) ? skills : skill;
        return new ResponseEntity<>( jobService.searchPaged(effectiveSkills, location, page, size), HttpStatus.OK);
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<String> apply(@PathVariable Long id) {
        var user = SecurityUtils.currentUser();
        jobService.applyToJob(id, user.userId());
        return new ResponseEntity<>("Apply successful...",HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<JobDtos.JobResponse> create(@Valid @RequestBody JobDtos.CreateJobRequest req) {
        var user = SecurityUtils.currentUser();
        return new ResponseEntity<>(jobService.createJob(user.userId(), req), HttpStatus.CREATED);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public  ResponseEntity<List<JobDtos.JobResponse>> mine() {
        var user = SecurityUtils.currentUser();
        return new ResponseEntity<>( jobService.jobsByRecruiter(user.userId()), HttpStatus.OK);
    }
}

