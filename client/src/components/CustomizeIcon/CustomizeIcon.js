import React from 'react';
import './CustomizeIcon.css';

/**
 * When customizing icons, this should receive a passed in function from props to edit the icon state in Arena.
 * The function that changes the icon state should have id and the changed data (a new icon state) as parameters.
 * 
 */

function CustomizeIcon(props) {
  return (
    <div 
      className='CustomizeIcon'
    >
      Icon Preview and Customization
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