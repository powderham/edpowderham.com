import styled from "styled-components";
import { epsilon, gama } from "../../constants/variables";

export const FooterStyled = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${epsilon};
  padding: 40px 0;
  margin: 40px 0 0;
  font-size: 1.3rem;
  color: ${gama};
  font-weight: 300;
  text-align: center;
  position: relative;

  > .link {
    display: inline;
  }
`;

export const Divider = styled.div`
  display: block;
  content: " ";
  width: 7px;
  height: 7px;
  border: ${epsilon} 1px solid;
  position: absolute;
  top: -5px;
  left: 50%;
  margin-left: -5px;
  background: #fff;
  box-shadow: #fff 0 0 0 5px;
  border-radius: 3px;
`;
