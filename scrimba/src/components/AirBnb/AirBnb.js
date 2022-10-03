import React from 'react';

import './AirBnb.css';
import data from './data.js'
import airbnbLogo from './airbnblogo.png'
import redStar from './redstar.png'
import catImage from './cat1.png'

class AirBnb extends React.Component {
  constructor(props) {
    super(props);
  };


  render() {
    //create the card components from data
    const cards = createCards();
    function createCards(){
      const cards = data.map(item => {
        return (
          <Card 
            key={item.id}
            item={item}
          />
        );
      })
      return cards
    };
    return (
      <div className='AirBnb'>
        <Nav />
        <Hero />
        <div className='AirBnb cards-container'>
          {cards}
        </div>
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

function Card(props) {
  let {coverImg: coverImg, rating: rating, 
    location: location, title: title, 
    price: price, openSpots: openSpots} = props.item;
  let badgeText = false;
  if(openSpots === 0) {
    badgeText = "SOLD OUT";
  } else if(location.toUpperCase() === "ONLINE") {
    badgeText = "ONLINE";
  }
  return (
    <div className='AirBnb Card'>
      <div className='Air Bnb Card image-container'>
        {badgeText && <span className='status'>{badgeText}</span>}
        {/* <img src={`./${coverImg}`} alt="Cat"></img> */}
        <img src={require(`./${coverImg}`)} alt="Cat"></img>
      </div>
      <p>
        <span className='rating-container'><img src={redStar}></img>{rating}•{location}</span>
      </p>
      <p className='description'>{title}</p>
      <span className='price-container'><p className='start-price'>From ${price}</p><p className='units'>/ person</p></span>
    </div>
  );
};

export default AirBnb;