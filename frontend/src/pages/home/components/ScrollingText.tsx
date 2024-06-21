// import styled, { keyframes, css } from "styled-components";
import styled from "styled-components";
import { useRef, useEffect } from "react";

interface ScrollingTextProps {
  text: string;
}

// const scrollAnimation = keyframes`
//   0% {
//     transform: translateX(0);
//   }
//   100% {
//     transform: translateX(-50%);
//   }
// `;

const ScrollingTextWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
`;

// const ScrollingTextInner = styled.div`
//   display: inline-block;
//   white-space: nowrap;
//   ${({ speed: _speed }) => css`
//     animation: ${scrollAnimation} 5s linear infinite;
//   `}
// `;

const ScrollingTextInner = styled.div`
  display: inline-block;
  white-space: nowrap;
`;

const ScrollingText = ({ text }: ScrollingTextProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const contentWidth = content.offsetWidth;
      let counter = 0;

      while (contentWidth < window.innerWidth && counter < 100) {
        content.innerHTML += text;
        counter += 1;
      }
    }
  }, [text]);

  return (
    <ScrollingTextWrapper>
      <ScrollingTextInner ref={contentRef}>{text}</ScrollingTextInner>
      <ScrollingTextInner ref={contentRef}>{text}</ScrollingTextInner>
      <ScrollingTextInner ref={contentRef}>{text}</ScrollingTextInner>
    </ScrollingTextWrapper>
  );
};

export default ScrollingText;
