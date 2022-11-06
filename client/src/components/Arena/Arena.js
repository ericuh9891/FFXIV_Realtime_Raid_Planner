import React from 'react';
import './Arena.css';
import CustomizeIcon from '../CustomizeIcon/CustomizeIcon.js';
import Draggable from 'react-draggable';

// may need to move this to App component in the future if socket is needed in higher level components
import io from 'socket.io-client'; 

// setup socket connection to the server
const socket = io.connect("http://localhost:8000");
socket.emit('arena',"Arena component connected");

// generates unique IDs for user
function* uniqueIdGenerator() {
  let limit = 1000;
  for(let id = 0; id < limit; id++) {
    yield `${socket.id} ${id}`;
  };
}
let getUniqueId = uniqueIdGenerator();

function Arena (props) {
  /** 
   * Icon state representation should be an object of: 
   * {
   *   id: number,
   *   posX: number,
   *   poxY: number,
   *   label: string,
   *   name: string,
   *   imgSrc: variable containing loaded in img src, // may need to change it so that it points to a iconsList instead of hardcoded img src path
   * }
   */
  const [icons, setIcons] = React.useState([]);
  const [selectedIcon, setSelectedIcon] = React.useState(null);
  const arenaRef = React.useRef();

/*** Event Handlers */

  // needed to override browser default behaviours
  function onDragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  // onMouseDown on an icon, set to SelectedIcon so it can be passed to CustomizeIcon props
  function onMouseDownHandler(event) {
    console.log(event);
    setSelectedIcon( () => {
      for(let i = 0; i < icons.length; i++) {
        if (icons[i].id === event.target.id) {
          return icons[i];
        };
      };
    });
  };
 
  // spawns an icon from the dragged icon from IconList
  function onDragDropHandler(event) {
    event.preventDefault();
    // get the name of the icon that's stored in the drop event's dataTransfer interface
    const name = event.dataTransfer.getData('text/plain');
    // check if an icon name exists
    if (!name) { // if empty string is returned
      console.log("No icon name in drop event's dataTransfer getData()");
    } else { // if an icon name was retrieved
      // get the image from props based on the retrieved name
      let image = null;
      for (let i = 0; i < props.iconsList.length; i++){
        if (props.iconsList[i].name === name){
          image = props.iconsList[i].image;
        };
      };
      // create the icon state and add it
      const icon = {
        id: getUniqueId.next().value, // generates a unique ID that's going to be used to access and identify the icons
        posX: event.clientX - arenaRef.current.getBoundingClientRect().x - 30,
        posY: event.clientY - 30, // x, y coords should be where the user released their mouse inside Arena area
        label: "", // will be used later if a user customize the icon with a custom label
        name: name, // name of the icon
        imgSrc: image,
      };
      // tell server an icon was created, sends the icon object
      console.log(`Notifying server of a new icon spawn`);
      socket.emit('iconSpawn', icon);
      // add the icon which triggers a rerender
      setIcons( (prevIcons) => {
        return [...prevIcons, icon];
      });
      // update the CustomizeIcon selectedIcon to the recently added icon
      setSelectedIcon(icon);
    };
  };

  // notify the server an icon has moved, sends the icon id and it's new posX and posY
  function onMouseDragHandler(event, data) {
    // console.log(event);
    // console.log(data);
    // find the icon
    let icon = null;
    for (let i = 0; i < icons.length; ++i){
      if (icons[i].id === data.node.id) {
        icon = icons[i];
        break;
      };
    };
    // send the icon id, new posX and new posY
    socket.emit('iconMove', {id: data.node.id, posX: icon.posX + data.x, posY: icon.posY + data.y});
  };

  /**
  * leave for now, should update the position of draggable 
  * icons so if a rerender of Arena icons happens,
  * the icon states are updated with the last known position and 
  * everything icons will rerender in the last known spots
  * possible position update should be something like 
  * y = icon.top + draggable.data.y
  * x = icon.left + draggable.data.x 
  */
  function onMouseDropHandler(event, data) {
    setIcons( (prevIcons) => prevIcons.map( (icon) => icon));
  }

  // called by CustomizeIcon component to update an icon
  function customizeIconUpdateHandler(updatedIcon) {
    setIcons( (prevIcons) => {
      return prevIcons.map( (icon) => {
        return icon.id === updatedIcon.id ? updatedIcon : icon;
      });
    });
  };

/*** socket.io listeners */
  React.useEffect( () => {
    socket.on('iconSpawn', (icon) => {
      console.log('Adding new icon');
      setIcons( (prevIcons) => {
        return [...prevIcons, icon];
      });
    });
    socket.on('iconMove', (movement) => {
      console.log('Moving icon');
      setIcons( (prevIcons) => {
        return prevIcons.map( (icon) => {
          if (icon.id === movement.id) {
            return {...icon, posX: movement.posX, posY: movement.posY};
          } else {
            return icon;
          };
        });
      });
    });

    // clean up socket listeners on component dismount
    return () => {
      socket.off('iconSpawn');
      socket.off('iconMove');
    };
  }, []);

  // renders the Arena icons based on the icon states
  function renderIcons() {
    return icons.map( (icon) => {
      return (
        <Draggable
          id={'draggable'+icon.id}
          key={'draggable'+icon.id}
          defaultPosition={{x: 0, y: 0}}
          bounds='parent'
          onDrag={onMouseDragHandler}
          onMouseDown={onMouseDownHandler}
          onStop={onMouseDropHandler}
        >
          <div
            id={icon.id}
            className='Arena-Icon'
            draggalbe='false'
            style={{
              top: `${icon.posY}px`, 
              left: `${icon.posX}px`,
            }}
            // onMouseDown={onMouseDownHandler}
            >
            <label
              className='Arena-Icon-label'
            >
              {icon.label}
            </label>
            <img 
              id={icon.id}
              className='Arena-Icon-Img'
              src={icon.imgSrc}
              alt={icon.name}
              draggable='false'
            >
            </img>
          </div>
        </Draggable>
      );
    });
  }
  
  return (
    <div 
    className='Arena' 
    ref={arenaRef} 
    onDragOver={onDragOverHandler}
    onDrop={onDragDropHandler} // browser drag and drop API
    >
      Arena
      {renderIcons()}
      <CustomizeIcon 
        selectedIcon={selectedIcon}
        updateIcon={customizeIconUpdateHandler}
      ></CustomizeIcon>
    </div>
  );
};

export default Arena;