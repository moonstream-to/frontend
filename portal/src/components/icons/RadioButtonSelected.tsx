import React from "react";

const RadioButtonSelected: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    {...props}
  >
    <circle cx="8" cy="8.5" r="5.5" stroke="white" />
    <circle cx="8" cy="8.5" r="3.5" fill="#F56646" />
  </svg>
);

export default RadioButtonSelected;
