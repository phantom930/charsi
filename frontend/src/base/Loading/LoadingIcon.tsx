import styled from "@emotion/styled";

const Grid = styled.div`
  .lds-grid {
    display: inline-block;
    position: relative;
    width: 60px;
    height: 60px;
  }
  .lds-grid div {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: lds-grid 3s linear infinite;
  }
  .lds-grid div:nth-child(1) {
    top: 6px;
    left: 6px;
    animation-delay: 0s;
  }
  .lds-grid div:nth-child(2) {
    top: 6px;
    left: 24px;
    animation-delay: -0.4s;
  }
  .lds-grid div:nth-child(3) {
    top: 6px;
    left: 42px;
    animation-delay: -0.8s;
  }
  .lds-grid div:nth-child(4) {
    top: 24px;
    left: 6px;
    animation-delay: -0.4s;
  }
  .lds-grid div:nth-child(5) {
    top: 24px;
    left: 24px;
    animation-delay: -0.8s;
  }
  .lds-grid div:nth-child(6) {
    top: 24px;
    left: 42px;
    animation-delay: -1.2s;
  }
  .lds-grid div:nth-child(7) {
    top: 42px;
    left: 6px;
    animation-delay: -0.8s;
  }
  .lds-grid div:nth-child(8) {
    top: 42px;
    left: 24px;
    animation-delay: -1.2s;
  }
  .lds-grid div:nth-child(9) {
    top: 42px;
    left: 42px;
    animation-delay: -1.6s;
  }
  @keyframes lds-grid {
    0%,
    100% {
      background: "#42a5f5";
      transform: scale(0.25);
    }
    50% {
      background: "#42a5f5";
      transform: scale(1);
    }
  }
`;

export const LoadingIcon = () => {
  return (
    <Grid>
      <div className="lds-grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Grid>
  );
};

export default LoadingIcon;
