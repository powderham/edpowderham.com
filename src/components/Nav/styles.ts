import styled from "styled-components";
import { alpha } from "../../constants/variables";

export const NavStyled = styled.nav<{ isHomePage: boolean }>`
  ${({ isHomePage }) =>
    isHomePage
      ? `
    margin-top: 40px;
    text-align:center;
    `
      : `
    position: absolute;
    right: 0;
    top: 0;
    `}
`;

export const NavLink = styled.a`
  display: inline-block;
  font-weight: 300;
  font-size: 1.4rem;
  padding: 20px 10px;
  text-decoration: none;

  font-size: 1.4rem;
  padding: 20px 10px;
`;

export const NavLinkHome = styled(NavLink)`
  font-size: 2rem;
  padding: 7px 15px;
  margin: 0;
  border-radius: 4%;
  transition: all 0.4s ease-in-out;
  width: 70px;

  &:hover {
    color: ${alpha};
  }
`;

export const List = styled.ul<{ isHomePage: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0 13px 0;
  padding: ${({ isHomePage }) => (isHomePage ? 0 : "0 13px 0")};

  > li {
    display: inline-block;
  }
`;
