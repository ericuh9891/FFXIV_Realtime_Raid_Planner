import React from 'react';

import './AirBnb.css';
import airbnbLogo from './airbnblogo.png'
import catImage from './cat.png'
import redStar from './redstar.png'

class AirBnb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='AirBnb'>
        <Nav />
        <Hero />
        <Card />
      </div>
    );
  }
};

function Nav() {
  return (
    <nav className='AirBnb Nav'>
      <a rel='link' href='http://localhost:3000/'>
        <img src={airbnbLogo}></img>
      </a>
    </nav>
  );
}

function Hero() {
  return (
    <div className='AirBnb Hero hero-container'>
      <div className='Hero images-container'>
        <div id='column1' className='Hero vertical-images-container'>
          <div id='image1' className='Hero standin-image'></div>
        </div>
        <div id='column2' className='Hero vertical-images-container'>
          <div id='image2' className='Hero standin-image'></div>
          <div id='image3' className='Hero standin-image'></div>
        </div>
        <div id='column3' className='Hero vertical-images-container'>
          <div id='image4' className='Hero standin-image'></div>
          <div id='image5' className='Hero standin-image'></div>
        </div>
        <div id='column4' className='Hero vertical-images-container'>
          <div id='image6' className='Hero standin-image'></div>
          <div id='image7' className='Hero standin-image'></div>
        </div>
        <div id='column5' className='Hero vertical-images-container'>
          <div id='image8' className='Hero standin-image'></div>
          <div id='image9' className='Hero standin-image'></div>
        </div>
      </div>
      <h1 className='AirBnb Hero'>Online Experiences</h1>
      <p className='AirBnb Hero'>Join unique interactive activities led by one-of-a-kind hosts--all without leaving home.</p>
    </div>
  )
}

function Card() {
  const rating = '5.0 (6)*USA'
  return (
    <div className='AirBnb Card'>
      <div className='Air Bnb Card image-container'>
        <span className='status'>SOLD OUT</span>
        <img src={catImage} alt="Orange cat"></img>
      </div>
      <p>
        <span className='rating-container'><img src={redStar}></img>{rating}</span>
      </p>
      <p className='description'>Life Lessons with Katie Zaferes</p>
      <span className='price-container'><p className='start-price'>From $138</p><p className='units'>/ person</p></span>
    </div>
  );
};

export default AirBnb;