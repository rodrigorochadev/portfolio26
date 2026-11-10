import type { Project, ProjectBlock } from "@/app/src/lib/projects";
import CodeBlock from "./CodeBlock";
import GalleryBlock from "./GalleryBlock";
import ImageBlock from "./ImageBlock";
import ListBlock from "./ListBlock";
import OverviewBlock from "./OverviewBlock";
import PaletteBlock from "./PaletteBlock";
import QuoteBlock from "./QuoteBlock";
import StatsBlock from "./StatsBlock";
import TextBlock from "./TextBlock";

function renderBlock(block: ProjectBlock, project: Project) {
  switch (block.type) {
    case "overview":
      // Year, role and stack come from the project itself; the block adds project-specific facts.
      return (
        <OverviewBlock
          lead={block.lead}
          facts={[
            { label: "Year", value: String(project.year) },
            { label: "Role", value: project.role },
            { label: "Stack", value: project.tags.join(" / ") },
            ...block.facts,
          ]}
        />
      );
    case "text":
      return <TextBlock {...block} />;
    case "image":
      return <ImageBlock {...block} />;
    case "gallery":
      return <GalleryBlock {...block} />;
    case "stats":
      return <StatsBlock {...block} />;
    case "list":
      return <ListBlock {...block} />;
    case "code":
      return <CodeBlock {...block} />;
    case "palette":
      return <PaletteBlock {...block} />;
    case "quote":
      return <QuoteBlock {...block} />;
  }
}

/** Renders a project's page from its block sequence in projects.json. */
export default function ProjectBlocks({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {project.blocks.map((block, index) => (
        <div key={`${block.type}-${index}`}>{renderBlock(block, project)}</div>
      ))}
    </div>
  );
}
