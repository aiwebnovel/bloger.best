import React, {useContext} from "react";
import Header from "../components/Header.js";
import Ideap from "../components/Idea.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Idea = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Ideap sizes={size}/>
      <Footer />
    </div>
  );
};

export default Idea;
