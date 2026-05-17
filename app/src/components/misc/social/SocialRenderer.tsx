import React from "react";

import dynamic from "next/dynamic";
import GithubSvg from "@/app/src/icons/social/Github";

const InstagramSvg = dynamic(() => import("../../../icons/social/Instagram"));
const LinkedInSvg = dynamic(() => import("../../../icons/social/LinkedIn"));
const XSvg = dynamic(() => import("../../../icons/social/X"));

export enum Social {
  X = "x",
  INSTAGRAM = "instagram",
  LINKEDIN = "linkedin",
  GITHUB = "github",
}

interface SocialRendererProps {
  social: Social;
}

export default function SocialRenderer(props: SocialRendererProps) {
  const { social } = props;

  switch (social) {
    case Social.X:
      return <XSvg />;
    case Social.INSTAGRAM:
      return <InstagramSvg />;
    case Social.LINKEDIN:
      return <LinkedInSvg />;
    case Social.GITHUB:
      return <GithubSvg />;
    default:
      return null;
  }
}
