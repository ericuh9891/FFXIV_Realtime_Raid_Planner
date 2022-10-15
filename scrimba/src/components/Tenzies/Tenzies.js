import React from 'react'
import Dice from './Dice.js'
import './Tenzies.css'

function Tenzies() {
  /*** Component states ***/
  const [dices, setDices] = React.useState(defaultDices);
  const diceElements = renderDices();

  /*** Setup functions ***/
  function defaultDices() {
    const dices = Array(10);
    for(let index = 0; index < dices.length; index++){
      dices[index] = 
      {
        id: index,
        value: getRandomValue(),
        isLocked: false,
      };
    };
    return dices;
  };

  function renderDices() {
    return dices.map( (dice) => (
      <Dice
        key={dice.id}
        id={dice.id}
        value={dice.value}
        lockDice={lockDice}
        isLocked={dice.isLocked}
      >
      </Dice>
    ));
  };
  
  /*** Helper functions ***/ 
  function getRandomValue() {
    // gets a random number from 1 to 6
    return Math.ceil(Math.random() * 6);
  };

  function lockDice(id) {
    setDices( prevDices => prevDices.map( dice => {
        return dice.id === id ? {...dice, isLocked: !dice.isLocked} : {...dice};
      })
    );
  };
  
  function checkForWin() {
    const candidateNumber = dices[0].value;
    const won = dices.every( (dice) => {
      return candidateNumber === dice.value && dice.isLocked;
    });
    return won;
  };
  
  /*** onClick Handlers ***/
  function rerollDices() {
    setDices( prevDices => prevDices.map( dice => {
        return dice.isLocked ? {...dice} : {...dice, value: getRandomValue()}
      })
    );
  };

  function resetGame() {
    setDices( () => defaultDices());
  };

  /*** Button elements ***/
  const rerollButton = (
    <div className='Tenzies roll'
      onClick={rerollDices}
    >Roll</div>
  );
  const resetGameButton = (
    <div className='Tenzies roll'
      onClick={resetGame}
    >Reset Game</div>
  );

  /*** Component Markup ***/
  return (
    <div className='Tenzies tenzies-container'>
      <div className='Tenzies game-board'>
        <h1>Tenzies</h1>
        <p>{`Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.`}
        </p>
        <div className='Tenzies dice-container'>
          {diceElements}          
        </div>
        {checkForWin() ? resetGameButton : rerollButton}
      </div>
    </div>
  );
};

export default Tenzies;