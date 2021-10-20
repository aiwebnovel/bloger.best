import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ReactTable from "react-table-v6";
import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";
import copyicon from "../public/copy.png";
import { toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import Modal from "./Modal";
import facebookicon from "../public/facebook.png";
import googleicon from "../public/google.png";
import "react-toastify/dist/ReactToastify.css";
import "../style/Idea.css";
import "react-table-v6/react-table.css";

import { Grid, Box, Button } from "grommet";
import { Search } from "grommet-icons";

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
      input: "",
      keyword: "",
      keywordOutput: [],
    };
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.savecontents = this.savecontents.bind(this);
    this.handleState = this.handleState.bind(this);
    this.requestkeywords = this.requestkeywords.bind(this);
  }

  async handle(e) {
    this.setState({ input: e.target.value });
  }

  async handleState(e) {
    this.setState({ keyword: e.target.value });
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== undefined) {
      let story = this.state.input;

      const date = new Date();
      let time = localStorage.getItem("time");

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

  async requestkeywords() {
    if (localStorage.getItem("token") !== undefined) {
      let keyword = this.state.keyword;
      console.log(this.state.keyword);
      console.log(keyword);
      if (keyword === " " || keyword === "") {
        toast.error(`키워드를 입력해 주세요!`, {
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
        .get(`${config.SERVER_URL}/keyword/${keyword}`, {
          headers: { authentication: localStorage.getItem("token") },
        })
        .then(async (response) => {
          console.log(response.data.list);

          this.setState({ keywordOutput: response.data.list });
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
            toast.error(`맞는 키워드가 없습니다`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
    }
    this.setState({ loading: false });
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
            category: "idea",
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
      <Box className='ideaMain'>
        <Grid
          fill
          rows={
            this.props.sizes !== "small" ? ["auto", "flex"] : ["auto", "auto"]
          }
          columns={this.props.sizes !== "small" ? ["auto", "flex"] : ["auto"]}
          areas={
            this.props.sizes !== "small"
              ? [
                  { name: "sideMenu", start: [0, 1], end: [0, 1] },
                  { name: "main", start: [1, 0], end: [1, 1] },
                ]
              : [
                  { name: "sideMenu", start: [0, 0], end: [0, 0] },
                  { name: "main", start: [0, 1], end: [0, 1] },
                ]
          }
        >
          <Box
            gridArea='sideMenu'
            // justify='center'
            align='center'
            background='#fff'
            width='small'
            className='SiderStyle'
          >
            <div className='ServiceNav'>
              <div className="MenuItem">
                <Link to='/idea'>블로그 아이디어</Link>
              </div>
              <div className="MenuItem">
                <Link to='/name'>블로그 개요</Link>
              </div>
              <div className="MenuItem">
                <Link to='/title'>블로그 제목</Link>
              </div>
              <div className="MenuItem">
                <Link to='/intro'>블로그 도입부</Link>
              </div>
              <div className="MenuItem">
                <Link to='/follow'>블로그 이어쓰기</Link>
              </div>
              <div className="MenuItem">
                <Link to='/save'>최근 저장 기록</Link>
              </div>
            </div>
          </Box>
          <Box 
          gridArea='main'
          //justify='center'
          align='center'
          className="mainStyle"
          >
            <div className='keywordDiv'>
                <input 
                type="text"
                name="keyword"
                placeholder="블로그에 필요한 키워드를 입력해주세요!" 
                value={this.state.keyword} 
                onChange={this.handleState} className="keywordInput"/>
                <button className="buttonStyle" onClick={this.requestkeywords}><Search/></button>
              </div>
              {this.state.keywordOutput.map((data, i) => {
                return (
                  <button className="keywordResult" key={i} onClick={this.handle} value={data}>
                    {data}
                  </button>
                );
              })}

            <div className="BlogIdeaBox">
                <input
                  type="text"
                  name="idea"
                  placeholder="결과로 나온 블로그 키워드를 하나 선택해주세요!"
                  className='IdeaInput'
                  value={this.state.input}
                  onChange={this.handle}
                />
                <Button primary label="글쓰기" onClick={this.requestcontents}/>
            </div>
            {this.state.isStart && (
              <div className='ideaOutput'>
                <table>
                  <tbody>
                    <tr>
                      <td>{this.state.outputKr[0]}</td>
                      <td>{this.state.outputEn[0]}</td>
                      <td className='hover'>
                        <CopyToClipboard text={this.state.outputKr[0]}>
                          <img
                            alt='copy'
                            src={copyicon}
                            className='reseticon'
                          />
                        </CopyToClipboard>
                        <button
                          name='0'
                          onClick={this.savecontents}
                          className='save'
                        >
                          save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Box>
        </Grid>
        {this.state.loading && (
          <div className='loading'>
            <Spinner size={200} color='#3b2479' />
          </div>
        )}
      </Box>
    );
  }
}

export default Idea;
