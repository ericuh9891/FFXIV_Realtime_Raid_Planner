import React from 'react';

import './DigitalBusinessCard.css';
import headshotAvatar from './headshotavatar.jpg';
import emailIcon from './emailicon.png';
import linkedinIcon from './linkedinicon.png';

const about = {
  header: `About`,
  paragraph: `I'm a computer science major at Brooklyn College in New York City. I will graduate in 2022 
  after the completion of the Fall 2022 semester. I have experience with Javascript and Python. I have some 
  experience with Java, C++, and C.`,
}

const interest = {
  header: `Interest`,
  paragraph: `My hobbies include gaming, hobby programming for gaming and day trading. I like watching
  anime and learning about computer hardware.`
}

class DigitalBusinessCard extends React.Component {
  constructor(props){
    super(props);
  };
  render() {
    return (
      <div className='DigitalBusinessCard digitalBusinessCard-container'>
        <div className='DigitalBusinessCard card'>
          <Info />
          <Description header={about.header} paragraph={about.paragraph}/>
          <Description header={interest.header} paragraph={interest.paragraph}/>
        </div>
      </div>
    );
  }
};

function Info () {
  return (
    <div className='DigitalBusinessCard Info info-container'>
      <img src={headshotAvatar} alt="Software Engineer headshot avatar"></img>
      <h1>EricY UHuang</h1>
      <h2>Software Engineer</h2>
      <h3>Eric's website</h3>
      <div className='DigitalBusinessCard Info button-container'>
        <InfoButton image={emailIcon} text="Email" textColor='black' backgroundColor='white'/>
        <InfoButton image={linkedinIcon} text="Linkedin" textColor='white' backgroundColor='#4687DC'/>
      </div>
    </div>
  );
};

class InfoButton extends React.Component {
  constructor(props){
    super(props);
  };

  render(){
    return (
      <a className='InfoButton' href='http://localhost:3000/' style={{backgroundColor: this.props.backgroundColor}}>
        <img src={this.props.image}></img>
        <p style={{color: this.props.textColor}}>{this.props.text}</p>
      </a>
    );
  };
};

class Description extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className='DigitalBusinessCard Description description-container'>
        <h1>{this.props.header}</h1>
        <p>{this.props.paragraph}</p>
      </div>
    );
  }
}

export default DigitalBusinessCard;