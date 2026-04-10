package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public final class JobSpecifications {
    private JobSpecifications() {
    }

    public static Specification<Job> locationEqualsIgnoreCase(String location) {
        return (root, query, cb) -> {
            if (location == null || location.isBlank()) return cb.conjunction();
            return cb.equal(cb.lower(root.get("location")), location.trim().toLowerCase());
        };
    }

    /**
     * Matches when requiredSkills contains any of the provided skills (case-insensitive).
     * Input example: ["java", "spring"] -> requiredSkills LIKE %java% OR %spring%
     */
    public static Specification<Job> requiredSkillsContainsAny(List<String> skills) {
        return (root, query, cb) -> {
            if (skills == null || skills.isEmpty()) return cb.conjunction();
            var field = cb.lower(root.get("requiredSkills"));
            return cb.or(
                    skills.stream()
                            .filter(s -> s != null && !s.isBlank())
                            .map(s -> cb.like(field, "%" + s.trim().toLowerCase() + "%"))
                            .toArray(jakarta.persistence.criteria.Predicate[]::new)
            );
        };
    }
}

