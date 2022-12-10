import React from 'react';
import './CustomizeIcon.css';

import trashIcon from './trashIcon.png'

function CustomizeIcon(props) {
  // find the icon in arenaState
  function findIcon() {
    let arenaState = props.arenaStates[props.selectedIcon.arena];
    let icon = null;
    for(let i = 0; i < arenaState.length; ++i){
      if(arenaState[i].id === props.selectedIcon.id){
        icon = arenaState[i];
        return icon;
      };
    };
    // icon should always be found, if not found means arenaStates or selectedIcon are not properly set
    console.error('Icon not found in CustomizeIcon\'s findIcon function');
  };

  const currentIcon = props.selectedIcon ? findIcon() : null; // makes sure there's an icon to find
  const labelRef = React.useRef();

  function onInputHandler(event) {
    currentIcon.label = labelRef.current.value;
    props.updateIcon(currentIcon);
  };

  function getSaves() {
    let saves = [];
    // get the name of the keys
    for(let i = 0; i < localStorage.length; ++i) {
      saves.push(localStorage.key(i));
    }
    saves.sort().reverse();
    // convert the name of keys into JSX elements
    return saves.map( (key) => {
      return (
        <div
          className='Arena-Saves'
          id={key}
          key={key}
          onClick={(event) => props.onLoadSaveHandler(event)}
        >
          {key != 'Auto Save' &&
            <img
            id={key}
            key={key}
            className='Arena-Saves-Trashbin'
            src={trashIcon}
            alt='Delete Save'
            onClick={onDeleteSaveHandler}
            >
            </img>
          }
          {key}
        </div>
      );
    });
  };

  function onDeleteSaveHandler(event) {
    localStorage.removeItem(event.target.id);
  };

  return (
    <div 
      className='CustomizeIcon'
      draggable='false'
    >
      {currentIcon !== null &&
        <input
          type='text'
          placeholder='Label'
          ref={labelRef}
          onInput={onInputHandler}
          value={currentIcon && currentIcon.label} // checks if a label value exists
        >
        </input>
      }
      {currentIcon !== null &&
        <img
          className='CustomizeIcon-Icon'
          alt='Current selected icon'
          src={currentIcon.imgSrc}
          draggable='false'
        >
        </img>
      }
      {props.loadState &&
      currentIcon == null &&
        <div
          className='CustomizeIcon-Saves'
          draggable='false'
        >
          {getSaves()}
        </div>
      }
    </div>
  );
};

export default CustomizeIcon;