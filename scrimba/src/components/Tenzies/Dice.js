import React from 'react';
import './Dice.css'

function Dice(props) {
  function handleOnClick() {
    props.lockDice(props.id);
  };
  return (
    <div className={'Dice'.concat(props.isLocked ? ' locked' : ' unlocked')}
      onClick={handleOnClick}
    >
      {props.value}
    </div>
  );
};

export default Dice;