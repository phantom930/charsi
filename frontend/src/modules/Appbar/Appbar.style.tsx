import TextField from "@mui/material/TextField";
import { mq } from "@helpers/breakpoints";
import styled from "@emotion/styled";

export const Container = styled.div`
  z-index: 300;
  background: #000000de;
`;

export const UserMenuContainer = styled.div`
  ${mq["xxs"]} {
    padding-right: 10px;
  }

  ${mq["sm"]} {
    padding-right: 0px;
  }
`;

export const IconButtonsContainer = styled.div`
  display: flex;
  ${mq["xxs"]} {
    display: none;
  }

  ${mq["sm"]} {
    display: flex;
  }
`;

export const SearchField = styled(TextField)`
  height: 40px;
  width: 100%;
  border-radius: 50px;
  background: #d9d9d940;
  padding: 8px;
`;

export const SearchInput = styled.input`
  height: 40px;
  width: 100%;
  max-width: 800px;
  border-radius: 50px;
  background-color: #d9d9d940;
  outline: none;
  border: 1px solid #ffffff33;
  color: white;

  background-image: url("/icons/search.png");
  background-position: 10px 10px;
  background-repeat: no-repeat;
  padding: 12px 20px 12px 40px;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
  transition: border-color 0.4s;
  transition: box-shadow 0.2s;
  :focus {
    border: 1px solid #fff;
    box-shadow: 0px 0px 5px #ffffff99;
    border-color: #fff;
  }
`;

export const ReversedSearchInput = styled(SearchInput)`
  height: 40px;
  width: 100%;
  max-width: 800px;
  border-radius: 50px;
  background-color: #e0e0e0;
  outline: none;
  border: 1px solid #ffffff33;
  color: #524f4f;

  background-image: url("/icons/search_grey.svg");
  background-position: 10px 10px;
  background-repeat: no-repeat;
  background-size: 20px;
  padding: 12px 20px 12px 40px;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
  transition: border-color 0.4s;
  transition: box-shadow 0.2s;
  :focus {
    border: 1px solid #fff;
    box-shadow: 0px 0px 5px #ffffff99;
    border-color: #fff;
  }
`;

export const GradientBox = styled.div`
  height: 445px;
  background: url("images/gradientRec.png");
`;

export const LoginLinkButton = styled.a`
  border: "1px solid";
  display: none;
  padding: 8px 20px;
  column-gap: 16px;
  width: 100%;
  border-radius: 6px;
  transition: 0.3s ease;
  background-color: "#42a5f5";
  border-color: "#42a5f5";

  ::before {
    font-size: 12px;
    width: 100%;
    content: "LOGIN";
    text-align: center;
  }
  :hover {
    color: white;
    background-color: transparent;
    border-color: transparent;
  }

  ${mq["sm"]} {
    display: flex;
  }
`;
