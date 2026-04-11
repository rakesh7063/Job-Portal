package com.jobportal.service;

import com.jobportal.api.dto.JobDtos;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobService {
    public List<JobDtos.JobResponse> listAll();
    public Page<JobDtos.JobResponse> listAllPaged(int page, int size);
    public JobDtos.JobResponse getById(Long id);
    public List<JobDtos.JobResponse> search(String skill, String location);
    public Page<JobDtos.JobResponse> searchPaged(String skillsCsv, String location, int page, int size);
    public JobDtos.JobResponse createJob(Long recruiterId, JobDtos.CreateJobRequest req);
    public List<JobDtos.JobResponse> jobsByRecruiter(Long recruiterId);
    public void applyToJob(Long jobId, Long candidateId);
    public JobDtos.ApplicationsResponse applicantsForJob(Long jobId, Long recruiterId);

}
