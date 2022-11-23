import React from 'react';
import './CustomizeIcon.css';

function CustomizeIcon(props) {
  console.log(props);
  // find the icon in arenaState
  function findIcon() {
    console.log('Running findIcon()');
    let arenaState = props.arenaStates[props.selectedIcon.arena];
    let icon = null;
    for(let i = 0; i < arenaState.length; ++i){
      if(arenaState[i].id === props.selectedIcon.id){
        icon = arenaState[i];
        console.log('Clicked on icon:');
        console.log(icon);
        return icon;
      };
    };
    // icon should always be found, if not found means arenaStates or selectedIcon are not properly set
    console.error('Icon not found in CustomizeIcon\'s findIcon function');
  };

  const currentIcon = props.selectedIcon ? findIcon() : null; // makes sure there's an icon to find
  const labelRef = React.useRef();
  console.log(currentIcon);

  function onInputHandler(event) {
    currentIcon.label = labelRef.current.value;
    props.updateIcon(currentIcon);
  };

  return (
    <div 
      className='CustomizeIcon'
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
      {currentIcon !== null &&
        <img
          className='CustomizeIcon-Icon'
          alt='Current selected icon'
          src={currentIcon.imgSrc}
        >
        </img>
      }
    </div>
  );
};

export default CustomizeIcon;