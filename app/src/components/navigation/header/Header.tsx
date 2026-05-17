import Link from "next/link";
import data from "@/app/data/header.json";

export default function Header() {
  return (
    <div className="sticky top-0 left-0 container w-full z-60 pt-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs">
            <Link href="/" className="font-bold uppercase text-hover">
              {data.header?.title}
            </Link>
            <span className="font-light text-text-light lowercase">
              <span>{data.header?.subtitle}</span>
              <span> @ </span>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-hover hover:text-[#2a4cf9]!"
                href={data.header?.workAt?.href}
              >
                {data.header?.workAt?.label}
              </Link>
            </span>
          </p>
        </div>
        {/* <CommingSoon /> */}
      </div>
    </div>
  );
}
