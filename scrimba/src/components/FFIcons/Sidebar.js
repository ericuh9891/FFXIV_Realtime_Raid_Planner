import React, { Fragment } from 'react';
// import {FFIconsPrototype, FFIconsDraggable} from './FFIcons.js'
import './Sidebar.css';

// Icon images imports
import scholarIcon from './Scholar_Icon.png';
import darkKnightIcon from './Dark_Knight_Icon.png';

function Sidebar() {

  // function renderIcons(num) {
  //   const elements = Array(num);
  //   for(let index = 0; index < elements.length; ++index) {
  //     elements[index] = 
  //     (
  //       <Fragment>
  //         <FFIconsPrototype
  //           key={index}
  //           id={`icon${index}`}
  //           value={`Icon${index}`}
  //         ></FFIconsPrototype>
  //         <FFIconsDraggable
  //           key={index}
  //           id={`icon${index}`}
  //           value={`Icon${index}`}
  //         ></FFIconsDraggable>
  //       </Fragment>
  //     );
  //   };
  //   return elements;
  // };

  function dragStartHandler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  };

  return (
    <div className='Sidebar'>
      <img src={scholarIcon} 
        draggable='true'
        id='scholar'
        onDragStart={dragStartHandler}
      ></img>
      <img src={darkKnightIcon}
        draggable='true'
        id='darkknight'
        onDragStart={dragStartHandler}
      ></img>
    </div>
  );
};

export default Sidebar;