import styled from "styled-components";
import { gama } from "../../constants/variables";

export const HeaderStyled = styled.div`
  display: block;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 99;

  span {
    img {
      width: 125px;
      margin-bottom: 25px;
      border-radius: 100%;
      transition: all 0.2s;
      box-shadow: 0;
      opacity: 1;

      &:hover {
        box-shadow: 0 0px 4px 0 rgba(0, 0, 0, 0.18),
          0 0px 12px 0 rgba(0, 0, 0, 0.15);
        opacity: 0.8;
      }
    }
  }

  h1 {
    font-size: 4rem;
    margin: 0 0 13px;
  }

  h2 {
    font-size: 1.85rem;
    font-weight: 300;
    font-style: normal;
    color: ${gama};
    width: 70%;
    margin: 0 auto 30px;

    a {
      font-weight: 200;
    }
  }
`;
