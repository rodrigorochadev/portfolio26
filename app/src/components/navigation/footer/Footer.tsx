import { site } from "@/app/src/lib/seo/site";
import SocialList from "../../misc/social/SocialList";

export default function Footer() {
  return (
    <footer className="container w-full pb-3 flex items-center justify-between gap-2">
      <p className="flex items-center gap-2 text-xs font-light text-text-light">
        <span className="font-bold uppercase">{site.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </p>
      <SocialList />
    </footer>
  );
}
