import styled from "@emotion/styled";

export const LoadingText = styled.p<{ text?: string }>`
  text-align: center;
  ::before {
    content: "${(props) => (props.text ? props.text : "Loading...")}";
  }

  animation: blink 2s infinite;
  @keyframes blink {
    0% {
      color: inherit;
    }
    50% {
      color: transparent;
    }
    100% {
      color: inherit;
    }
  }
`;
