package com.jobportal.config;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Normalizes SMTP secrets: strips spaces (Gmail app passwords), trims quotes from env copies.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MailPropertiesPasswordNormalizer implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        if (bean instanceof MailProperties mp) {
            if (mp.getUsername() != null) {
                String u = mp.getUsername().trim();
                if (u.startsWith("\"") && u.endsWith("\"") && u.length() >= 2) {
                    u = u.substring(1, u.length() - 1).trim();
                }
                mp.setUsername(u);
            }
            if (mp.getPassword() != null && !mp.getPassword().isEmpty()) {
                String p = mp.getPassword().trim();
                if ((p.startsWith("\"") && p.endsWith("\"")) || (p.startsWith("'") && p.endsWith("'"))) {
                    p = p.substring(1, p.length() - 1).trim();
                }
                String normalized = p.replaceAll("\\s+", "");
                mp.setPassword(normalized);
            }
        }
        return bean;
    }
}
