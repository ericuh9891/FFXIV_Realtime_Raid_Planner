import React from 'react';
import './MemeGenerator.css';
import memesData from './memeData.js';

class MemeGenerator extends React.Component {
  render() {
    return (
      <div className='MemeGenerator app-container'>
        <div className='MemeGenerator app'>
          <Header />
          <Meme />
        </div>
      </div>
    );
  }
}

function Header() {
  return (
    <header className='MemeGenerator Header'>
      <div  className='MemeGenerator Header homepage-logo-container'>
        <img className='MemeGenerator Header logo' src={require('./trollface.png')} alt="Troll Face"></img>
        <h1 className='MemeGenerator Header homepage'>Meme Generator</h1>
      </div>
      <h2 className='MemeGenerator Header project'>React Course - Project 3</h2>
    </header>
  );
};

function Meme() {
  const [allMemeImages, setAllMemeImages] = React.useState(memesData);
  const [meme, setMeme] = React.useState(
    {
      topText: "",
      bottomText: "",
      randomImage: getRandomMemeImage(),
    }
  );

  function getRandomMemeImage() {
    let url = allMemeImages.data.memes[Math.floor(Math.random() * allMemeImages.data.memes.length)].url;
    return url;
  }

  function handleOnClick() {
    setMeme( prevMeme => ({
      ...prevMeme,
      randomImage: getRandomMemeImage()
    }));
  };

  return (
    <main className='MemeGenerator Meme main'>
      <div className='MemeGenerator Meme form'>
        <div className='MemeGenerator Meme input-container'>
          <input id='top-caption-input' className='MemeGenerator Meme input' 
            type='text' placeholder='Top text'></input>
          <input id='bottom-caption-input' className='MemeGenerator Meme input'
            type='text' placeholder='Bottom text'></input>
        </div>
        <button className='MemeGenerator Meme button'type='button' 
          onClick={handleOnClick}>
          Get a new meme image
          <img className='MemeGenerator Meme button-img'
            src={require('./photoIcon.png')}></img>
        </button>
      </div>
      <img className='MemeGenerator Meme meme-image'
        src={meme.randomImage}></img>
    </main>
  );
};

export default MemeGenerator;