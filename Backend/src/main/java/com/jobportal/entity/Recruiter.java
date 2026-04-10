package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "recruiters",
        indexes = {
                @Index(name = "idx_recruiter_email", columnList = "email", unique = true),
                @Index(name = "idx_recruiter_company", columnList = "company")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recruiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}
