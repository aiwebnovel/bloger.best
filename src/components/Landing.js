import { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { authService, firebaseInstance } from "../public/firebaseConfig";
import * as config from "../config";
import { ToastContainer, toast } from "react-toastify";
import Modal from "./Modal";
import facebookicon from "../public/facebook.png";
import googleicon from "../public/google.png";
import "react-toastify/dist/ReactToastify.css";
import "../style/Landing.css";
import "../style/Main.css";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
    };
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = (event) => {
    this.setState({ [event.target.name]: true });
  };

  closeModal = () => {
    this.setState({ priceModalOpen: false });
    this.setState({ loginModalOpen: false });
  };

  async signIn(event) {
    const {
      target: { name },
    } = event;
    let provider = new firebaseInstance.auth.GoogleAuthProvider();
    if (name === "Facebook") {
      provider = new firebaseInstance.auth.FacebookAuthProvider();
    } else if (name === "Google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }

    await authService
      .signInWithPopup(provider)
      .then(async (result) => {
        /** @type {firebase.auth.OAuthCredential} */
        let credential = result.credential;
        let user = result.user;
        //console.log(credential);
        //console.log(user.za);
        //console.log(credential.idToken);
        await localStorage.setItem("token", user.za);
        this.setState({ user: true });
        toast(
          `Thank you for visiting our site. The service is currently awaiting approval. I'll let you know as soon as it starts.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
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
      <Fragment>
        <div class="infomationMain">
          <div class="infomation">
            <h1>
              간단하고 빠르게 <br />
              블로그를 업그레이드 하세요.
            </h1>
            AI가 블로그를 기획하고
            <br /> 글을 작성하는 과정을 돕습니다.
            <br />
            <br /> 아이디어, 개요, 제목, 도입부,
            <br /> 아이디/도메인
            <br /> 그리고 문장 이어쓰기까지
            <br />
            <br /> 이제 블로그를 <br />더 빨리, 더 쉽게 쓰실 수 있습니다.
          </div>
          <Link to="/idea">
            <span className="infomationLogin">체험해보기</span>
          </Link>
        </div>

        <Modal
          open={this.state.loginModalOpen}
          close={this.closeModal}
          title="Login"
        >
          <button onClick={this.signIn} class="loginModal">
            <img
              src={googleicon}
              onClick={this.signIn}
              name="Google"
              class="google"
            />
          </button>
          <br />
          <button
            onClick={this.signIn}
            onClick={this.signIn}
            class="loginModal"
          >
            <img src={facebookicon} name="Facebook" class="facebook" />
          </button>
        </Modal>
      </Fragment>
    );
  }
}

export default Landing;
