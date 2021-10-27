import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../style/Landing.css";

import { Box, Grid, Button } from "grommet";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalOpen: false,
    };
  }

  render() {
    return (
      <Box className='LandingPage'>
        <Grid
          fill
          rows={
            this.props.sizes !== "small" ? ["auto", "flex"] : ["auto", "auto"]
          }
          columns={this.props.sizes !== "small" ? ["3.4", "1/4"] : ["auto"]}
          areas={
            this.props.sizes !== "small"
              ? [
                  { name: "main", start: [0, 0], end: [0, 0] },
                  { name: "side", start: [1, 0], end: [1, 0] },
                ]
              : [
                  { name: "main", start: [0, 0], end: [0, 0] },
                  { name: "side", start: [0, 1], end: [0, 1] },
                ]
          }
        >
          <Box
            girdArea='main'
            justify='center'
            align='center'
            className='infomation'
          >
            <div className='textBox'>
              <div className='titleBox'>
                <h1>간단하고 빠르게</h1>
                <h1>블로그를 업그레이드 하세요.</h1>
              </div>
              <div className='contentBox'>
                <div className="part">
                  <p>AI가 블로그를 기획하고</p>
                  <p>글을 작성하는 과정을 돕습니다.</p>
                </div>

                <div className="part">
                  <p>아이디어, 개요, 제목, 도입부,</p>
                  <p>그리고 문장 이어쓰기까지.</p>
                </div>

                <div> 
                  <p>블로그를 더 빨리, 더 쉽게 쓸 수 있습니다.</p>
                </div>
              </div>
            </div>
          </Box>
          <Box
            girdArea='side'
            justify='center'
            align='center'
            className='information2'
          >
            <Link to='/idea'>
              <Button
                style={infoButtonStyle}
                label='체험해보기'
                className='infoButton'
              />
            </Link>
          </Box>
        </Grid>
      </Box>
    );
  }
}

export default Landing;

const infoButtonStyle = {
  backgroundColor: "#fff",
  color: "#3B2478",
  border: 0,
  fontSize:'20px'
};
