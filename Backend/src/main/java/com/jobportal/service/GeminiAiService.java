package com.jobportal.service;

import com.jobportal.api.dto.AiDtos;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for Gemini AI integration - analyzes job descriptions and candidate profiles
 */
@Service
public class GeminiAiService {

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.gemini.enabled:true}")
    private boolean geminiEnabled;

    @Value("${app.gemini.model-name:gemini-3-flash-preview}")
    private String geminiModelName;

    private GoogleAiGeminiChatModel chatModel;

    public GeminiAiService() {
        // Constructor for Spring
    }

    /**
     * Analyzes a candidate's profile and resume against a job description
     * @param jobDescription The job posting description
     * @param candidateName Candidate name
     * @param candidateSkills Candidate skills
     * @param candidateExperience Years of experience
     * @param candidateLocation Candidate location
     * @param resumeContent Resume content (extracted from PDF or text)
     * @return Analysis result with match score and insights
     */
    public AiDtos.CandidateAnalysisResult analyzeCandidateMatch(
            String jobDescription,
            String candidateName,
            String candidateSkills,
            int candidateExperience,
            String candidateLocation,
            String resumeContent) {

        if (!geminiEnabled || geminiApiKey == null || geminiApiKey.isEmpty()) {
            // Fallback to mock analysis if Gemini is not configured

            return getMockAnalysis(candidateName);
        }

        try {
            if (chatModel == null) {
                chatModel = GoogleAiGeminiChatModel.builder()
                        .apiKey(geminiApiKey)
                        .modelName(geminiModelName)
                        .build();
            }

            String prompt = buildAnalysisPrompt(jobDescription, candidateName, candidateSkills, 
                                              candidateExperience, candidateLocation, resumeContent);

            String aiResponse = chatModel.generate(prompt);

            return parseAiResponse(aiResponse, candidateName);

        } catch (Exception e) {
            // Fallback to mock on error

            return getMockAnalysis(candidateName);
        }
    }

    private String buildAnalysisPrompt(String jobDesc, String name, String skills, 
                                     int experience, String location, String resume) {
        return String.format("""
            Analyze this candidate for the job position. Provide a response in the following JSON format:
            {
                "matchScore": <number 0-100>,
                "recommendation": "<Highly Recommended|Recommended|Consider|Not Recommended>",
                "summary": "<brief summary of fit>",
                "matchingSkills": ["skill1", "skill2"],
                "strengths": ["strength1", "strength2"],
                "concerns": ["concern1", "concern2"]
            }

            Job Description: %s

            Candidate Profile:
            - Name: %s
            - Skills: %s
            - Experience: %d years
            - Location: %s
            - Resume: %s

            Provide an honest assessment based on how well the candidate's skills and experience match the job requirements.
            """, jobDesc, name, skills, experience, location, resume != null ? resume : "Not provided");
    }

    private AiDtos.CandidateAnalysisResult parseAiResponse(String aiResponse, String candidateName) {
        try {
            // Try to extract JSON from the response
            String json = extractJsonFromResponse(aiResponse);
            
            // Simple parsing - in a real app, use a proper JSON parser
            int matchScore = extractIntValue(json, "matchScore");
            String recommendation = extractStringValue(json, "recommendation");
            String summary = extractStringValue(json, "summary");
            List<String> matchingSkills = extractStringList(json, "matchingSkills");
            List<String> strengths = extractStringList(json, "strengths");
            List<String> concerns = extractStringList(json, "concerns");

            return AiDtos.CandidateAnalysisResult.builder()
                    .candidateName(candidateName)
                    .matchScore(matchScore)
                    .recommendation(recommendation)
                    .summary(summary)
                    .matchingSkills(matchingSkills)
                    .strengths(strengths)
                    .concerns(concerns)
                    .build();

        } catch (Exception e) {
            // Fallback to mock if parsing fails
            return getMockAnalysis(candidateName);
        }
    }

    private String extractJsonFromResponse(String response) {
        // Remove markdown code blocks if present
        response = response.replaceAll("```json\\n?", "").replaceAll("\\n?```", "").trim();
        // Find JSON object
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return response.substring(start, end + 1);
        }
        return response;
    }

    private int extractIntValue(String json, String key) {
        String pattern = "\"" + key + "\":\\s*(\\d+)";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return Integer.parseInt(m.group(1));
        }
        return 75; // default
    }

    private String extractStringValue(String json, String key) {
        String pattern = "\"" + key + "\":\\s*\"([^\"]*)\"";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return "Good fit"; // default
    }

    private List<String> extractStringList(String json, String key) {
        String pattern = "\"" + key + "\":\\s*\\[(.*?)\\]";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern, java.util.regex.Pattern.DOTALL);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            String listContent = m.group(1);
            return java.util.Arrays.stream(listContent.split(","))
                    .map(s -> s.replaceAll("\"", "").trim())
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
        return List.of("Java", "Spring Boot"); // default
    }

    private AiDtos.CandidateAnalysisResult getMockAnalysis(String candidateName) {
        return AiDtos.CandidateAnalysisResult.builder()
                .candidateName(candidateName)
                .matchScore(75)
                .recommendation("Recommended")
                .summary("Good candidate match with relevant experience")
                .matchingSkills(List.of("Java", "Spring Boot"))
                .strengths(List.of("Strong technical skills"))
                .concerns(List.of("Limited remote work experience"))
                .build();
    }
}
