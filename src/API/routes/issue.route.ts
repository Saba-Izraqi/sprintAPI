import { container } from 'tsyringe';
import { BaseRoute } from './base.route';
import { IssueController } from '../controllers/issue.controller';
import { authenticate } from '../middlewares/auth.middleware';

export class IssueRoutes extends BaseRoute {
  public path = '/issues';

  protected initRoutes(): void {
    const controller = container.resolve(IssueController);    // POST /issues
    this.router.post(
      '/', 
      authenticate,
      (req, res, next) => controller.createIssue(req, res, next)
    );    // GET /issues
    this.router.get(
      '/',
      authenticate,
      (req, res, next) => controller.getAllIssues(req, res, next)
    );

    // GET /issues/board/:boardProjectId/key/:key
    this.router.get(
      '/board/:boardProjectId/key/:key',
      (req, res, next) => controller.getIssueByKeyAndBoard(req, res, next)
    );

    // GET /issues/board/:boardProjectId
    this.router.get(
      '/board/:boardProjectId',
      (req, res, next) => controller.getIssuesByBoard(req, res, next)
    );

    // GET /issues/epic/:epicId
    this.router.get(
      '/epic/:epicId',
      (req, res, next) => controller.getIssuesByEpic(req, res, next)
    );

    // GET /issues/sprint/:sprintId
    this.router.get(
      '/sprint/:sprintId',
      (req, res, next) => controller.getIssuesBySprint(req, res, next)
    );

    // GET /issues/assignee/:userId
    this.router.get(
      '/assignee/:userId',
      (req, res, next) => controller.getIssuesByAssignee(req, res, next)
    );
    
    // GET /issues/:id
    this.router.get(
      '/:id',
      (req, res, next) => controller.getIssueById(req, res, next)
    );

    // PUT /issues/:id
    this.router.put(
      '/:id',
      (req, res, next) => controller.updateIssue(req, res, next)
    );

    // DELETE /issues/:id
    this.router.delete(
      '/:id',
      (req, res, next) => controller.deleteIssue(req, res, next)
    );
  }
}
