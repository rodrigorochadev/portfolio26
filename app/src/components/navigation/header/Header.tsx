import Link from "next/link";
import data from "@/app/data/header.json";
import socials from "@/app/data/socials.json";
import SocialRenderer, { Social } from "../../misc/social/SocialRenderer";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 container w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full py-2 md:py-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs">
            <span className="font-bold uppercase">{data.header?.title}</span>
            <span className="font-light text-text-light lowercase">
              <span>{data.header?.subtitle}</span>
              <span> @ </span>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:text-[#2a4cf9]"
                href={data.header?.workAt?.href}
              >
                {data.header?.workAt?.label}
              </Link>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map((social) => {
            return (
              <Link
                key={`social-btn-${social.social}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:text-accent"
                href={social.href}
                aria-label={`Link to ${social.label}`}
              >
                <SocialRenderer social={social.social as Social} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
