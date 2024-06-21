import { mq } from "@helpers/breakpoints";
import { css } from "styled-components";

const fontSizes = {
  h1: css`
    ${mq["xxs"]} {
      font-size: 30px;
    }
    ${mq["xs"]} {
      font-size: 32px;
    }
    ${mq["md"]} {
      font-size: 36px;
    }
  `,
  h2: css`
    ${mq["xxs"]} {
      font-size: 25px;
    }
    ${mq["xs"]} {
      font-size: 27px;
    }
    ${mq["md"]} {
      font-size: 31px;
    }
  `,
  h3: css`
    ${mq["xxs"]} {
      font-size: 20px;
    }
    ${mq["xs"]} {
      font-size: 22px;
    }
    ${mq["md"]} {
      font-size: 26px;
    }
  `,
  h4: css`
    ${mq["xxs"]} {
      font-size: 15px;
    }
    ${mq["xs"]} {
      font-size: 17px;
    }
    ${mq["md"]} {
      font-size: 21px;
    }
  `,
  h5: css`
    ${mq["xxs"]} {
      font-size: 14px;
    }
    ${mq["xs"]} {
      font-size: 15px;
    }
    ${mq["md"]} {
      font-size: 17px;
    }
  `,
  medium: css`
    ${mq["xxs"]} {
      font-size: 13px;
    }
    ${mq["sm"]} {
      font-size: 15px;
    }
  `,

  button: css`
    ${mq["xxs"]} {
      font-size: 12px;
    }
    ${mq["sm"]} {
      font-size: 13px;
    }
  `,

  small: css`
    ${mq["xxs"]} {
      font-size: 11px;
      line-height: 1.5;
    }
    ${mq["sm"]} {
      font-size: 12px;
    }
  `,

  inputLabel: css`
    font-size: 11px;
  `,
};

export default fontSizes;
export type FontSizesKey = keyof typeof fontSizes;
export const fontSizesSimple: Record<FontSizesKey, number> = {
  button: 13,
  small: 12,
  medium: 15,
  inputLabel: 11,
  h5: 17,
  h4: 21,
  h3: 26,
  h2: 31,
  h1: 36,
};
