import React, {useContext} from "react";
import Header from "../components/Header.js";
import Titlep from "../components/Title.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";


const Title = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Titlep sizes={size}/>
      <Footer />
    </div>
  );
};

export default Title;
