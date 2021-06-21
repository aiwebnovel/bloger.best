import { Component, Fragment } from 'react';
import axios from 'axios';
import { Spinner } from "react-loading-io";
import * as config from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Main.css';

class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
      output: '',
      outputBeforeTlanslate: '',
      outputAfterTlanslate: '',
      loading: false,
      story: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
  }

  handleChange(e){
    if(e.target.value.length < 20 && e.target.name === 'Main_Events'){   
      this.setState({[e.target.name]: e.target.value});
    } else if(e.target.value.length < 10){
      this.setState({[e.target.name]: e.target.value});
    }else{
      toast.error(`🦄 ${e.target.value.length}글자를 넘어갈 수 없어요!`, {
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

  async requestcontents(e){
    let story = this.state.story;

    if (story == '') {
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

    this.setState({loading: true}); 
    axios.post(`${config.SERVER_URL}/blog`,
      { Story: story }, 
      { headers: { timeout: 100000 } })
    .then((response) => {
      console.log(response.data);
      this.setState({ outputAfterTlanslate: this.state.outputAfterTlanslate + response.data[0]});
      this.setState({ outputBeforeTlanslate: this.state.outputBeforeTlanslate + response.data[1]});
      this.setState({loading: false});
    }).catch((error) => {
      if (error.response.status === 412) {
        this.setState({loading: false});
        toast.error(`다시 시도해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    })
  }

  render() {
    return (
      <Fragment>
      <div class="mainpage">
        <div class="main">
          {this.state.loading ? <div class="loading"> <Spinner size='8px' color='#3b2479'/> </div> : null}
          <input class="sub_input_text" value={this.state.story} onChange={this.handleChange} name='story' placeholder="주제"></input>
          <button class="start" onClick = {this.requestcontents}>만들기</button>

          <div class="outputDiv">
            <textarea class="output" value={this.state.outputAfterTlanslate} onChange={this.handleStory} readOnly></textarea>
            <textarea class="output_right" value={this.state.outputBeforeTlanslate} readOnly></textarea>
          </div>
        </div>
      </div>

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
      </Fragment>
    );
  }
}

export default Main;
