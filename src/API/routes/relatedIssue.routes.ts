import { authenticate } from "../middlewares/auth.middleware";
import { RelatedIssueController } from "../controllers/relatedIssue.controller";
import { container } from "tsyringe";
import { BaseRoute } from "./base.route";

export class RelatedIssueRoutes extends BaseRoute {
  public path = "/related-issues";

  protected initRoutes(): void {
    const controller = container.resolve(RelatedIssueController);

    this.router.post("/", authenticate, controller.create);

    this.router.get("/:id", authenticate, controller.getById);

    this.router.get(
      "/issue/:issueId",
      authenticate,
      controller.getAllByIssueId
    );

    this.router.patch("/:id", authenticate, controller.update);

    this.router.delete("/:id", authenticate, controller.deleteById);

    // Assuming a route might exist for deleting by the two issue IDs involved
    // If not, this can be removed or adjusted based on actual needs.
    // For example: DELETE /related-issues/by-issue-ids/:issueId/:relatedIssueId
    // This specific route was not explicitly in the previous file, but controller.deleteByIssueIds exists.
    // Adding a potential route for it, adjust path as necessary.
    this.router.delete(
      "/by-issue-ids/:issueId/:relatedIssueId",
      authenticate,
      controller.deleteByIssueIds
    );
  }
}
