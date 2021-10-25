import { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";
import { toast } from "react-toastify";

import "../style/Main.css";
import "react-table-v6/react-table.css";

import styled from "styled-components";

import { Grid, Box } from "grommet";
import { Apps, Search, Configure, Copy } from "grommet-icons";

const LanguageDetect = require("languagedetect");

class Idea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
      loading: false,
      isOutput: false,
      outputKr: ["a", "b", "c", "d", "e"],
      outputEn: ["a", "b", "c", "d", "e"],
      input: "",
      keyword: "",
      keywordOutput: [],
      isSider: false,
      copied: false,
    };
    this.handle = this.handle.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.savecontents = this.savecontents.bind(this);
    this.handleState = this.handleState.bind(this);
    this.requestkeywords = this.requestkeywords.bind(this);
    this.handleSider = this.handleSider.bind(this);
  }


  onCopied = () => {
    if (this.state.outputKr[0] !== "") {
      this.setState({ copied: true });
      toast.success('Copied!');
    } else {
      toast.warn("복사할 내용이 없어요!😭");
    }
  };

  handleSider() {
    this.setState({ isSider: !this.state.isSider });
  }

  async handle(e) {
    this.setState({ input: e.target.value });
  }

  async handleState(e) {
    this.setState({ keyword: e.target.value });
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== null) {
      let story = this.state.input;

      const date = new Date();
      let time = localStorage.getItem("time");

      if (time !== undefined && time !== null && time !== "") {
        const timeD = -(Date.parse(time) - date.getTime());
        //console.log(timeD);
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
    this.setState({ isOutput: true });
  }

  async requestkeywords() {
    if (localStorage.getItem("token") !== null) {
      let keyword = this.state.keyword;
      //console.log(this.state.keyword);
      //console.log(keyword);
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
    
    if (localStorage.getItem("token") !== null) {
      
      let story = this.state.outputKr[Number(e.target.name)];
      // this.setState({ loading: true });
      console.log('story', story);
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
          // this.setState({ loading: false });
            toast.success('저장되었습니다!');
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
          } else if (error.response.status === 403) {
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
            } else {
              toast.error('저장에 실패했습니다!');
            }
        });
    }
    this.setState({ isOutput: true });
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
            justify='center'
            // justify={this.props.sizes !== 'small'? 'center' : 'start'}
            align='center'
            className='mainStyle'
          >
            <div className='KeyContainer'>
              <div className='keywordDiv'>
                <input
                  type='text'
                  name='keyword'
                  placeholder='블로그 아이디어에 필요한 키워드를 입력해주세요!'
                  value={this.state.keyword}
                  onChange={this.handleState}
                  className='keywordInput'
                />
                <button className='buttonStyle' onClick={this.requestkeywords}>
                  <Search />
                </button>
              </div>
              {this.state.keywordOutput && (
              <div className='resultBox'>
                <Grid
                  columns={
                    this.props.sizes !== "small"
                      ? { count: 6, size: "auto" }
                      : { count: 3, size: "auto" }
                  }
                  gap='small'
                >
                  {this.state.keywordOutput.map((data, i) => {
                    return (
                      <button
                        className='keywordResult'
                        key={`key${i}`}
                        onClick={this.handle}
                        value={data}
                      >
                        {data}
                      </button>
                    );
                  })}
                </Grid>
              </div>
               )}
            </div>
            {this.state.loading ? (
          <div className='loading'>
            <Spinner size={200} color='#3b2479' />
          </div>
            ) :(
            <div className='IdeaContainer'>
              <div className='BlogIdeaBox'>
                <input
                  type='text'
                  name='idea'
                  placeholder='결과로 나온 키워드를 하나 선택해주세요!'
                  className='IdeaInput'
                  value={this.state.input}
                  onChange={this.handle}
                />
                <button className='buttonStyle' onClick={this.requestcontents}>
                  <Configure />
                </button>
              </div>
              <div className='IdeaResultBox'>
                {this.state.isOutput && (
                  <div className='ideaOutput'>
                    <div className="outputKo">{this.state.outputKr[0]}</div>
                    <div className="outputEn">{this.state.outputEn[0]}</div>
                    <div className='Btns'>
                      <CopyToClipboard 
                      text={this.state.outputKr[0]}
                      onCopy={this.onCopied}
                      >
                        <Copy style={{cursor:'pointer'}}/>
                      </CopyToClipboard>
                      <button
                        name='0'
                        onClick={this.savecontents}
                        className='save'
                      >
                        save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </Box>
        </Grid>
      </Box>
    );
  }
}

export default Idea;

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
