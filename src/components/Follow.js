import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ReactTable from "react-table-v6";
import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";
import reseticon from "../public/reset.png";
import trashicon from "../public/trash.jpg";
import copyicon from "../public/copy.png";
import { ToastContainer, toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import Modal from "./Modal";
import facebookicon from "../public/facebook.png";
import googleicon from "../public/google.png";
import "react-toastify/dist/ReactToastify.css";
import "react-table-v6/react-table.css";
const LanguageDetect = require("languagedetect");

class Follow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loading: false,
      isStart: false,
      outputKr: "",
      outputLength: 0,
      outputEn: "",
      isHuman: true,
      tempLength: 0,
    };
    this.signIn = this.signIn.bind(this);
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
  }

  async handle(e) {
    this.setState({ outputKr: e.target.value });
    this.setState({
      tempLength:
        ((this.state.outputKr.length - this.state.outputLength) * 100) / 100,
    });
  }

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
        this.requestProfile();
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
      });
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== undefined) {
      let story = String(this.state.outputKr).trim();
      this.setState({ outputKr: story });
      this.setState({
        tempLength:
          ((this.state.outputKr.length - this.state.outputLength) * 100) / 100,
      });
      console.log(story.length);
      console.log(story);
      if (this.state.tempLength < 100) {
        toast.error(`추가 내용을 더 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (story === " " || story === "" || story === "undefined") {
        toast.error(`내용을 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      this.setState({ loading: true });
      await axios
        .post(
          `${config.SERVER_URL}/blog/follow`,
          {
            story: story,
          },
          {
            headers: { authentication: localStorage.getItem("token") },
          }
        )
        .then(async (response) => {
          this.setState({ outputKr: this.state.outputKr + response.data[0] });
          this.setState({ outputEn: this.state.outputEn + response.data[1] });
          this.setState({ outputLength: response.data[0].length });
          this.setState({ loading: false });
          this.setState({ tempLength: 0 });
        })
        .catch((error) => {
          //console.log(error);
          if (error.response.status === 412) {
            this.setState({ loading: false });
            toast.error(`로그인이 필요합니다!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            localStorage.removeItem("token");
          } else {
            if (error.response.status === 403) {
              this.setState({ loading: false });
              toast.error(`토큰이 부족합니다!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          }
        });
    }
    this.setState({ isStart: true });
  }

  render() {
    return (
      <Fragment>
        <div class="ideaMain">
          <div class="ideaLeft">
            <div class="ideaLink">
              <Link to="/idea">블로그 아이디어</Link> <br /> <br />
              <Link to="/name">블로그 개요</Link> <br /> <br />
              <Link to="/title">블로그 제목</Link> <br /> <br />
              <Link to="/intro">블로그 도입부</Link> <br /> <br />
              <Link to="/domain">블로그 아이디/도메인</Link> <br /> <br />
              <Link to="/follow">블로그 이어쓰기</Link> <br /> <br />
              <br /> <br />
              <Link to="/save">최근 저장 기록</Link> <br /> <br />
            </div>
          </div>
          <div class="ideaRight">
            <div class="ideaInput">
              <p>블로그 이어쓰기</p>
              <div class="ideaText">
                <textarea
                  class="ideaInput2"
                  value={this.state.outputKr}
                  onChange={this.handle}
                />
                <textarea
                  class="ideaOutput1"
                  value={this.state.outputEn}
                  readOnly
                />
              </div>
              <br />
              <div class="progress">
                <ProgressBar
                  completed={this.state.tempLength}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
              <br />
              <button class="start" onClick={this.requestcontents}>
                create
              </button>
            </div>
          </div>
        </div>
        <br />
        {this.state.loading ? (
          <div class="loading">
            {" "}
            <Spinner size="8px" color="#3b2479" />{" "}
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default Follow;
