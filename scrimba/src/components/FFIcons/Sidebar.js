import React, { Fragment } from 'react';
import {FFIconsPrototype, FFIconsDraggable} from './FFIcons.js'
import './Sidebar.css'

function Sidebar() {

  function renderIcons(num) {
    const elements = Array(num);
    for(let index = 0; index < elements.length; ++index) {
      elements[index] = 
      (
        <Fragment>
          <FFIconsPrototype
            key={index}
            id={`icon${index}`}
            value={`Icon${index}`}
          ></FFIconsPrototype>
          <FFIconsDraggable
            key={index}
            id={`icon${index}`}
            value={`Icon${index}`}
          ></FFIconsDraggable>
        </Fragment>
      );
    };
    return elements;
  };


  return (
    <div className='Sidebar'>
      {renderIcons(2)}
    </div>
  );
};

export default Sidebar;