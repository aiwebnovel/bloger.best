import React, {useContext} from "react";
import Header from "../components/Header.js";
import Followp from "../components/Follow.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Follow = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Followp sizes={size}/>
      <Footer />
    </div>
  );
};

export default Follow;
