const CharsiLoader = () => {
  return (
    <svg
      className="charsi-loading"
      xmlns="http://www.w3.org/2000/svg"
      width="266"
      height="266"
      viewBox="0 0 266 266"
      fill="none"
    >
      <circle
        cx="132.974"
        cy="132.974"
        r="54.5"
        transform="rotate(39.2634 132.974 132.974)"
        stroke="url(#animatedGradient)"
        strokeWidth="2"
      />
      <circle
        cx="132.974"
        cy="132.974"
        r="63.5"
        transform="rotate(39.2634 132.974 132.974)"
        stroke="url(#animatedGradient)"
        strokeWidth="6"
      />
      <path
        className="charsi-loading-triangle"
        d="M146.415 50.5627L197.623 185.82L54.8831 162.539L146.415 50.5627Z"
        stroke="url(#animatedGradient)"
        strokeWidth="11"
      />
      <defs>
        <linearGradient
          id="animatedGradient"
          x1="206.14"
          y1="192.782"
          x2="248.984"
          y2="84.43"
          gradientUnits="userSpaceOnUse"
        >
          <animateTransform
            attributeName="gradientTransform"
            attributeType="XML"
            type="rotate"
            from="0"
            to="360"
            begin="0s"
            dur="2s"
            repeatCount="indefinite"
          />
          <stop stopColor="#7C4DFF" />
          <stop offset="0.0001" stopColor="#7C4DFF" />
          <stop offset="1" stopColor="#FB4DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CharsiLoader;
