import { PropsWithChildren } from "react";
import Header from "../navigation/header/Header";
import Footer from "../navigation/footer/Footer";
import dynamic from "next/dynamic";
import { BACKGROUND_PROPS } from "../../lib/constants/background";
import ProjectTransitionOverlay from "../projects/transition/ProjectTransitionOverlay";

const Background = dynamic(() => import("../background/Background"));

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col justify-between">
      <Background {...BACKGROUND_PROPS} />
      <div>
        <Header />
        {children}
      </div>
      <Footer />
      <ProjectTransitionOverlay />
    </div>
  );
}
