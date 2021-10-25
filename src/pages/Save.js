import React, {useContext}  from "react";
import Header from "../components/Header.js";
import Savep from "../components/Save.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Save = () => {
  const size = useContext(ResponsiveContext);

  return (
    <div>
      <Header />
      <Savep sizes={size}/>
      <Footer />
    </div>
  );
};

export default Save;
