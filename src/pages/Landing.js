import React, {useContext} from 'react';
import Header from '../components/Header.js';
import Home from '../components/Landing.js';
import Footer from '../components/Footer.js';
import { ResponsiveContext } from "grommet";

const Landing = () => {
  const size = useContext(ResponsiveContext);
  
  const mediumPoint = {
    medium : {
      value: 1024,
        edgeSize: {
          none: '0px',
          small: '12px',
          medium: '24px',
          large: '48px',
        },
    }
  }

  return (
    <div>
      <Header/>
      <Home sizes={size} medium={mediumPoint}/>
      <Footer/>
    </div>
  );
};

export default Landing;