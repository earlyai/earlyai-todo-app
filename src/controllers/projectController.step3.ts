import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

export const getProjectById = (projectService: ProjectService) => (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const project = projectService.getProjectById(id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProject = (projectService: ProjectService) => async (req: any, res: any): Promise<void> => {
  try {
      const { id } = req.params;
      const { name, description, dueDate } = req.body;
      
      if (!name) {
        res.status(400).json({ error: 'Invalid project data' });
        return;
      }

      const project = await projectService.getProjectById(id);
      if (!project) {
          res.status(404).json({ error: 'Project not found' });
          return;
      }

      const updatedProject = await projectService.updateProject(id, { name, description, dueDate: dueDate ? new Date(dueDate) : undefined });
      res.status(200).json(updatedProject);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};

