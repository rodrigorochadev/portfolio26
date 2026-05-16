import { SVGProps } from "react";

export default function LinkedInSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={34}
      height={34}
      fill="none"
      aria-label="LinkedIn"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20.8 17.8v2.8h-1.6V18c0-.6-.2-1.1-.8-1.1s-.7.3-.8.6v3.1H16v-4.8h1.6v.7c.2-.3.6-.8 1.4-.8s1.9.7 1.9 2.2zm-6.6-4.3c-.5 0-.9.4-.9.8s.3.8.9.8c.6 0 .9-.4.9-.8 0-.5-.3-.8-.9-.8zm-.9 7.1h1.6v-4.8h-1.6v4.8z"
      />
      <path
        fill="currentColor"
        d="M12.5 11c-.4 0-.8.2-1.1.4-.3.3-.4.7-.4 1.1v9c0 .4.2.8.4 1.1.3.3.7.4 1.1.4h9c.4 0 .8-.2 1.1-.4s.4-.7.4-1.1v-9c0-.4-.2-.8-.4-1.1-.3-.3-.7-.4-1.1-.4h-9zm0-1.5h9c.8 0 1.6.3 2.1.9.6.6.9 1.3.9 2.1v9c0 .8-.3 1.6-.9 2.1-.6.6-1.3.9-2.1.9h-9c-.8 0-1.6-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1v-9c0-.8.3-1.6.9-2.1.6-.6 1.3-.9 2.1-.9z"
      />
    </svg>
  );
}
