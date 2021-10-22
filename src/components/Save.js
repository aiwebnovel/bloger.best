import { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";

import copyicon from "../public/copy.png";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../style/Save.css";
import styled from "styled-components";

import { Grid, Box } from "grommet";
import { Apps, Search, Configure, Copy } from "grommet-icons";

const LanguageDetect = require("languagedetect");

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isOutput: false,
      output: {
        0: { content: "" },
        1: { content: "" },
        2: { content: "" },
        3: { content: "" },
        4: { content: "" },
        5: { content: "" },
        6: { content: "" },
        7: { content: "" },
        8: { content: "" },
        9: { content: "" },
      },
      isSider: false,
    };
    this.requestcontents = this.requestcontents.bind(this);
    this.handleSider = this.handleSider.bind(this);
  }

  onCopied = () => {
    if (this.state.output !== "") {
      this.setState({ copied: true });
      toast.success("Copied!");
    } else {
      toast.warn("복사할 내용이 없어요!😭");
    }
  };

  handleSider() {
    this.setState({ isSider: !this.state.isSider });
  }

  async requestcontents() {
    if (localStorage.getItem("token") !== null) {
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
    this.setState({ isOutput: true });
  }

  componentDidMount() {
    this.requestcontents();
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
                <MenuItem to='/save'>최근 저장 기록</MenuItem>
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
            <div className='SaveContainer'>
              <h4>최근 저장 기록</h4>
              {this.state.isOutput && (
                  <div className='saveFrame'>
                    <div className='saveBox'>
                      <p>1</p>
                      <p>{this.state.output[0]["category"]}</p>
                      <p>{this.state.output[0]["content"]}</p>
                      <p>
                        <CopyToClipboard
                          text={this.state.output[0]["content"]}
                          onCopy={this.onCopied}
                        >
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>2</p>
                      <p>{this.state.output[1]["category"]}</p>
                      <p>{this.state.output[1]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[1]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>3</p>
                      <p>{this.state.output[2]["category"]}</p>
                      <p>{this.state.output[2]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[2]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>4</p>
                      <p>{this.state.output[3]["category"]}</p>
                      <p>{this.state.output[3]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[3]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>5</p>
                      <p>{this.state.output[4]["category"]}</p>
                      <p>{this.state.output[4]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[4]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>6</p>
                      <p>{this.state.output[5]["category"]}</p>
                      <p>{this.state.output[5]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[5]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>7</p>
                      <p>{this.state.output[6]["category"]}</p>
                      <p>{this.state.output[6]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[6]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>8</p>
                      <p>{this.state.output[7]["category"]}</p>
                      <p>{this.state.output[7]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[7]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>9</p>
                      <p>{this.state.output[8]["category"]}</p>
                      <p>{this.state.output[8]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[8]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                    <div className='saveBox'>
                      <p>10</p>
                      <p>{this.state.output[9]["category"]}</p>
                      <p>{this.state.output[9]["content"]}</p>
                      <p>
                        <CopyToClipboard text={this.state.output[9]["content"]}>
                          <Copy />
                        </CopyToClipboard>
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </Box>
        </Grid>
      </Box>
    );
  }
}

export default Save;

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
