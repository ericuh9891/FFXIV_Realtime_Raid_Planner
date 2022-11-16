import React from 'react';
import './CustomizeIcon.css';

function CustomizeIcon(props) {
  // find the icon in arenaState
  function findIcon() {
    let arenaState = props.arenaStates[props.selectedIcon.arena];
    let icon = null;
    for(let i = 0; i < arenaState.length; ++i){
      if(arenaState[i].id === props.selectedIcon.id){
        icon = arenaState[i];
        console.log('Icon found in CustomizeIcon\'s findIcon function');
        return icon;
      };
    };
    console.log('Icon not found in CustomizeIcon\'s findIcon function');
  };

  const currentIcon = props.selectedIcon ? findIcon() : null; // makes sure there's an icon to find
  const labelRef = React.useRef();

  function onInputHandler(event) {
    currentIcon.label = labelRef.current.value;
    props.updateIcon(currentIcon);
  }

  return (
    <div 
      className='CustomizeIcon'
      onDragOver={null}
      onDrop={null}
      draggable='false'
    >
      Icon Preview and Customization
      <input
        type='text'
        placeholder='Label'
        ref={labelRef}
        onInput={onInputHandler}
        value={currentIcon && currentIcon.label} // checks if a label value exists
      >
      </input>
      {currentIcon != undefined &&
        <img
          className='CustomizeIcon-Icon'
          src={currentIcon.imgSrc}
        >
        </img>
      }
    </div>
  );
};

export default CustomizeIcon;