import React from 'react';
import './MemeGenerator.css'

class MemeGenerator extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div className='MemeGenerator app-container'>
        <div className='MemeGenerator app'>
          <Header />
        </div>
      </div>
    );
  }
}

function Header() {
  return (
    <header className='MemeGenerator Header'>
      <div  className='MemeGenerator Header homepage-logo-container'>
        <img className='MemeGenerator Header logo' src={require('./trollface.png')}></img>
        <h1 className='MemeGenerator Header homepage'>Meme Generator</h1>
      </div>
      <h2 className='MemeGenerator Header project'>React Course - Project 3</h2>
    </header>
  );
}

export default MemeGenerator;