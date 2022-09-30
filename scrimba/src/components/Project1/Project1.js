import React from 'react'
import './Project1.css'
import reactLogo from './logo192.png'
import './Project1.css'

function Project1() {
  return (
    <div className='Project1 component-container'>
      <Navbar />
      <Main />
    </div>
    );
};

function Navbar() {
  return (
    <nav className='Project1'>
        <a href='http://localhost:3000/' className='Project1 homepage-logo-link'>
          <img id='reactLogo' className='Project1' src={reactLogo}></img>
          <h1 id='homepage-logo-text' className='Project1'>ReactFacts</h1>
        </a>
      <h1>React Course - Project1</h1>
    </nav>
  );
};

function Main() {
  const reactFacts = [
    "Was first released in 2013",
    "Was originally created by Jordan Walke",
    "Has well over 100k stars on Github",
    "Is maintained by Facebook",
    "Powers thousands of enterprise apps, including mobile apps",
  ];
  
  function populateList(list) {
    let index = 0;
    let elementsList = list.map( (str) => <li key={index++}>{str}</li>);
    return (elementsList);
  };

  return (
    <div className='Project1 main-container'>
      <h1>Fun facts about React</h1>
      <ul>{populateList(reactFacts)}</ul>
    </div>
  );
};

export default Project1;