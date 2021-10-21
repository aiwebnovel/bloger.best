import React, {useContext}  from "react";
import Header from "../components/Header.js";
import Domainp from "../components/Domain.js";
import Footer from "../components/Footer.js";
import { ResponsiveContext } from "grommet";

const Domain = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Domainp sizes={size}/>
      <Footer />
    </div>
  );
};

export default Domain;
