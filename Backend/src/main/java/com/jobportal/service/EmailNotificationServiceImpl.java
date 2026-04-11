package com.jobportal.service;

import com.jobportal.event.JobApplicationSubmittedEvent;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationServiceImpl.class);

    private final JavaMailSender mailSender;

    private final boolean mailEnabled;
    private final String mailUsername;
    private final String mailPassword;
    private final String mailFrom;

    @Value("${spring.mail.host:}")
    private String springMailHost;

    public EmailNotificationServiceImpl(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.mail.enabled:true}") boolean mailEnabled,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword,
            @Value("${app.mail.from:}") String mailFrom
    ) {
        this.mailSender = mailSender;
        this.mailEnabled = mailEnabled;
        this.mailUsername = mailUsername != null ? mailUsername.trim() : "";
        this.mailPassword = mailPassword != null ? mailPassword : "";
        this.mailFrom = StringUtils.hasText(mailFrom) ? mailFrom.trim() : this.mailUsername;
    }

    @PostConstruct
    void logMailStatus() {
        if (!mailEnabled) {
            log.info("Mail notifications disabled (app.mail.enabled / MAIL_ENABLED is false)");
        } else if (!StringUtils.hasText(mailUsername) || !StringUtils.hasText(mailPassword)) {
            log.info("Mail notifications disabled: set MAIL_USERNAME and MAIL_PASSWORD (or spring.mail.username/password)");
        } else {
            log.info("Mail notifications enabled (SMTP host: {})",
                    StringUtils.hasText(springMailHost) ? springMailHost : "(none)");
        }
    }

    @Override
    public void notifyJobApplicationSubmitted(JobApplicationSubmittedEvent event) {
        if (!mailEnabled) {
            log.debug("Mail notifications skipped: app.mail.enabled / MAIL_ENABLED is false");
            return;
        }
        if (mailSender == null) {
            log.warn("Mail notifications skipped: JavaMailSender not available (check spring.mail.host)");
            return;
        }
        if (!StringUtils.hasText(mailUsername) || !StringUtils.hasText(mailPassword)) {
            log.debug("Mail notifications skipped: set MAIL_USERNAME and MAIL_PASSWORD (or spring.mail.username/password)");
            return;
        }
        if (!StringUtils.hasText(mailFrom)) {
            log.warn("Mail notifications skipped: spring.mail.username / app.mail.from not set");
            return;
        }
        try {
            sendToRecruiter(event);
        } catch (MailAuthenticationException e) {
            logMailAuthFailure(e);
        } catch (MailException e) {
            log.warn("Failed to email recruiter at {}", event.recruiterEmail(), e);
        }
        try {
            sendToCandidate(event);
        } catch (MailAuthenticationException e) {
            logMailAuthFailure(e);
        } catch (MailException e) {
            log.warn("Failed to email candidate at {}", event.candidateEmail(), e);
        }
    }

    private void logMailAuthFailure(MailAuthenticationException e) {

        log.warn(
                "SMTP authentication failed (535). "
                        + "host={}, user={}",
                StringUtils.hasText(springMailHost) ? springMailHost : "?",
                maskEmail(mailUsername),
                e
        );
    }

    private static String maskEmail(String email) {
        if (!StringUtils.hasText(email) || !email.contains("@")) {
            return "(unset)";
        }
        int at = email.indexOf('@');
        String local = email.substring(0, at);
        String domain = email.substring(at);
        String masked = local.length() <= 2 ? "**" : local.charAt(0) + "***";
        return masked + domain;
    }

    private void sendToRecruiter(JobApplicationSubmittedEvent event) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(event.recruiterEmail());
        msg.setReplyTo(event.candidateEmail());
        msg.setSubject("[Job Portal] New application: " + event.jobTitle());
        msg.setText(String.format(
                "Hello,%n%n%s (%s) has applied to your job \"%s\".%n%n— Job Portal",
                event.candidateName(),
                event.candidateEmail(),
                event.jobTitle()
        ));
        mailSender.send(msg);
    }

    private void sendToCandidate(JobApplicationSubmittedEvent event) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(event.candidateEmail());
        msg.setSubject("[Job Portal] Application received: " + event.jobTitle());
        msg.setText(String.format(
                "Hello %s,%n%nYour application for \"%s\" was submitted successfully. The employer may reach you at %s.%n%n— Job Portal",
                event.candidateName(),
                event.jobTitle(),
                event.candidateEmail()
        ));
        mailSender.send(msg);
    }
}
