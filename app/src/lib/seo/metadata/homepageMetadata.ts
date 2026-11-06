import { site } from "../site";
import { createPageMetadata } from "./createPageMetadata";

export const homeMetadata = createPageMetadata({
  title: site.title,
  path: "/",
  absoluteTitle: true,
});
