package com.jobportal.service;

import com.jobportal.api.dto.JobDtos;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.Recruiter;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.JobSpecifications;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.event.JobApplicationSubmittedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final CandidateRepository candidateRepository;
    private final JobApplicationRepository applicationRepository;
    private final ApplicationEventPublisher eventPublisher;

    public JobServiceImpl(
            JobRepository jobRepository,
            RecruiterRepository recruiterRepository,
            CandidateRepository candidateRepository,
            JobApplicationRepository applicationRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    @Override
    public List<JobDtos.JobResponse> listAll() {
        return jobRepository.findAll().stream().map(JobServiceImpl::toJobResponse).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "jobs:list", key = "'p=' + #page + ':s=' + #size")
    @Override
    public Page<JobDtos.JobResponse> listAllPaged(int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return jobRepository.findAllByOrderByIdDesc(pr).map(JobServiceImpl::toJobResponse);
    }

    @Transactional(readOnly = true)
    @Override
    public JobDtos.JobResponse getById(Long id) {
        Job j = jobRepository.findById(id).orElseThrow(() -> new NotFoundException("Job not found"));
        return toJobResponse(j);
    }

    @Transactional(readOnly = true)
    @Override
    public List<JobDtos.JobResponse> search(String skill, String location) {
        String s = (skill == null || skill.isBlank()) ? null : skill.trim();
        String l = (location == null || location.isBlank()) ? null : location.trim();
        var spec = JobSpecifications.locationEqualsIgnoreCase(l)
                .and(JobSpecifications.requiredSkillsContainsAny(s == null ? List.of() : List.of(s)));
        return jobRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "id")).stream().map(JobServiceImpl::toJobResponse).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "jobs:search", key = "'skills=' + (#skillsCsv == null ? '' : #skillsCsv) + ':loc=' + (#location == null ? '' : #location) + ':p=' + #page + ':s=' + #size")
    @Override
    public Page<JobDtos.JobResponse> searchPaged(String skillsCsv, String location, int page, int size) {
        List<String> skills = (skillsCsv == null || skillsCsv.isBlank())
                ? List.of()
                : Arrays.stream(skillsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        String l = (location == null || location.isBlank()) ? null : location.trim();
        var spec = JobSpecifications.locationEqualsIgnoreCase(l)
                .and(JobSpecifications.requiredSkillsContainsAny(skills));

        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return jobRepository.findAll(spec, pr).map(JobServiceImpl::toJobResponse);
    }

    @Transactional
    @CacheEvict(cacheNames = {"jobs:list", "jobs:search"}, allEntries = true)
    @Override
    public JobDtos.JobResponse createJob(Long recruiterId, JobDtos.CreateJobRequest req) {
        Recruiter r = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new NotFoundException("Recruiter not found"));
        Job j = Job.builder()
                .title(req.title())
                .description(req.description())
                .requiredSkills(req.requiredSkills())
                .experienceRequired(req.experienceRequired())
                .location(req.location())
                .postedBy(r)
                .build();
        Job saved = jobRepository.save(j);
        return toJobResponse(saved);
    }

    @Transactional(readOnly = true)
    @Override
    public List<JobDtos.JobResponse> jobsByRecruiter(Long recruiterId) {
        return jobRepository.findByPostedByIdOrderByIdDesc(recruiterId).stream().map(JobServiceImpl::toJobResponse).toList();
    }

    @Transactional
    @Override
    public void applyToJob(Long jobId, Long candidateId) {
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId)) {
            throw new BadRequestException("Already applied to this job");
        }
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFoundException("Job not found"));
        Candidate cand = candidateRepository.findById(candidateId).orElseThrow(() -> new NotFoundException("Candidate not found"));

        JobApplication app = JobApplication.builder()
                .job(job)
                .candidate(cand)
                .appliedAt(Instant.now())
                .build();
        applicationRepository.save(app);

        Recruiter postedBy = job.getPostedBy();
        eventPublisher.publishEvent(new JobApplicationSubmittedEvent(
                job.getTitle(),
                postedBy.getEmail(),
                cand.getName(),
                cand.getEmail()
        ));
    }

    @Transactional(readOnly = true)
    @Override
    public JobDtos.ApplicationsResponse applicantsForJob(Long jobId, Long recruiterId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFoundException("Job not found"));
        if (!job.getPostedBy().getId().equals(recruiterId)) {
            throw new BadRequestException("You can only view applications for your own jobs");
        }

        List<JobDtos.ApplicationResponse> apps = applicationRepository.findByJobIdOrderByIdDesc(jobId)
                .stream()
                .map(a -> new JobDtos.ApplicationResponse(
                        a.getId(),
                        a.getAppliedAt(),
                        new JobDtos.CandidateSummary(
                                a.getCandidate().getId(),
                                a.getCandidate().getName(),
                                a.getCandidate().getEmail(),
                                a.getCandidate().getExperience(),
                                a.getCandidate().getSkills(),
                                a.getCandidate().getLocation(),
                                a.getCandidate().getResumePath()
                        )
                ))
                .toList();

        return new JobDtos.ApplicationsResponse(jobId, apps);
    }

    private static JobDtos.JobResponse toJobResponse(Job j) {
        Recruiter r = j.getPostedBy();
        JobDtos.RecruiterSummary recruiter = new JobDtos.RecruiterSummary(r.getId(), r.getName(), r.getCompany());
        return new JobDtos.JobResponse(
                j.getId(),
                j.getTitle(),
                j.getDescription(),
                j.getRequiredSkills(),
                j.getExperienceRequired(),
                j.getLocation(),
                recruiter
        );
    }
}

