import { useRouter } from "next/router";
import { List, NavLink, NavLinkHome, NavStyled } from "./styles";

const Nav = () => {
  const { pathname } = useRouter();
  const pathnameLower = pathname.split("/")[1].toLowerCase();
  const isHomePage = pathnameLower === "";
  const isBlogPage = pathnameLower === "blog";
  const isProjectsPage = pathnameLower === "projects";
  const NavLinkComponent = isHomePage ? NavLinkHome : NavLink;
  return (
    <NavStyled isHomePage={isHomePage}>
      <List isHomePage={isHomePage}>
        {!isHomePage && (
          <li>
            <NavLinkComponent href="/">Home</NavLinkComponent>
          </li>
        )}
        {!isBlogPage && (
          <li>
            <NavLinkComponent href="/blog">Blog</NavLinkComponent>
          </li>
        )}
        {/* {!isProjectsPage && (
          <li>
            <NavLinkComponent href="/projects">Projects</NavLinkComponent>
          </li>
        )} */}
      </List>
    </NavStyled>
  );
};

export default Nav;
