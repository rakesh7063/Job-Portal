package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "candidates",
        indexes = {
                @Index(name = "idx_candidate_email", columnList = "email", unique = true),
                @Index(name = "idx_candidate_location", columnList = "location")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int experience;

    private String skills;

    private String location;
}
