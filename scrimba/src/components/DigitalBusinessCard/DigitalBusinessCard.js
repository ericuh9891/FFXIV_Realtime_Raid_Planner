import React from 'react';

import './DigitalBusinessCard.css';
import headshotAvatar from './headshotavatar.jpg';
import emailIcon from './emailicon.png';
import linkedinIcon from './linkedinicon.png';

//Leftoff: style the buttons

class DigitalBusinessCard extends React.Component {
  constructor(props){
    super(props);
  };
  render() {
    return (
      <div className='DigitalBusinessCard digitalBusinessCard-container'>
        <div className='DigitalBusinessCard card'>
          <img src={headshotAvatar} alt="Software Engineer headshot avatar"></img>
          <Info />
        </div>
      </div>
    );
  }
};

function Info () {
  return (
    <div className='DigitalBusinessCard Info info-container'>
      <h1>EricY UHuang</h1>
      <h2>Software Engineer</h2>
      <h3>Eric's website</h3>
      <div className='DigitalBusinessCard Info button-container'>
        <InfoButton image={emailIcon} text="Email" backgroundColor='white'/>
        <InfoButton image={linkedinIcon} text="LinkedIn" backgroundColor='blue'/>
      </div>
    </div>
  );
};

class InfoButton extends React.Component {
  constructor(props){
    super(props);
    this.image = props.image;
    this.text = props.text;
    this.backgroundColor = props.backgroundColor;
  };

  render(){
    return (
      <a className='InfoButton' href='http://localhost:3000/' style={{backgroundColor: this.backgroundColor}}>
        <img src={this.image}></img>
        <h1>{this.text}</h1>
      </a>
    );
  };
};

export default DigitalBusinessCard;