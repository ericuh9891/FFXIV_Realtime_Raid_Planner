import React from 'react';
import './Arena.css';
import Draggable from 'react-draggable';


function Arena (props) {
  const [icons, setIcons] = React.useState([]);
  const arenaRef = React.useRef();

  function onDragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  function onDragHandler(event, data) {
    console.log(data);
  }; 

  function onDropHandler(event) {
    event.preventDefault();
    console.log(event);
    console.log(arenaRef.current.getBoundingClientRect());
    const index = event.dataTransfer.getData('text/plain');
    if (index == null){
      return;
    }
    else {
      setIcons( (prevIcons) => {
        const element = (
          <Draggable
            onDrag={onDragHandler}
            defaultPosition={{x: 0, y: 0}}
            bounds='parent'
            >
            <img 
              className='Arena-Icon' 
              src={props.iconList[index]} 
              draggable='false' 
              style={{
                top: `${event.clientY-30}px`,
                left: `${event.clientX - arenaRef.current.getBoundingClientRect().x -30}px`
              }}
            >
            </img>
          </Draggable>
        );
        return [...prevIcons, element];
      });
    }
  };

  return (
    <div 
      className='Arena' 
      ref={arenaRef} 
      onDragOver={onDragOverHandler} 
      onDrop={onDropHandler}
    >
      {icons}
    </div>
  );
};

export default Arena;