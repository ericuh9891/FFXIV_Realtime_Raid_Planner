import React from 'react'
import './Project1.css'
import reactLogo from './logo192.png'
import './Project1.css'

function Project1() {
  return (
    <div className='Project1-container'>
      <Navbar />
      <Main />
    </div>
    );
};

function Navbar() {
  return (
    <nav className='Project1-nav'>
      <div className='Project1-homepage-container'>
        <div className='Project1-homepage-icon-container'>
          <a href='http://localhost:3000/'>
            <img className='reactlogo' src={reactLogo}></img>
          </a>
          <h1 className='Project1-homepage-text'>ReactFacts</h1>
        </div>
      </div>
      <h1 style={{color:'white', padding: '0 20px 0 0'}}>React Course - Project1</h1>
    </nav>
  );
};

function Main() {
  return (
    <h1 className='Project1-main'>Main goes here</h1>
  );
};

export default Project1;