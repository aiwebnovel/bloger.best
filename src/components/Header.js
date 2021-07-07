import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import ProgressBar from "@ramonak/react-progress-bar";
import '../style/Header.css';
import usericon from '../public/user.png';
import facebookicon from '../public/facebook.png';
import googleicon from '../public/google.png';
import * as config from '../config';
import Modal from './Modal';
//import { GoogleLogin } from 'react-google-login';




class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '로그인 되지 않은 사용자',
      userToken: 0,
      userTokenP: 0,
      userImage: usericon,
      priceModalOpen: false,
      loginModalOpen: false,
      user: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    
  }

  openModal = (event) => {
    this.setState({ [event.target.name]: true })
  }

  closeModal = () => {
    this.setState({ priceModalOpen: false })
    this.setState({ loginModalOpen: false })
  }

  showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    this.requestProfile();

    if (this.state.showMenu) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }else{
      this.setState({ showMenu: true });
      document.addEventListener('click', this.closeMenu);
    }
  }
  
  closeMenu(event) {
    event.preventDefault();

    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem('token');
   
    if (user !== undefined) {
      axios.get(`${config.SERVER_URL}/profile`, { headers: {authentication: user} })
      .then((response) => {
        console.log(user);
        this.setState({user: true});
        this.setState({ userName: response.data.name});
        this.setState({ userToken: response.data.token});
        this.setState({ userTokenP: response.data.tokenP});
        this.setState({ userImage: response.data.photoURL});
        localStorage.setItem( 'userUid', response.data.Uid);
        localStorage.setItem( 'plan', response.data.Uid);
        this.closeModal();
      })
      .catch((error) => {
        
      })
    }

  }

  async refreshProfile() {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser.getIdToken().then(async (data) => {
          await localStorage.setItem('token', data)

        }).catch(async (error) => {
          //console.log(error);
        });
      }
    });
  }

  async componentDidMount(){
    await this.refreshProfile();
    await this.requestProfile();
  }

  async signOut(){
    await localStorage.removeItem('token');
    this.setState({user: false});
    this.setState({ showMenu: false });
    document.removeEventListener('click', this.closeMenu);
    await authService.signOut();
  }

  async signIn(event){
    const { target: { name } } = event;
    let provider = new firebaseInstance.auth.GoogleAuthProvider();
    if (name === 'Facebook') { provider = new firebaseInstance.auth.FacebookAuthProvider(); }
    else if (name === 'Google'){ provider = new firebaseInstance.auth.GoogleAuthProvider(); }

    await authService.signInWithPopup(provider).then(async(result) => {
      /** @type {firebase.auth.OAuthCredential} */
      let credential = result.credential;
      let user = result.user;
      //console.log(credential);
      //console.log(user.za);
      //console.log(credential.idToken);
      await localStorage.setItem('token', user.za)
      this.setState({user: true});
      toast(`Thank you for visiting our site. The service is currently awaiting approval. I'll let you know as soon as it starts.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.requestProfile();
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;
    });
  }

  render() {
    return (
      <header>
      <Link to="/"><span class="logo">Bloggy</span></Link>
        <div class="loginProfile">
          <Link to="/membership"><span className='links' >membership</span></Link>

          { localStorage.getItem('token') ? 
            <div class="profile">
              <a onClick={this.showMenu}>
                <img  src={this.state.userImage} class="profileicon"/>
              </a>
            </div>
            : <button className='login' onClick={ this.openModal } name='loginModalOpen'>login</button>
          }

          <Modal open={ this.state.loginModalOpen } close={ this.closeModal } title="Login">
            <button  onClick={this.signIn} class="loginModal">
              <img  src={googleicon} onClick={this.signIn} name='Google' class='google'/>
            </button>
            <br/>
            <button onClick={this.signIn} onClick={this.signIn} class="loginModal">
              <img  src={facebookicon} name='Facebook' class='facebook'/>
            </button>
          </Modal>


          { this.state.showMenu ? (
            <div ref={(element) => { this.dropdownMenu = element; }}>
              <div class="dropdown">
                <div class="name">
                  <p>{this.state.userName}</p>
                </div>
                <div class="token">
                  <ProgressBar completed={this.state.userTokenP} height="8px" isLabelVisible={false}/>
                  <span>{this.state.userToken} token</span>
                </div>
                <button onClick={this.signOut} class="logout">logout</button>
              </div>
            </div> ) : (null)
          }
        </div>


        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </header>
    );
  }
}


export default Header;
