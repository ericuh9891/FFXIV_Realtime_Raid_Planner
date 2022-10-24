import React from 'react';
import './Arena.css';


function Arena (props) {

  const [icons, setIcons] = React.useState([]);

  function onDragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  function onDropHandler(event) {
    event.preventDefault();
    const index = event.dataTransfer.getData('text/plain');

    setIcons( (prevIcons) => {
      const element = (
        <div className='IconList-selection'
          key={index}>
          <img className='IconList-image' src={props.iconList[index]} id={index}></img>
        </div>
      );
      return [...prevIcons, element];
    })
  };

  return (
    <div className='Arena' onDragOver={onDragOverHandler} onDrop={onDropHandler}>
      {icons}
    </div>
  );
};

export default Arena;