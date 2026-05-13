package com.jobportal.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AiDtos {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateAnalysisResult {
        private String candidateName;
        private Long candidateId;
        private int matchScore;  // 0-100
        private String recommendation;  // Highly Recommended / Recommended / Consider / Not Recommended
        private String summary;
        private List<String> matchingSkills;
        private List<String> strengths;
        private List<String> concerns;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobAiAnalysisRequest {
        private String jobDescription;
        private String[] candidateIds;  // Optional: analyze specific candidates
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobAiAnalysisResponse {
        private Long jobId;
        private String jobTitle;
        private List<CandidateAnalysisResult> topCandidates;  // Top 5 ranked by match score
        private String analysisTimestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeSummary {
        private Long candidateId;
        private String candidateName;
        private String email;
        private int experience;
        private String skills;
        private String location;
        private boolean hasResume;
        private String resumePath;
    }
}
