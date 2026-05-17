import data from "@/app/data/hero.json";
import { cn } from "../../utils";
import CommingSoon from "../misc/commingSoon/CommingSoon";
import SocialList from "../misc/social/SocialList";

export default function Hero() {
  return (
    <div className="container h-[calc(100dvh-28px)] w-full flex flex-col justify-end md:flex-row md:items-end md:justify-between pb-3 gap-2">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <CommingSoon />
          <div>
            <p
              className={cn(
                "hero-title font-bold font-heading max-w-xl",
                data.title?.settings.uppercase ? "uppercase" : null,
              )}
            >
              {data.title?.label}
            </p>
            <p className="text-text-light max-w-lg">
              <span>{data.subtitle}</span>
            </p>
          </div>
        </div>
      </div>
      <SocialList />
    </div>
  );
}
