import React from 'react';

import './AirBnb.css';
import airbnbLogo from './airbnblogo.png'

class AirBnb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='AirBnb'>
        <Nav />
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

export default AirBnb;