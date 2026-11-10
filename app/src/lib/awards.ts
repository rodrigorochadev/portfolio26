import data from "@/app/data/awards.json";
import { getProjectBySlug, Project } from "./projects";

export type Award = Omit<(typeof data.awards)[number], "project"> & {
  /** The awarded project, when it has a case study. */
  project?: Project;
};

export function getAwards(): Award[] {
  return data.awards.map(({ project, ...award }) => ({ ...award, project: getProjectBySlug(project) }));
}
