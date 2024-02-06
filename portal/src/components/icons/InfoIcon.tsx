// In /components/icons/MyIcon.tsx
import React from "react";

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="15"
    viewBox="0 0 14 15"
    fill="none"
    {...props}
  >
    <path
      d="M6.9974 13.3332C10.2191 13.3332 12.8307 10.7215 12.8307 7.49984C12.8307 4.27818 10.2191 1.6665 6.9974 1.6665C3.77573 1.6665 1.16406 4.27818 1.16406 7.49984C1.16406 10.7215 3.77573 13.3332 6.9974 13.3332Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 9.83333V7.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 5.1665H7.00583" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default InfoIcon;
