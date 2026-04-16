package com.jobportal.event;

import com.jobportal.service.EmailNotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class JobApplicationEmailListener {

    private final EmailNotificationService emailNotificationService;

    public JobApplicationEmailListener(EmailNotificationService emailNotificationService) {
        this.emailNotificationService = emailNotificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onJobApplicationSubmitted(JobApplicationSubmittedEvent event) {
        emailNotificationService.notifyJobApplicationSubmitted(event);
    }
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onCandidateProfileUpdateSubmitted(ProfileUpdateSubmissionEvent event) {
        System.out.println("working... update profile");
        emailNotificationService.notifyProfileUpdateSubmitted(event);
    }
}
