import socials from "@/app/data/socials.json";
import Link from "next/link";
import SocialRenderer, { Social } from "./SocialRenderer";

export default function SocialList() {
  return (
    <div className="flex items-center gap-2">
      {socials.map((social) => {
        return (
          <Link
            key={`social-btn-${social.social}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-hover rounded-full p-1"
            href={social.href}
            aria-label={`Link to ${social.label}`}
          >
            <SocialRenderer social={social.social as Social} />
          </Link>
        );
      })}
    </div>
  );
}
