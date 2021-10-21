import React,{useContext} from "react";
import Header from "../components/Header.js";
import Namep from "../components/Name.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Name = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Namep sizes={size}/>
      <Footer />
    </div>
  );
};

export default Name;
