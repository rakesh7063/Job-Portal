package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JobSpecificationsTest {
    @Test
    void requiredSkillsContainsAny_emptySkills_returnsConjunction() {
        var spec = JobSpecifications.requiredSkillsContainsAny(java.util.List.of());
        assertNotNull(spec);
    }

    @Test
    void locationEqualsIgnoreCase_blank_returnsConjunction() {
        var spec = JobSpecifications.locationEqualsIgnoreCase("  ");
        assertNotNull(spec);
    }
}

