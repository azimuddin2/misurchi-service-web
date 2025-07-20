interface ICheckRoundedIconProps {
  className?: string;
}

export const CheckRoundedIcon = ({ className }: ICheckRoundedIconProps) => {
  return (
    <svg
      width="36"
      height="32"
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.0394 31.7702C21.5386 31.7702 27.6179 25.6909 27.6179 18.1917C27.6179 10.6926 21.5386 4.61328 14.0394 4.61328C6.54022 4.61328 0.460938 10.6926 0.460938 18.1917C0.460938 25.6909 6.54022 31.7702 14.0394 31.7702Z"
        fill="url(#paint0_linear_22083_2643)"
        fillOpacity="0.24"
      />
      <path
        d="M14.1919 28.6867L14.0197 28.3932C11.3889 23.9109 4.39802 14.3987 4.32741 14.3032L4.22656 14.1662L6.60833 11.8124L14.1477 17.0769C18.8947 10.917 23.3233 6.68605 26.2121 4.21536C29.3722 1.51267 31.4292 0.268439 31.4499 0.256516L31.4967 0.228516H35.5369L35.1509 0.572208C25.2256 9.41267 14.4676 28.2022 14.3605 28.391L14.1919 28.6867Z"
        fill="url(#paint1_linear_22083_2643)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_22083_2643"
          x1="14.0394"
          y1="4.61328"
          x2="14.0394"
          y2="27.718"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4DA8DA" />
          <stop offset="1" stopColor="#78C0A8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_22083_2643"
          x1="21.0588"
          y1="28.6867"
          x2="21.0588"
          y2="0.228516"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" />
          <stop offset="0.9999" stopColor="#1B6D4F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
