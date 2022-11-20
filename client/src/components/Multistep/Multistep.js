import React from 'react';
import './Multistep.css';

import trashIcon from './trashIcon.png'

function Multistep(props) {

  function selectStep(event) {
    // sets the currentArena by the clicked HTML element ID which maps to the 0 based index of arenaStates
    props.setCurrentArena( () => Number(event.target.id));
  }

  function renderSteps() {
    let steps = props.arenaStates.map( (arena, index) => {
      return (
        <div
          className={'Multistep-step' + (props.currentArena === index ? ' selected' : ' unselected')}
          id={index}
          key={index}
          onClick={selectStep}
        >
          {index+1}
        </div>
      );
    });
    // add the + and delete at the end
    steps.push(
      (
        <div
          className='Multistep-step unselected'
          id={'addStep'}
          key={'addStep'}
          onClick={(event) => props.multistepAddArenaState(event)}
        >
          +
        </div>
      ),
      (
        <img
          className='Multistep-step unselected'
          id={'deleteStep'}
          key={'deleteStep'}
          alt='Trashbin Icon'
          src={trashIcon}
          onClick={(event) => props.multistepDeleteArenaState(event)}
        >
        </img>
      )
    );
    return steps;
  };
  return (
    <div
      className='Multistep'
    >
      {renderSteps()}
    </div>
  );
};

export default Multistep;