package com.jobportal.api.controller;

import com.jobportal.api.dto.AiDtos;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.exception.NotFoundException;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.security.SecurityUtils;
import com.jobportal.service.GeminiAiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller for AI-powered candidate analysis using Gemini
 */
@RestController
@RequestMapping("/api/ai")
public class AiAnalysisController {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final GeminiAiService geminiAiService;

    public AiAnalysisController(JobRepository jobRepository,
                                 JobApplicationRepository jobApplicationRepository,
                                 GeminiAiService geminiAiService) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.geminiAiService = geminiAiService;
    }

    /**
     * Analyze all applicants for a job and return top 5 candidates ranked by match score
     * Only the recruiter who posted the job can access this
     */
    @PostMapping("/jobs/{jobId}/analyze")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<AiDtos.JobAiAnalysisResponse> analyzeJobApplicants(@PathVariable Long jobId) {
        var user = SecurityUtils.currentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        // Verify recruiter owns the job
        if (!job.getPostedBy().getId().equals(user.userId())) {
            throw new IllegalStateException("Unauthorized: You can only analyze applicants for your own jobs");
        }

        // Get all applications for this job
        List<JobApplication> applications = jobApplicationRepository.findByJobIdOrderByIdDesc(jobId);

        if (applications.isEmpty()) {
            return ResponseEntity.ok(
                AiDtos.JobAiAnalysisResponse.builder()
                    .jobId(jobId)
                    .jobTitle(job.getTitle())
                    .topCandidates(List.of())
                    .analysisTimestamp(LocalDateTime.now().toString())
                    .build()
            );
        }

        // Analyze each candidate
        List<AiDtos.CandidateAnalysisResult> analyses = applications.stream()
                .map(app -> analyzeSingleCandidate(job, app))
                .toList();

        // Sort by match score and take top 5
        List<AiDtos.CandidateAnalysisResult> topFive = analyses.stream()
                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()))
                .limit(5)
                .toList();

        return ResponseEntity.ok(
            AiDtos.JobAiAnalysisResponse.builder()
                .jobId(jobId)
                .jobTitle(job.getTitle())
                .topCandidates(topFive)
                .analysisTimestamp(LocalDateTime.now().toString())
                .build()
        );
    }

    /**
     * Analyze a specific candidate against a job
     */
    @GetMapping("/jobs/{jobId}/candidates/{candidateId}/analyze")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<AiDtos.CandidateAnalysisResult> analyzeCandidateForJob(
            @PathVariable Long jobId,
            @PathVariable Long candidateId) {

        var user = SecurityUtils.currentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        // Verify recruiter owns the job
        if (!job.getPostedBy().getId().equals(user.userId())) {
            throw new IllegalStateException("Unauthorized");
        }

        JobApplication app = jobApplicationRepository
                .findByJobIdAndCandidateId(jobId, candidateId)
                .orElseThrow(() -> new NotFoundException("Application not found"));

        AiDtos.CandidateAnalysisResult analysis = analyzeSingleCandidate(job, app);
        return ResponseEntity.ok(analysis);
    }

    /**
     * Get applicant profiles with resume info for a job (recruiter view)
     */
    @GetMapping("/jobs/{jobId}/applicants")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<AiDtos.ResumeSummary>> getApplicantSummaries(@PathVariable Long jobId) {
        var user = SecurityUtils.currentUser();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        // Verify recruiter owns the job
        if (!job.getPostedBy().getId().equals(user.userId())) {
            throw new IllegalStateException("Unauthorized");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJobIdOrderByIdDesc(jobId);

        List<AiDtos.ResumeSummary> summaries = applications.stream()
                .map(app -> AiDtos.ResumeSummary.builder()
                    .candidateId(app.getCandidate().getId())
                    .candidateName(app.getCandidate().getName())
                    .email(app.getCandidate().getEmail())
                    .experience(app.getCandidate().getExperience())
                    .skills(app.getCandidate().getSkills())
                    .location(app.getCandidate().getLocation())
                    .hasResume(app.getCandidate().getResumePath() != null)
                    .resumePath(app.getCandidate().getResumePath())
                    .build())
                .toList();

        return ResponseEntity.ok(summaries);
    }

    // ===== PRIVATE HELPER METHODS =====

    private AiDtos.CandidateAnalysisResult analyzeSingleCandidate(Job job, JobApplication app) {
        var candidate = app.getCandidate();

        // Extract resume content if available
        String resumeContent = extractResumeContent(candidate.getResumePath());

        // Use Gemini AI to analyze candidate
        AiDtos.CandidateAnalysisResult analysis = geminiAiService.analyzeCandidateMatch(
                job.getDescription(),
                candidate.getName(),
                candidate.getSkills(),
                candidate.getExperience(),
                candidate.getLocation(),
                resumeContent
        );

        analysis.setCandidateId(candidate.getId());
        return analysis;
    }

    private String extractResumeContent(String resumePath) {
        if (resumePath == null) {
            return null;
        }

        try {
            // For PDF files, we would need PDF parsing library
            // For now, return a placeholder indicating resume exists
            return "Resume file: " + resumePath;
        } catch (Exception e) {
            return null;
        }
    }
}
