import React, {useContext} from "react";
import Header from "../components/Header.js";
import Introp from "../components/Intro.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Intro = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Introp sizes={size}/>
      <Footer />
    </div>
  );
};

export default Intro;
