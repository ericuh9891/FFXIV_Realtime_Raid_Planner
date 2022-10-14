import React from 'react';
import './MemeGenerator.css';
// import memesData from './memeData.js';

function MemeGenerator() {
  return (
    <div className='MemeGenerator app-container'>
      <div className='MemeGenerator app'>
        <Header />
        <Meme />
      </div>
    </div>
  );
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
  const [allMeme, setAllMeme] = React.useState({});
  const [meme, setMeme] = React.useState(
    {
      topText: "Top Text",
      bottomText: "Bottom Text",
      randomImage: "http://i.imgflip.com/1bij.jpg",
    }
  );

  React.useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
    .then((res) => res.json())
    .then((data) => setAllMeme(data));
  }, [])
  

  function getRandomMemeImage() {
    return allMeme.data.memes[Math.floor(Math.random() * allMeme.data.memes.length)].url;
  }

  function handleOnClick() {
    setMeme( prevMeme => ({
      ...prevMeme,
      randomImage: getRandomMemeImage()
    }));
  };

  function handleChange(event) {
    const {name, value} = event.target;
    setMeme( (prevMeme) => {
      return {
        ...prevMeme,
        [name]: value,
      }
    })
  }

  return (
    <main className='MemeGenerator Meme main'>
      <div className='MemeGenerator Meme form'>
        <div className='MemeGenerator Meme input-container'>
          <input
            id='top-caption-input' 
            className='MemeGenerator Meme input' 
            type='text'
            placeholder='Top text'
            name="topText"
            value={meme.topText}
            onChange={handleChange}
          />
          <input
            id='bottom-caption-input' 
            className='MemeGenerator Meme input'
            type='text' 
            placeholder='Bottom text'
            name="bottomText"
            value={meme.bottomText}
            onChange={handleChange}
          />
        </div>
        <button className='MemeGenerator Meme button'type='button' 
          onClick={handleOnClick}>
          Get a new meme image
          <img className='MemeGenerator Meme button-img'
            alt="Mini"
            src={require('./photoIcon.png')}>
          </img>
        </button>
      </div>
      <div className='MemeGenerator Meme meme-image-container'>
        <img className='MemeGenerator Meme meme-image'
          alt="Meme"
          src={meme.randomImage}>
        </img>
        <p className='MemeGenerator Meme meme-top-text'
          name='topText'>
          {meme.topText}
        </p>
        <p className='MemeGenerator Meme meme-bottom-text'
          name='bottomText'>
          {meme.bottomText}
        </p>
      </div>
    </main>
  );
};

export default MemeGenerator;