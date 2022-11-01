import React from 'react';
import './IconList.css';

function IconList(props) {

  function onDragStartHandler(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  function renderIconList() {
    return props.iconsList.map( (iconObj, index) => {
      return (
        <div 
          className='IconList-selection'
          key={index}
          draggable='true' onDragStart={onDragStartHandler}>
          <img 
            className='IconList-image' 
            src={iconObj.image}
            alt={iconObj.name} 
            id={iconObj.name}></img>
        </div>
      )
    });
  };

  return (
    <div className='IconList'>
      {renderIconList()}
    </div>
  );
}

export default IconList;