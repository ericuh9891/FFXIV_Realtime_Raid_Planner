import React from 'react';
import './IconList.css';

function IconList(props) {

  function onDragStartHandler(event) {
    console.log(event.target);
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  function renderIconList() {
    return props.iconList.map( (icon, index) => {
      return (
        <div className='IconList-selection'
          key={index}
          draggable='true' onDragStart={onDragStartHandler}>
          <img className='IconList-image' src={icon} id={index}></img>
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