import React, {useContext} from 'react';
import Header from '../components/Header.js';
import Home from '../components/Landing.js';
import Footer from '../components/Footer.js';
import { ResponsiveContext } from "grommet";

const Landing = () => {
  const size = useContext(ResponsiveContext);


  return (
    <div>
      <Header/>
      <Home sizes={size}/>
      <Footer/>
    </div>
  );
};

export default Landing;