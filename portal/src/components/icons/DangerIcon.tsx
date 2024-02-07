import React from "react";

const DangerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    {...props}
  >
    <path
      d="M14.4856 12.5L9.15231 3.16665C9.03602 2.96146 8.86738 2.79078 8.66359 2.67203C8.45981 2.55329 8.22817 2.49072 7.99231 2.49072C7.75645 2.49072 7.52481 2.55329 7.32103 2.67203C7.11724 2.79078 6.9486 2.96146 6.83231 3.16665L1.49898 12.5C1.38143 12.7036 1.3198 12.9346 1.32032 13.1697C1.32084 13.4047 1.3835 13.6355 1.50194 13.8385C1.62039 14.0416 1.79041 14.2097 1.99477 14.3259C2.19914 14.442 2.43058 14.5021 2.66564 14.5H13.3323C13.5662 14.4997 13.796 14.438 13.9985 14.3208C14.201 14.2037 14.3691 14.0354 14.486 13.8327C14.6028 13.6301 14.6643 13.4002 14.6643 13.1663C14.6642 12.9324 14.6026 12.7026 14.4856 12.5Z"
      stroke="#F5C841"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 6.5V9.16667" stroke="#F5C841" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11.8335H8.00762" stroke="#F5C841" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default DangerIcon;
