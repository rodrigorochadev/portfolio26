import { PropsWithChildren } from "react";
import Header from "../navigation/header/Header";
import dynamic from "next/dynamic";
import { BACKGROUND_PROPS } from "../background/utils";

const Background = dynamic(() => import("../background/Background"));

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col justify-between">
      <Background {...BACKGROUND_PROPS} />
      <div>
        <Header />
        {children}
      </div>
      {/* <></> FOOTER */}
    </div>
  );
}
