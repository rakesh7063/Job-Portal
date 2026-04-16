package com.jobportal.event;

public record ProfileUpdateSubmissionEvent(
        String name,
        String gmail,
        String skill,
        String location
) {
}
