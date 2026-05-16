import { PropsWithChildren } from "react";
import Header from "../navigation/header/Header";
import dynamic from "next/dynamic";
import { BACKGROUND_PROPS } from "../background/utils";

const Background = dynamic(() => import("../background/Background"));

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <Background {...BACKGROUND_PROPS} />
        {children}
      </div>
      {/* <></> FOOTER */}
    </div>
  );
}
