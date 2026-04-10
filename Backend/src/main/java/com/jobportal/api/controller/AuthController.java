package com.jobportal.api.controller;

import com.jobportal.api.dto.AuthDtos;
import com.jobportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/candidate")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerCandidate(@Valid @RequestBody AuthDtos.RegisterCandidateRequest req) {
        authService.registerCandidate(req);
    }

    @PostMapping("/register/recruiter")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerRecruiter(@Valid @RequestBody AuthDtos.RegisterRecruiterRequest req) {
        authService.registerRecruiter(req);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        return new ResponseEntity<>( authService.login(req), HttpStatus.OK);
    }
}

