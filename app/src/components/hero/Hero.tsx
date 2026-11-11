import HeroTextAnimation from "../misc/heroTextAnimation/HeroTextAnimation";

export default function Hero() {
  return (
    <div className="container h-[calc(100dvh-28px)] w-full flex flex-col justify-end md:flex-row md:items-end md:justify-between pb-3 gap-2">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <HeroTextAnimation />
        </div>
      </div>
    </div>
  );
}
