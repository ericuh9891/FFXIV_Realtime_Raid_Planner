import React from 'react';
import './CustomizeIcon.css';

function CustomizeIcon(props) {
  let selectedIcon = null;
  for(let i = 0; i < props.icons.length; i++) {
    if (props.icons[i].elementId === props.selectedIcon) {
      selectedIcon = props.icons[i].imgElement;
      break;
    };
  };
  /** Checking selectedIcon's props */
  // if (selectedIcon){
  //   console.log(selectedIcon);
  // } else {
  //   console.log("selectedIcon is null");
  // }
  return (
    <div 
      className='CustomizeIcon'
    >
      Icon Preview and Customization
      {selectedIcon}
    </div>
  );
};

export default CustomizeIcon;