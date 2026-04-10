package com.jobportal.service;

import com.jobportal.api.dto.JobDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {
    @Mock JobRepository jobRepository;
    @Mock RecruiterRepository recruiterRepository;
    @Mock CandidateRepository candidateRepository;
    @Mock JobApplicationRepository applicationRepository;

    @InjectMocks JobService jobService;

    @Test
    void applyToJob_rejectsDuplicate() {
        when(applicationRepository.existsByJobIdAndCandidateId(5L, 7L)).thenReturn(true);
        assertThrows(BadRequestException.class, () -> jobService.applyToJob(5L, 7L));
    }

    @Test
    void createJob_requiresRecruiter() {
        when(recruiterRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> jobService.createJob(99L,
                new JobDtos.CreateJobRequest("t", "d", "Java", 1, "Kolkata")));
    }

    @Test
    void applicantsForJob_rejectsIfNotOwner() {
        Recruiter owner = Recruiter.builder().id(1L).name("R").company("C").email("r@test.com").password("x").build();
        Recruiter other = Recruiter.builder().id(2L).name("R2").company("C2").email("r2@test.com").password("x").build();
        Job job = Job.builder().id(123L).title("t").description("d").requiredSkills("s").experienceRequired(0).location("l").postedBy(owner).build();

        when(jobRepository.findById(123L)).thenReturn(Optional.of(job));
        assertThrows(BadRequestException.class, () -> jobService.applicantsForJob(123L, other.getId()));
    }
}

