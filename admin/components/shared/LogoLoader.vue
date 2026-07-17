<template>
  <svg
    viewBox="0 0 28 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="transition-transform duration-300"
  >
    <path
      class="svg-spinner"
      pathLength="100"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.149477 0.748813C0 1.04218 0 1.42621 0 2.19429L3.94515e-05 30.7119C4.12115e-05 31.8927 0.911681 32.4614 2.74155 31.5483C4.57143 30.6353 12.6857 26.7146 13.0286 26.5529C13.3714 26.3912 13.4857 26.3723 13.7143 26.3723C13.9429 26.3723 14.0571 26.3912 14.4 26.5529C14.7429 26.7146 22.8571 30.6353 24.687 31.5483C26.5169 32.4614 27.4285 31.8927 27.4285 30.7119L27.4286 2.19429C27.4286 1.42621 27.4286 1.04218 27.2791 0.748813C27.1476 0.490762 26.9378 0.28096 26.6798 0.149477C26.3864 0 26.0024 0 25.2343 0H13.7143H2.19429C1.42621 0 1.04218 0 0.748813 0.149477C0.490762 0.28096 0.28096 0.490762 0.149477 0.748813ZM21.193 10.8571C17.2522 14.6628 10.1889 14.6628 6.24809 10.8571L4.20572 12.9721C9.28588 17.8779 18.1553 17.8779 23.2354 12.9721L21.193 10.8571Z"
    />
  </svg>
</template>

<style scoped>
.svg-spinner {
  /* Inherit the text color of the button (white) */
  stroke: currentColor;
  fill: currentColor;
  stroke-width: 1.5px;

  /* Make the base shape dimly visible */
  fill-opacity: 0.2;

  /* Creates a line that is 40 units long, followed by a 60 unit gap */
  stroke-dasharray: 40 60;
  stroke-dashoffset: 0;

  /* Fast, linear loop for a constant spinning effect */
  animation: logo-spin 1s linear infinite;
  transform: translateZ(0);
}

@keyframes logo-spin {
  to {
    /* Pushing it by exactly 100 makes it loop seamlessly over the pathLength */
    stroke-dashoffset: -100;
  }
}
</style>
