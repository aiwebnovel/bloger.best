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
import "../style/Idea.css";
import "react-table-v6/react-table.css";
const LanguageDetect = require("languagedetect");

class Domain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loading: false,
      isStart: false,
      outputKr: ["a", "b", "c", "d", "e"],
      outputEn: ["a", "b", "c", "d", "e"],
      desc: "",
      keyword: "",
    };
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.savecontents = this.savecontents.bind(this);
  }

  async handle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== undefined) {
      const date = new Date();
      let time = localStorage.getItem("time");
      let story = { desc: this.state.desc, keyword: this.state.keyword };

      if (time !== undefined && time !== null && time !== "") {
        const timeD = -(Date.parse(time) - date.getTime());
        console.log(timeD);
        if (timeD < 6500) {
          toast.error(
            `${7 - Math.ceil(timeD / 1000)}초 이후에 다시 시도해 주세요`,
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
          return;
        }
      }
      localStorage.setItem("time", date);

      if (story.desc === "" || story.keyword === "") {
        toast.error(`공백인 칸이 있습니다!`, {
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
        .post(`${config.SERVER_URL}/blog/domain`, story, {
          headers: { authentication: localStorage.getItem("token") },
        })
        .then(async (response) => {
          let resK = [];
          let resE = [];
          if (response.data[2] >= 2) {
            toast.error(
              `결과물에 유해한 내용이 포함되어 있어서 표시할 수 없습니다. 입력하신 내용을 수정해서 다시 입력해보세요`,
              {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          }
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

  async savecontents(e) {
    if (localStorage.getItem("token") !== undefined) {
      let story = this.state.outputKr[Number(e.target.name)];
      this.setState({ loading: true });
      await axios
        .post(
          `${config.SERVER_URL}/blog/save`,
          {
            story: story,
            category: "domain",
          },
          {
            headers: { authentication: localStorage.getItem("token") },
          }
        )
        .then(async (response) => {
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
              toast.error(`더 이상 저장할 수 없습니다`, {
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
              <p>블로그 설명</p>
              <input
                class="ideaInput1"
                name="desc"
                value={this.state.desc}
                onChange={this.handle}
              />
              <p>블로그 주요 키워드</p>
              <input
                class="ideaInput1"
                name="keyword"
                value={this.state.keyword}
                onChange={this.handle}
              />
              <br />
              <button class="start" onClick={this.requestcontents}>
                create
              </button>
            </div>
            {this.state.isStart ? (
              <div class="ideaOutput">
                <table>
                  <tbody>
                    <tr>
                      <td>{this.state.outputKr[0]}</td>
                      <td>{this.state.outputEn[0]}</td>
                      <td class="hover">
                        <CopyToClipboard text={this.state.outputKr[0]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                        <button
                          name="0"
                          onClick={this.savecontents}
                          className="save"
                        >
                          save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
        {this.state.loading ? (
          <div class="loading">
            <Spinner size="8px" color="#3b2479" />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export default Domain;
