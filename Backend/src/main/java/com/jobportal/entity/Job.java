package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "jobs",
        indexes = {
                @Index(name = "idx_job_location", columnList = "location"),
                @Index(name = "idx_job_experience", columnList = "experience_required")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 8000)
    private String description;

    @Column(name = "required_skills", nullable = false)
    private String requiredSkills;

    @Column(name = "experience_required", nullable = false)
    private int experienceRequired;

    @Column(nullable = false)
    private String location;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by_id", nullable = false)
    private Recruiter postedBy;
}

