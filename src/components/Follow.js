import { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";

import { toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";

import "react-toastify/dist/ReactToastify.css";
import "../style/Follow.css";
import styled from "styled-components";

import { Grid, Box } from "grommet";
import { Apps, Configure, Copy } from "grommet-icons";

const LanguageDetect = require("languagedetect");

class Follow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loading: false,
      outputKr: "",
      outputLength: 0,
      outputEn: "",
      isHuman: true,
      tempLength: 0,
      isSider: false,
      copied: false,
    };
    this.signIn = this.signIn.bind(this);
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.handleSider = this.handleSider.bind(this);
  }

  onCopied = () => {
    if (this.state.outputKr !== "") {
      this.setState({ copied: true });
      toast.success("Copied!");
    } else {
      toast.warn("복사할 내용이 없어요!😭");
    }
  };

  handleSider() {
    this.setState({ isSider: !this.state.isSider });
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
    if (localStorage.getItem("token") !== null) {
      let story = String(this.state.outputKr).trim();

      this.setState({ outputKr: story });
      this.setState({
        tempLength:
          ((this.state.outputKr.length - this.state.outputLength) * 100) / 100,
      });
      if (this.state.tempLength < 100) {
        toast.error(`${ 100-this.state.tempLength}자를 더 입력해 주세요!`);
        return;
      }
      if (story === " " || story === "" || story === "undefined") {
        toast.error(`내용을 입력해 주세요!`);
        return;
      }
      const date = new Date();
      let time = localStorage.getItem("time");
      if (time !== undefined && time !== null && time !== "") {
        const timeD = -(Date.parse(time) - date.getTime());
        console.log(timeD);
        if (timeD < 6500) {
          toast.error(
            `${7 - Math.ceil(timeD / 1000)}초 이후에 다시 시도해 주세요`);
          return;
        }
      }
      localStorage.setItem("time", date);
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
          if (response.data[2] >= 2) {
            toast.error(
              `AI가 만든 결과물에 유해한 내용이 포함되어 있어서 표시할 수 없습니다. 입력하신 내용을 수정해서 다시 입력해보세요`);
              this.setState({ loading: false });
          } else {
          this.setState({
            outputLength: this.state.outputKr.length + response.data[0].length,
          });
          this.setState({ outputKr: this.state.outputKr + response.data[0] });
          this.setState({ outputEn: this.state.outputEn + response.data[1] });
          this.setState({ loading: false });
          this.setState({ tempLength: 0 });
        }})
        .catch((error) => {
          //console.log(error);
          if (error.response.status === 412) {
            this.setState({ loading: false });
            toast.error(`로그인이 필요합니다!`);
            localStorage.removeItem("token");
          } else {
            if (error.response.status === 403) {
              this.setState({ loading: false });
              toast.error(`토큰이 부족합니다!`);
            }
          }
        });
    }
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
                  { name: "sideMenu", start: [0, 0], end: [0, 0] },
                  { name: "main", start: [1, 0], end: [1, 0] },
                ]
              : [
                  { name: "sideMenu", start: [0, 0], end: [0, 0] },
                  { name: "main", start: [0, 1], end: [0, 1] },
                ]
          }
        >
          {this.state.isSider ? (
            <Box
              gridArea='sideMenu'
              // justify='center'
              align='center'
              background='#fff'
              className='SiderStyle'
              animation={
                this.props.sizes !== "small"
                  ? [
                      { type: "fadeIn", duration: 300 },
                      { type: "slideRight", size: "xlarge", duration: 150 },
                    ]
                  : [
                      { type: "fadeIn", duration: 300 },
                      { type: "slideDown", size: "small", duration: 300 },
                    ]
              }
            >
              <div className='IconBox' onClick={this.handleSider}>
                <Apps
                  color='#fff'
                  size='medium'
                  style={{ marginRight: "5px" }}
                />
                <p>
                  <b>Menu</b>
                </p>
              </div>
              <div className='ServiceNav'>
                <MenuItem to='/idea'>블로그 아이디어</MenuItem>
                <MenuItem to='/name'>블로그 개요</MenuItem>
                <MenuItem to='/title'>블로그 제목</MenuItem>
                <MenuItem to='/intro'>블로그 도입부</MenuItem>
                <MenuItem to='/domain'>블로그 도메인</MenuItem>
                <MenuItem to='/follow'>블로그 이어쓰기</MenuItem>
                {localStorage.getItem("token") && <MenuItem to='/save'>최근 저장 기록</MenuItem>}
              </div>
            </Box>
          ) : (
            <div className='IconBox' onClick={this.handleSider}>
              <Apps color='#fff' size='medium' style={{ marginRight: "5px" }} />
              <p>
                <b>Menu</b>
              </p>
            </div>
          )}

          <Box
            gridArea='main'
            background='#f9f9f9'
            justify='center'
            //align='center'
            className='mainStyle'
          >
            <div className='outputHeader'>
              <div className='TitleTag'>
                <h4>블로그 이어쓰기</h4>
                <div className='progressNbtn'>
                  <ProgressBar
                    completed={this.state.tempLength}
                    bgColor='#55d4bc'
                    width='220px'
                    height='8px'
                    margin='20px 0'
                    isLabelVisible={false}
                  />
                <div className="HeaderBtns">
                  <button
                    className='CreateButtonStyle'
                    onClick={this.requestcontents}
                  >
                    Create
                  </button>
                                    
                  <CopyToClipboard
                    text={this.state.outputKr}
                    onCopy={this.onCopied}
                  >
                    <button className='CreateButtonStyle'>Copy</button>
                  </CopyToClipboard>
                </div>
                </div>
              </div>
            </div>
            <div className='outputContainer'>
              {this.state.loading ? (
                <div className='loading'>
                  <Spinner size={200} color='#3b2479' />
                </div>
              ) : (
                <>
                  <textarea
                    className='output'
                    value={this.state.outputKr}
                    onChange={this.handle}
                    placeholder='블로그에 올릴 글을 써보세요!'
                  />
                  <textarea
                    className='output_right'
                    value={this.state.outputEn}
                    readOnly
                  />
                </>
              )}
            </div>
          </Box>
        </Grid>
      </Box>
    );
  }
}

export default Follow;

const MenuItem = styled(Link)`
  display: block;
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  transition: all 200ms ease-in-out;

  &:hover,
  &:focus {
    background-color: #f9f9f9;
    font-weight: 600;
  }
`;
