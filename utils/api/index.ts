import { projectRoutes } from "./project";
import { issuesRoutes } from "./issues";
import { sprintsRoutes } from "./sprints";

export const api = {
  project: projectRoutes,
  issues: issuesRoutes,
  sprints: sprintsRoutes,
};
