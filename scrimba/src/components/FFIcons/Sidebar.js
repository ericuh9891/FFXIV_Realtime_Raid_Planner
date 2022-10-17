import React from 'react';
import FFIcons from './FFIcons.js'
import './Sidebar.css'

function Sidebar() {

  function renderIcons(num) {
    const elements = Array(num);
    for(let index = 0; index < elements.length; ++index) {
      elements[index] = 
      (
        <FFIcons
          key={index}
          id={`icon${index}`}
          value={`Icon${index}`}
        ></FFIcons>
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