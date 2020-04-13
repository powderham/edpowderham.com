import * as React from "react";
import { HeaderStyled } from "./styles";

const Header = () => (
  <HeaderStyled>
    <span>
      <img alt="Ed Powderham" src="/images/profile.jpg" />
    </span>

    <h1>Ed Powderham</h1>
    <h2>Public notes to self</h2>
    {/* {% include social-links.html %} */}
  </HeaderStyled>
);

export default Header;
