import React from "react";

const CloseModalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M6 6L19 19" stroke="#EE8686" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 6L6 19" stroke="#EE8686" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default CloseModalIcon;
