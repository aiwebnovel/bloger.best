import { Component } from "react";
import "../style/Footer.css";

class Footer extends Component {
  render() {
    return (
      <footer>
        <p class="info">
          <a href="mailto:support@appplatform.co.kr" class="email">
            support@appplatform.co.kr{" "}
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="https://appplatform.notion.site/e658644587444247a00af2d05dd69b30"
            class="email"
          >
            {" "}
            개인정보 처리방침
          </a>
          <br />
          <a
            href="https://appplatform.notion.site/e658644587444247a00af2d05dd69b30"
            class="email"
          >
            {" "}
            이용약관{" "}
          </a>
          <br />
          Address: #301 BS B/D banpodaero 28gil ,Seocho-gu, Seoul, Korea
          <br />
          ㈜Appplatform 115-87-01388 대표 김춘남 115-87-01388 02-6959-4330
          <br />
          ©Appplatform, Inc All Rights Reserved
        </p>
      </footer>
    );
  }
}

export default Footer;
