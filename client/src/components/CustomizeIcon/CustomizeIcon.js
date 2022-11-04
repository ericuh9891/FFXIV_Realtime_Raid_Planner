import React from 'react';
import './CustomizeIcon.css';

/**
 * When customizing icons, this should receive a passed in function from props to edit the icon state in Arena.
 * The function that changes the icon state should have id and the changed data (a new icon state) as parameters.
 * 
 */

function CustomizeIcon(props) {
  const currentIcon = props.selectedIcon;
  const labelRef = React.useRef();

  function onInputHandler(event) {
    currentIcon.label = labelRef.current.value;
    props.updateIcon(currentIcon);
  }

  return (
    <div 
      className='CustomizeIcon'
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
      {props.selectedIcon != undefined &&
        <img
          className='CustomizeIcon-Icon'
          src={props.selectedIcon.imgSrc}
        >
        </img>
      }
    </div>
  );
};

export default CustomizeIcon;