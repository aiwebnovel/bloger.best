import { Component, Fragment } from "react";
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
import "../style/Idea.css";
import "react-table-v6/react-table.css";
const LanguageDetect = require("languagedetect");

class Idea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loading: false,
      isStart: false,
      outputKr: ["a", "b", "c", "d", "e"],
      outputEn: ["a", "b", "c", "d", "e"],
      input: " ",
    };
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
  }

  openModal = (event) => {
    this.setState({ [event.target.name]: true });
  };

  closeModal = () => {
    this.setState({ priceModalOpen: false });
    this.setState({ loginModalOpen: false });
  };

  async handle(e) {
    this.setState({ input: e.target.value });
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

  async requestcontents() {
    if (localStorage.getItem("token") !== undefined) {
      let story = this.state.input;

      if (story === " " || story === " ") {
        toast.error(`주제를 입력해 주세요!`, {
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
          `${config.SERVER_URL}/blog/idea`,
          {
            story: story,
          },
          {
            headers: { authentication: localStorage.getItem("token") },
          }
        )
        .then(async (response) => {
          let resK = [];
          let resE = [];
          for (let i = 0; i < response.data.length; i++) {
            await resK.push(response.data[i][0]);
            await resE.push(response.data[i][1]);
          }
          this.setState({ outputKr: resK });
          this.setState({ outputEn: resE });

          this.setState({ loading: false });
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
              블로그 아이디어 <br /> <br />
              블로그 개요 <br /> <br />
              블로그 제목 <br /> <br />
              블로그 도입부 <br /> <br />
              블로그 아이디/도메인 <br /> <br />
              블로그 이어쓰기 <br /> <br />
              <br /> <br />
              최근 저장 기록
            </div>
          </div>
          <div class="ideaRight">
            <div class="ideaInput">
              <p>블로그 주제</p>
              <textarea
                class="ideaInput1"
                value={this.state.input}
                onChange={this.handle}
              />
              <button class="start" onClick={this.requestcontents}>
                create
              </button>
            </div>
            {this.state.isStart ? (
              <div class="ideaOutput">
                <table>
                  <tbody>
                    <tr>
                      <td>결과값 1</td>
                      <td>{this.state.outputKr[0]}</td>
                      <td>{this.state.outputEn[0]}</td>
                      <td>copy, save</td>
                    </tr>
                    <tr>
                      <td>결과값 2</td>
                      <td>{this.state.outputKr[1]}</td>
                      <td>{this.state.outputEn[1]}</td>
                      <td>copy, save</td>
                    </tr>
                    <tr>
                      <td>결과값 3</td>
                      <td>{this.state.outputKr[2]}</td>
                      <td>{this.state.outputEn[2]}</td>
                      <td>copy, save</td>
                    </tr>
                    <tr>
                      <td>결과값 4</td>
                      <td>{this.state.outputKr[3]}</td>
                      <td>{this.state.outputEn[3]}</td>
                      <td>copy, save</td>
                    </tr>
                    <tr>
                      <td>결과값 5</td>
                      <td>{this.state.outputKr[4]}</td>
                      <td>{this.state.outputEn[4]}</td>
                      <td>copy, save</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>
            ) : null}
          </div>
        </div>
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

export default Idea;
