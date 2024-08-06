
// Unit tests for: updateProject
import { updateProject } from '../projectController.step3';
import { Request, Response } from 'express';
import { ProjectService } from '../../services/projectService';

class MockDatabase {
    public exec = jest.fn();
    public prepare = jest.fn().mockReturnValue({
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn(),
    });
}

class MockProjectService extends ProjectService {
    constructor() {
        const mockDb = new MockDatabase();
        super(mockDb as any);
    }

    public getProjectById = jest.fn().mockResolvedValue({ id: '1', name: 'Test Project' });
    public updateProject = jest.fn().mockResolvedValue({ id: '1', name: 'Updated Project' });
}

describe('updateProject() updateProject method', () => {
    let mockProjectService: MockProjectService;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        mockProjectService = new MockProjectService();
        req = {
            params: { id: '1' },
            body: { name: 'Updated Project' }
        } as any;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;
    });

    describe('Happy Path', () => {
        it('should update the project successfully and return a success response', async () => {
            const updateHandler = updateProject(mockProjectService);
            await updateHandler(req, res);
            expect(mockProjectService.updateProject).toHaveBeenCalledWith('1', { name: 'Updated Project', description: undefined, dueDate: undefined });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Updated Project' });
        });

        it('should find the project by ID before updating', async () => {
            const updateHandler = updateProject(mockProjectService);
            await updateHandler(req, res);
            expect(mockProjectService.getProjectById).toHaveBeenCalledWith('1');
        });
    });

    describe('Edge Cases', () => {
        it('should return a 404 if the project is not found', async () => {
            mockProjectService.getProjectById.mockResolvedValueOnce(null);
            const updateHandler = updateProject(mockProjectService);
            await updateHandler(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
        });

        it('should handle validation errors gracefully', async () => {
            req.body = {}; // Invalid body
            const updateHandler = updateProject(mockProjectService);
            await updateHandler(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid project data' });
        });

        it('should handle service errors gracefully', async () => {
            mockProjectService.updateProject.mockRejectedValueOnce(new Error('Service error'));
            const updateHandler = updateProject(mockProjectService);
            await updateHandler(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});
// End of unit tests for: updateProject
