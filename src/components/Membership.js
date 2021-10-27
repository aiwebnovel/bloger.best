import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CreditCardInput from "react-credit-card-input";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Membership.css";
import Modal from "./Modal";
import * as config from "../config";

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      plan: "free",
      free: "currunt",
      basic: "결제하기",
      premium: "change",
      cardNum: "",
      buyerName: "",
      idNum: "",
      cardExpire: "",
      cardCvc: "",
      cardPwd: "",
      Price: "",
    };
    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestBill = this.requestBill.bind(this);
    this.changeBill = this.changeBill.bind(this);
    this.requestProfile = this.requestProfile.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleNumber(e) {
    if (isNaN(e.target.value) === false) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  openModal = (e) => {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser
          .getIdToken()
          .then(async (data) => {
            await localStorage.setItem("token", data);
            console.log(e.target.name.split(" ")[0]);
            console.log(e.target.name.split(" ")[1]);
            this.setState({ plan: e.target.name.split(" ")[0] });
            this.setState({ Price: e.target.name.split(" ")[1] });
            this.setState({ showMenu: true });
          })
          .catch(async (error) => {
            toast.error(`로그인이 필요합니다.`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } else {
        toast.error(`로그인이 필요합니다.`, {
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
  };

  openModalPay = (e) => {
    this.setState({ showMenu: true });
  };

  closeModal = () => {
    this.setState({ showMenu: false });
  };

  async requestBill() {
    let user = await localStorage.getItem("token");
    if (user !== undefined) {
      const now = new Date();
      const option = {
        arsUseYn: "N",
        buyerName: this.state.buyerName, //등록자 이름
        cardExpire:
          this.state.cardExpire.split(" / ")[1] +
          this.state.cardExpire.split(" / ")[0], //유효기간
        cardNum: this.state.cardNum.replaceAll(" ", ""), //카드번호 (숫자)
        cardPwd: this.state.cardPwd, //카드 비밀번호 앞 2 자리
        idNum: this.state.idNum, //주민번호 앞 6 자리
        mid: "pgapppla1m", //상점 아이디
        moid:
          now.getFullYear() +
          "" +
          (now.getMonth() + 1) +
          now.getDate() +
          now.getHours() +
          now.getMinutes() +
          now.getSeconds(), //가맹점 주문번호
        userId: (await localStorage.getItem("userUid")) + Math.random(),
      };
      console.log(option);
      axios
        .post(`https://api.innopay.co.kr/api/regAutoCardBill`, option)
        .then((response) => {
          console.log(response.data);
          if (response.data.resultCode === "0000") {
            axios
              .post(
                `${config.SERVER_URL}/pay/blog`,
                {
                  billKey: response.data.billKey,
                  plan: this.state.plan,
                  name: this.state.buyerName,
                },
                { headers: { authentication: user } }
              )
              .then((response) => {
                console.log(response);
                this.closeModal();
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            throw new Error();
          }
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
          this.closeModal();
        });
    }
  }

  async changeBill() {
    let user = await localStorage.getItem("token");
    if (user !== undefined) {
      axios
        .put(
          `${config.SERVER_URL}/pay/blog`,
          {
            plan: this.state.plan,
          },
          { headers: { authentication: user } }
        )
        .then((response) => {
          console.log(response);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem("token");

    if (user !== undefined) {
      axios
        .get(`${config.SERVER_URL}/profile`, {
          headers: { authentication: user },
        })
        .then((response) => {
          localStorage.setItem("userUid", response.data.uid);
          localStorage.setItem("plan", response.data.plan);
          this.closeModal();
        })
        .catch((error) => {});
    }
  }

  async componentDidMount() {
    await this.requestProfile();
    this.setState({ free: "change" });
    this.setState({ [localStorage.getItem("plan")]: "currunt" });
  }

  render() {
    return (
      <div class="pricingDiv">
        <div class="pricing">
          <h3 class="priceTitle">Free</h3>
          <div class="priceDiv">
            <span class="price1">₩</span>
            <span class="price2">0</span>
            <span class="price3">/mo</span>
          </div>
          <a className="pricebutton" onClick={this.openModal} name="free 0">
            {this.state.free}
          </a>
          <p>✔ 무제한 사용</p>
          <p>
            ✔ 블로그 아이디어, 개요, 제목, 도입부,
            <br /> 이어쓰기
          </p>
          <p>✔ 인공지능 결과 저장</p>
          <p>✔ 지속적인 업데이트: 인공지능 품질 향상</p>
        </div>

        <div class="pricing">
          <h3 class="priceTitle">annual</h3>
          <div class="priceDiv">
            <span class="price1">₩</span>
            <span class="price2">45,000</span>
            <span class="price3">/mo</span>
            <br />
          </div>

          <a class="pricebutton" onClick={this.openModal} name="basic 45000">
            {this.state.basic}
          </a>
          <p>✔ 무제한 사용</p>
          <p>
            ✔ 블로그 아이디어, 개요, 제목, 도입부,
            <br /> 이어쓰기
          </p>
          <p>✔ 인공지능 결과 저장</p>
          <p>✔ 지속적인 업데이트: 인공지능 품질 향상</p>
        </div>

        <div class="pricing">
          <h3 class="priceTitle">enterprise</h3>
          <div class="priceDiv">
            <span class="price2">Custom</span>
          </div>
          <a href="mailto:support@appplatform.co.kr" class="pricebutton">
            문의하기
          </a>
          <p>✔ 무제한 사용</p>
          <p>
            ✔ 블로그 아이디어, 개요, 제목, 도입부,
            <br /> 이어쓰기
          </p>
          <p>✔ 인공지능 결과 저장</p>
          <p>✔ 지속적인 업데이트: 인공지능 품질 향상</p>
          <p>✔ 기업 맞춤형 플랜 제공</p>
        </div>

        <Modal open={this.state.showMenu} close={this.closeModal} title="Price">
          {localStorage.getItem("isBill") !== "true" && this.state.Price > 0 ? (
            <div class="creditCard">
              <CreditCardInput
                cardNumberInputProps={{
                  value: this.state.cardNum,
                  onChange: this.handleChange,
                  name: "cardNum",
                }}
                cardExpiryInputProps={{
                  value: this.state.cardExpire,
                  onChange: this.handleChange,
                  name: "cardExpire",
                }}
                cardCVCInputProps={{
                  value: this.state.cardCvc,
                  onChange: this.handleChange,
                  name: "cardCvc",
                }}
                fieldClassName="input"
              />
              <div class="creditCardDiv">
                <span>비밀번호</span>
                <input
                  class="creditCardPwd"
                  value={this.state.cardPwd}
                  onChange={this.handleNumber}
                  name="cardPwd"
                  maxLength="2"
                ></input>
                <span>**</span>
              </div>
              <div class="creditCardDiv">
                <span>주민번호</span>
                <input
                  class="creditCardPwd"
                  value={this.state.idNum}
                  onChange={this.handleNumber}
                  name="idNum"
                  maxLength="6"
                ></input>
                <span>-*******</span>
              </div>
              <div class="creditCardDiv">
                <span>이름</span>
                <input
                  class="creditCardPwd"
                  value={this.state.buyerName}
                  onChange={this.handleChange}
                  name="buyerName"
                  maxLength="4"
                ></input>
              </div>

              <a class="creditCardButton" onClick={this.requestBill}>
                {this.state.Price}원 결제하기
              </a>
            </div>
          ) : (
            <div class="creditCard">
              <a class="changeButton" onClick={this.changeBill}>
                플랜 바꾸기
              </a>
            </div>
          )}
        </Modal>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default Membership;
