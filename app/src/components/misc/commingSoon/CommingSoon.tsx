"use client";

import InfoSvg from "@/app/src/icons/warning/Info";
import { Drawer } from "vaul";

export default function CommingSoon() {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger className="bg-white px-2 py-px rounded-2xl cursor-pointer flex items-center gap-2 text-black relative text-hover hover:bg-accent hover:text-black!">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600/50 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red-600" />
        </span>
        <p className="text-xs font-bold uppercase">Comming Soon</p>
        <InfoSvg />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="right-2 bottom-2 fixed z-10 outline-none w-77.5 flex"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="bg-white w-full rounded-xl px-4 py-4">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-bold mb-2 text-black text-lg">
                Comming soon
              </Drawer.Title>
              <Drawer.Description className="text-black/80 mb-2">
                This website is under construction.
              </Drawer.Description>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
