export default function CommingSoon() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-red-600" />
      </span>
      <p className="text-xs font-bold uppercase">Comming Soon</p>
    </div>
  );
}
