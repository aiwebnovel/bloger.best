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

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isStart: false,
      output: {
        0: { content: " " },
        1: { content: " " },
        2: { content: " " },
        3: { content: " " },
        4: { content: " " },
        5: { content: " " },
        6: { content: " " },
        7: { content: " " },
        8: { content: " " },
        9: { content: " " },
      },
    };
    this.requestcontents = this.requestcontents.bind(this);
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== undefined) {
      this.setState({ loading: true });
      await axios
        .get(`${config.SERVER_URL}/blog/load`, {
          headers: { authentication: localStorage.getItem("token") },
        })
        .then(async (response) => {
          await this.setState({ output: response.data.save });
          this.setState({ loading: false });
        })
        .catch((error) => {
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
          }
        });
    }
    this.setState({ isStart: true });
  }

  componentDidMount() {
    this.requestcontents();
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
              <p>최근 저장 기록</p>
            </div>
            {this.state.isStart ? (
              <div class="ideaOutput">
                <table>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{this.state.output[0]["category"]}</td>
                      <td>{this.state.output[0]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[0]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>{this.state.output[1]["category"]}</td>
                      <td>{this.state.output[1]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[1]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>{this.state.output[2]["category"]}</td>
                      <td>{this.state.output[2]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[2]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>{this.state.output[3]["category"]}</td>
                      <td>{this.state.output[3]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[3]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>{this.state.output[4]["category"]}</td>
                      <td>{this.state.output[4]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[4]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>{this.state.output[5]["category"]}</td>
                      <td>{this.state.output[5]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[5]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>{this.state.output[6]["category"]}</td>
                      <td>{this.state.output[6]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[6]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>{this.state.output[7]["category"]}</td>
                      <td>{this.state.output[7]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[7]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>{this.state.output[8]["category"]}</td>
                      <td>{this.state.output[8]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[8]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
                      </td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>{this.state.output[9]["category"]}</td>
                      <td>{this.state.output[9]["content"]}</td>
                      <td>
                        <CopyToClipboard text={this.state.output[9]["content"]}>
                          <img src={copyicon} class="reseticon" />
                        </CopyToClipboard>
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

export default Save;
