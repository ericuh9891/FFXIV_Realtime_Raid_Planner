import React from 'react';
import './Arena.css';
import CustomizeIcon from '../CustomizeIcon/CustomizeIcon.js';
import Draggable from 'react-draggable';

let id = 0;

function getUniqueId() {
  return id++;
}

function Arena (props) {
  const [icons, setIcons] = React.useState([]);
  const [selectedIcon, setSelectedIcon] = React.useState(0);
  const arenaRef = React.useRef();

  // needed to override browser default behaviours
  function onDragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  // onMouseDown on an icon, should update the selectedIcon so CustomizeIcon is also rerendered
  function onMouseDownHandler(event) {
    console.log(event);
    console.log(event.target.id);
    setSelectedIcon( () => Number(event.target.id))
  }

  // spawns an icon when user drops an icon from the IconList component and releases in the Arena component area
  function onDropHandler(event) {
    event.preventDefault();
    // gets the name of the icon
    const name = event.dataTransfer.getData('text/plain');
    // if it's empty then exit function, should probably console.log indicating it found nothing
    if (name == null){
      console.log("No name data in drop event");
      return;
    }
    else {
      // find the image associated with the name data from iconList
      let image = null;
      for(let i = 0; i < props.iconsList.length; i++){
        if (props.iconsList[i].name === name){
          image = props.iconsList[i].image;
        }
      }
      // create the icon and adds it to the Arena icon
      const elementId = getUniqueId();
      setIcons( (prevIcons) => {
        const element = (
          <Draggable
            onDrag={onDragHandler}
            defaultPosition={{x: 0, y: 0}}
            bounds='parent'
            onMouseDown={onMouseDownHandler}
            key={elementId}
            >
            <img 
              className='Arena-Icon' 
              src={image}
              alt={name}
              elementId={elementId}
              id={elementId}
              draggable='false' 
              style={{
                top: `${event.clientY-30}px`,
                left: `${event.clientX - arenaRef.current.getBoundingClientRect().x -30}px`
              }}
              >
            </img>
          </Draggable>
        );
        const icon = {
          elementId: elementId,
          JSXElement: element,
        }

        setSelectedIcon( () => elementId);
        return [...prevIcons, icon];
      });
    }
  };

  function renderIcons() {
    return icons.map( (icon) => icon.JSXElement);
  }
  
  // leave for now incase it's useful for socket.io emits
  function onDragHandler(event, data) {
    // console.log(data);
  };
  
  return (
    <div 
    className='Arena' 
    ref={arenaRef} 
    onDragOver={onDragOverHandler} 
    onDrop={onDropHandler}
    >
      Arena
      {renderIcons()}
      <CustomizeIcon 
        selectedIcon={selectedIcon}
        icons={icons}
      ></CustomizeIcon>
    </div>
  );
};

export default Arena;