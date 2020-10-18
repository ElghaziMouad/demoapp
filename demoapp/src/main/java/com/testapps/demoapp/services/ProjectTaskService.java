package com.testapps.demoapp.services;

import com.testapps.demoapp.domain.Backlog;
import com.testapps.demoapp.domain.Project;
import com.testapps.demoapp.domain.ProjectTask;
import com.testapps.demoapp.exceptions.ProjectNotFoundException;
import com.testapps.demoapp.repositories.BacklogRepository;
import com.testapps.demoapp.repositories.ProjectRepository;
import com.testapps.demoapp.repositories.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectTaskService {

    @Autowired
    private BacklogRepository backlogRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public ProjectTask addProjectTask(String projectIdentifier, ProjectTask projectTask) {

        //Exception Handling ProjectNotFound
        try {
            // PTs to be added to a specific project, project not null => BL exists
            Backlog backlog = backlogRepository.findByProjectIdentifier(projectIdentifier);
            // set the backlog to PT
            projectTask.setBacklog(backlog);
            // project sequence to be like this: ID01-1
            Integer BacklogSequence = backlog.getPTSequence();
            // update the BL Sequence
            BacklogSequence++;
            backlog.setPTSequence(BacklogSequence);
            // Add sequence to project task
            projectTask.setProjectSequence(projectIdentifier+"-"+BacklogSequence);
            projectTask.setProjectIdentifier(projectIdentifier);
            // initial priority when priority null
            if(projectTask.getPriority() == null){
                projectTask.setPriority(3);
            }
            // initial status when status null
            if(projectTask.getStatus() == "" || projectTask.getStatus() == null){
                projectTask.setStatus("TO_DO");
            }

            return projectTaskRepository.save(projectTask);
        }catch(Exception e) {
            throw new ProjectNotFoundException("Project not found");
        }



    }

    public Iterable<ProjectTask> findBacklogById(String id) {

        Project project = projectRepository.findByProjectIdentifier(id);

        if(project == null) {
            throw new ProjectNotFoundException("Project with ID: '"+id+"' does not exist");
        }

        return projectTaskRepository.findByProjectIdentifierOrderByPriority(id);
    }

    public ProjectTask findByProjectSequence(String backlog_id, String pt_id){
        // make sure we are searching on the right backlog
        Backlog backlog = backlogRepository.findByProjectIdentifier(backlog_id);
        if(backlog == null){
            throw new ProjectNotFoundException("Project with ID: '"+backlog_id+"' does not exist");
        }
        // make sure the our task exist
        ProjectTask projectTask = projectTaskRepository.findByProjectSequence(pt_id);
        if(projectTask == null){
            throw new ProjectNotFoundException("Project Task: '"+pt_id+"' not found");
        }

        if(!projectTask.getProjectIdentifier().equals(backlog_id)){
            throw new ProjectNotFoundException("Project Task '"+pt_id+"' does not exist in project '"+backlog_id+"'");
        };

        return projectTask;
    }

    public ProjectTask updateByProjectSequence(ProjectTask updatedTask, String bachlog_id, String pt_id){
        ProjectTask projectTask = findByProjectSequence(bachlog_id,pt_id);

        projectTask = updatedTask;

        return projectTaskRepository.save(projectTask);
    }

    public void deletePTByProjectSequence(String backlog_id, String pt_id){
        ProjectTask projectTask = findByProjectSequence(backlog_id, pt_id);
        projectTaskRepository.delete(projectTask);
    }
}
