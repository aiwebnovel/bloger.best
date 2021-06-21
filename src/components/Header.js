import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style/Header.css';
//import { GoogleLogin } from 'react-google-login';




class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '로그인 되지 않은 사용자',
      userToken: 0,
      userTokenP: 0,
      priceModalOpen: false,
      loginModalOpen: false,
      user: false
    };
  }



  render() {
    return (
      <header>
      <Link to="/"><span class="logo">Bloger</span></Link>
      </header>
    );
  }
}


export default Header;
