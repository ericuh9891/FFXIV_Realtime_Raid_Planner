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
   *   top: number,
   *   left: number,  
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
  // also needs to register mouse events to make an icon drag along the position of the current mouse
  // by registering a document.onMouseMove listener to update the icon position
  function onMouseDownHandler(event) {
    console.log(event.currentTarget);
    // find the icon that was clicked
    let icon = null;
    for(let i = 0; i < icons.length; i++) {
      if (icons[i].id === event.currentTarget.id) {
        icon = icons[i];
        console.log("icon found");
        break;
      };
    };

    // update icon pos with setIcons
    icon.top = event.clientY - arenaRef.current.getBoundingClientRect().y - 30;
    icon.left = event.clientX - arenaRef.current.getBoundingClientRect().x - 30;
    document.onmousemove = (event) => {
      elementDrag(event, icon);
    };
    setIcons( (prevIcons) => {
      return prevIcons.map( (prevIcon) => {
        return prevIcon.id === icon.id ? icon : prevIcon;
      });
    });
    setSelectedIcon( () => icon);
    console.log("End of mouse down handler");
  };

  function elementDrag(event, icon) {
    event = event || window.event;
    event.preventDefault();
    // update icon pos with setIcons
    icon.top = event.clientY - arenaRef.current.getBoundingClientRect().y - 30;
    icon.left = event.clientX - arenaRef.current.getBoundingClientRect().x - 30;
    setIcons( (prevIcons) => {
      return prevIcons.map( (prevIcon) => {
        return prevIcon.id === icon.id ? icon : prevIcon;
      })
    });
  }

  function onMouseUpHandler(event){
    document.onmousemove = null;
    console.log("End of mouse up handler");
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
        top: event.clientY - arenaRef.current.getBoundingClientRect().y - 30,
        left: event.clientX - arenaRef.current.getBoundingClientRect().x - 30,
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
  // function onMouseDragHandler(event, data) {
  //   // find the icon
  //   let icon = null;
  //   for (let i = 0; i < icons.length; ++i){
  //     if (icons[i].id === data.node.id) {
  //       icon = icons[i];
  //       break;
  //     };
  //   };
  //   // console.log(document.getElementById(icon.id))
  //   icon.draggedX = data.x
  //   icon.draggedY = data.y
  //   icon.posX = icon.draggedX + icon.startPosX
  //   icon.posY = icon.draggedY + icon.startPosY
  //   console.log(`x: ${icon.draggedX}, y: ${icon.draggedY}`);
  //   // send the icon id, and the positionings to recalculate icon positions on rerender
  //   socket.emit('iconMove', {id: data.node.id, 
  //     startPosX: icon.startPosX, startPosY: icon.startPosY, 
  //     draggedX: icon.draggedX, draggedY: icon.draggedY});
  // };

  // unsure what this does
  // function onMouseDropHandler(event, data) {
  //   setIcons( (prevIcons) => prevIcons.map( (icon) => icon));
  // }

  // called by CustomizeIcon component to update an icon
  function customizeIconUpdateHandler(updatedIcon) {
    socket.emit('iconEdit', updatedIcon);
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
            return {...icon, startPosX: movement.startPosX, startPosY: movement.startPosY, 
              draggedX: movement.draggedX, draggedY: movement.draggedY};
          } else {
            return icon;
          };
        });
      });
    });

    socket.on('iconEdit', (editedIcon) => {
      setIcons( (prevIcons) => {
        return prevIcons.map( (icon) => {
          return icon.id === editedIcon.id ? editedIcon : icon;
        });
      });
    })

    // clean up socket listeners on component dismount
    return () => {
      socket.off('iconSpawn');
      socket.off('iconMove');
      socket.off('iconEdit');
    };
  }, []);

  // renders the Arena icons based on the icon states
  function renderIcons() {
    return icons.map( (icon) => {
      return (
        <div
          id={icon.id}
          className='Arena-Icon'
          draggalbe='false'
          style={{
            top: `${icon.top}px`, 
            left: `${icon.left}px`,
          }}
          onMouseDown={onMouseDownHandler}
          onMouseUp={onMouseUpHandler}
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
      );
    });
  };
  
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