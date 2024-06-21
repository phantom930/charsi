import { createGlobalStyle, css } from "styled-components";
import fontSizes from "./fontSizes";
import muiComponentStyles from "./muiComponentStyles";

const globalStyle = css`
  * {
    font-family: Aeonik !important;
  }
  body {
    margin: 0;
    font-weight: 500;
    font-family: ${({ theme }) => theme.font.fontFamily1}; /**In Use */
    letter-spacing: 0.2px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: overlay;
    background-color: ${(props) => props.theme.colors.background} !important;
    color: ${(props) => props.theme.colors.font};
    line-height: 1;
  }

  svg,
  img {
    max-width: 100%;
  }

  /**Navbar component */
  header {
    background: ${({ theme }) => theme.colors.primaryAccent1};
    background: ${({ theme }) => theme.colors.gradient1} !important;
  }

  input,
  textarea,
  form,
  nav,
  div,
  p,
  a,
  span {
    box-sizing: border-box;
  }

  hr {
    border: none;
    border-top: ${(props) => props.theme.border};
  }

  fieldset {
    padding: 0;
    border: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const scrollbarProperties = css`
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: 0px solid transparent;
    border-radius: 10px;
    filter: none;
    transition: background-color 0.25s, filter 0.25s;
  }

  .hide-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: #5a5a60;
    transition: background-color 0.25s, filter 0.25s;
  }

  body::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  body::-webkit-scrollbar-button {
    width: 7px;
    height: 0px;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-button {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #5a5a60;
    border: 0px solid transparent;
    border-radius: 10px;
    filter: none;
    transition: background-color 0.25s, filter 0.25s;
  }

  ::-webkit-scrollbar-thumb:active {
    filter: brightness(100%);
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border: 0px none transparent;
    border-radius: 10px;
  }

  ::-webkit-scrollbar:hover {
    background: transparent;
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-track:active {
    background: transparent;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const fontProperties = css`
  @font-face {
    font-family: Aeonik;
    src: url("/styles/fonts/AEONIK/AEONIK-REGULAR.woff") format("woff");
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: Aeonik;
    src: url("/styles/fonts/AEONIK/AEONIK-MEDIUM.woff") format("woff");
    font-weight: 500;
  }
  @font-face {
    font-family: Aeonik;
    src: url("/styles/fonts/AEONIK/AEONIK-BOLD.woff") format("woff");
    font-weight: 600;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    margin: 0;
  }

  a,
  option,
  select {
    text-decoration: none;
    color: inherit;
  }

  h1 {
    ${fontSizes.h1}
  }

  h2 {
    ${fontSizes.h2}
  }
  h3 {
    ${fontSizes.h3}
  }
  h4 {
    ${fontSizes.h4}
  }
  h5 {
    ${fontSizes.h5}
  }

  select,
  button,
  input,
  textarea {
    font-family: Aeonik !important;
  }

  input,
  select,
  option,
  textarea,
  li,
  a,
  p,
  b,
  i,
  label {
    ${fontSizes.medium}
  }

  button {
    ${fontSizes.button}
    > p,
    > span {
      ${fontSizes.button}
    }
  }

  [contenteditable] {
    :focus {
      color: ${({ theme }) => theme.colors.font2};
    }
    outline: 0px solid transparent;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
  ${fontProperties}
  ${scrollbarProperties}
  ${muiComponentStyles}
  
`;
export default GlobalStyle;
