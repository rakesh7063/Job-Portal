package com.jobportal.event;

public record JobApplicationSubmittedEvent(
        String jobTitle,
        String recruiterEmail,
        String candidateName,
        String candidateEmail
) {}
