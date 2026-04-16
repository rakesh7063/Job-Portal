package com.jobportal.service;

import com.jobportal.event.JobApplicationSubmittedEvent;
import com.jobportal.event.ProfileUpdateSubmissionEvent;
import org.springframework.scheduling.annotation.Async;

public interface EmailNotificationService {

    @Async
    void notifyJobApplicationSubmitted(JobApplicationSubmittedEvent event);
    @Async
    void notifyProfileUpdateSubmitted(ProfileUpdateSubmissionEvent event);
}
