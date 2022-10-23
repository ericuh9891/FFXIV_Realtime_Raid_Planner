import React from 'react';
import { FFIconsDraggable } from './FFIcons';
import './Arena.css';

function Arena() {
  const [icons, setIcons] = React.useState([]);

  function renderIcons() {
    return icons.map( (icon) => {
      if(icon === 'scholar') {
        return (
          <FFIconsDraggable id='sch'></FFIconsDraggable>
        );
      } else {
        return (
          <FFIconsDraggable id='drk'></FFIconsDraggable>
        );
      }
    });
  };

  function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  function dropHandler(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    setIcons( (prevIcons) => {
      const newItems =  prevIcons.map( (item) => item);
      newItems.push(data);
      return newItems; 
    })
    console.log("Drop event object");
    console.log(event);
  }

  return (
    <div className='Arena'
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      {renderIcons()}
    </div>
  );
};

export default Arena;