package com.jobportal.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {
    private SecurityUtils() {
    }

    public static AuthenticatedUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user");
        }
        if (auth.getPrincipal() instanceof AuthenticatedUser u) {
            return u;
        }
        throw new IllegalStateException("Unexpected principal type: " + auth.getPrincipal().getClass().getName());
    }
}

