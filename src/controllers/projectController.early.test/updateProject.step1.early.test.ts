
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
});
// End of unit tests for: updateProject
