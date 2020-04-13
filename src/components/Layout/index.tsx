import Footer from "../Footer";
import Header from "../Header";
import Nav from "../Nav";
import { ContentStyle, GlobalStyle, WrapperStyle } from "./styles";

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <div style={{ marginTop: 125 }} />

      <Header />
      <Nav />
      <WrapperStyle>
        <ContentStyle>{children}</ContentStyle>
      </WrapperStyle>
      <Footer />
    </>
  );
};

export default Layout;
