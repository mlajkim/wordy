import React, {Fragment} from 'react';
import './Home.css';
import Button from '@material-ui/core/Button';
// imgs
import Background from '../img/home_background.jpeg';

const Home = () => {
  return (
    <Fragment>
      <div style={{
        backgroundImage: `url(${Background})`,
        marginTop: 10,
        height: 650,
        width: "100%",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}>
        <div className="center" style={{paddingTop: '10%'}}>
          <h1 className="center title">지금, 당신의 Multilingual Journey가 시작됩니다</h1>
          <p>
            Multilingual, Wordy와 함께라면 어렵지 않습니다. 
          </p> 
          <p>
            다양한 나라의 사람들과 그들의 언어로 자유롭게 소통하는 것.
          </p>
          <p>
            저희 Wordy는 당신의 그 꿈을 가장 빠르고 쉽게 이룰 수 있도록 돕고 있습니다. 
          </p>
          <p>
            최첨단 AI를 겸비한 Wordy를 지금 무료로 이용해보세요.
          </p>
          <Button variant="outlined" color="primary">지금 무료로 가입하기</Button>
          <p style={{fontSize: 11}}>이미 계정이 있으시다면 <span style={{textDecoration: "underline", margin: 1, cursor: "pointer"}}>여기로</span> 로그인 해주세요</p>
        </div>
      </div>
      <footer style={{display: "table", fontSize: 12, position: "fixed", float: "right"}}>
        <ul>한국어</ul>
        <ul>English (US)</ul>
        <ul>日本語</ul>
        <ul>中文(简体)</ul>
      </footer>
    </Fragment>
    
  )
};

export default Home;