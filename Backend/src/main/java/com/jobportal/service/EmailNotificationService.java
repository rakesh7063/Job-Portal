package com.jobportal.service;

import com.jobportal.event.JobApplicationSubmittedEvent;
import org.springframework.scheduling.annotation.Async;

public interface EmailNotificationService {

    @Async
    void notifyJobApplicationSubmitted(JobApplicationSubmittedEvent event);
}
