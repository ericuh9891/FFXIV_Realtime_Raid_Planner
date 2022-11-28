import React from 'react';
import './Arena.css';
import CustomizeIcon from '../CustomizeIcon/CustomizeIcon.js';
import Multistep from '../Multistep/Multistep.js'
import CustomContextMenu from '../CustomContextMenu/CustomContextMenu';

import resizeIconImg from './resizeIcon.png';
import rotateIconImg from './rotateIcon.png';

// may need to move this to App component in the future if socket is needed in higher level components
import io from 'socket.io-client'; 

// setup socket connection to the server
const socket = io.connect();
// if no pathname/roomId was given, then join a new room with socket emit
if (window.location.pathname === '/'){ // base homepage with not pathname/roomId
  // tell server to create a room and also to automatically join the user into that room
  socket.emit('createRoom');
} else {
  // if a pathname/roomId is in the URL then user will be joined into that room
  // only correct pathname/roomId will allow users to get the web application page
  socket.emit('joinRoom', window.location.pathname.split('/')[1]);
  // if a user uses a URL that has an invalid roomId then server sends an error webpage to user
};

// generates unique IDs for user
function* uniqueIdGenerator() {
  const limit = 10000;
  for(let id = 0; id < limit; id++) {
    yield `${socket.id} ${id}`;
  };
  console.log(`hit limit of ${limit} IDs`);
};
let getUniqueId = uniqueIdGenerator();

function Arena (props) {
  /**
   * Arena states representation should be an array of Icon states arrays
   * [
   *   arenaState1[],
   *   arenaState2[],
   *   ...
   *   arenaStateN[],
   * ]
   */

  /**
   * Each arenaState should be an array of Icon objects
   */

  /** 
   * Icon object representation should be as follow: 
   * { // id combined with arena are the unique identifier for icons
   *   id: String, // id is made by adding the socketID and a unique number generator
   *   arena: Number, // the arena it belongs to, the 0 based index of arenaStates
   *   top: Number,
   *   left: Number,
   *   width: Number,
   *   height: Number,
   *   degrees: Number, // for use with CSS transform: rotate(deg)
   *   label: String,
   *   name: String,
   *   // may need to change it so that it points to a iconsList instead of hardcoded img src path from I think webpack.js compiling
   *   imgSrc: String variable containing loaded in img src, 
   * }
   */

  /**
   * selectedIcon is an object: {id: String, arena: Number} of the currently selected icon
   */

  const [arenaStates, setArenaStates] = React.useState([[]]);
  // pointer to the index of arenaStates telling react which arena to render, 0 based indexing
  const [currentArena, setCurrentArena] = React.useState(0); 
  // references icon id and arena id in arenaState as object literal eg. {id: Number, arena: Number}
  const [selectedIcon, setSelectedIcon] = React.useState(null); 
  const [room, setRoom] = React.useState(''); // may be useful later if I decide to refactor to client keeping track of rooms
  // controls when to display custom context menu
  const [customContextMenu, setCustomContextMenu] = React.useState({top: 0, left: 0, isShown: false});
  const arenaRef = React.useRef();

  /*** Event Handlers */

  // needed to override browser default behaviours
  function onDragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  // onMouseDown on an icon, sets clicked icon to SelectedIcon so it can be passed to CustomizeIcon props
  // also registers mouse events to make an icon drag along the position of the current mouse
  // by registering a document.onMouseMove listener to update the icon position
  function onMouseDownHandler(event) {
    // find the icon that was clicked
    let icon = null;
    for(let i = 0; i < arenaStates[currentArena].length; i++) {
      if (arenaStates[currentArena][i].id === event.currentTarget.id) {
        icon = arenaStates[currentArena][i];
        break;
      };
      // error, icon should always be found
      console.warn('Icon not found in function onMouseDownHandler');
    };
    // get the arena's DOM CSS properties
    const arenaRect = arenaRef.current.getBoundingClientRect();
    // registers DOM to listen for onmousemove event and move the selected icon
    // based on mouse movement and keeps it with the bounds of the arena
    document.onmousemove = (event) => {
      elementDrag(event, icon, arenaRect);
    };
    // sets the current selected icon so CustomizeIcon is updated
    setSelectedIcon({id: icon.id, arena: icon.arena});
  };

  function elementDrag(event, icon, arenaRect) {
    event = event || window.event;
    event.preventDefault();
    // updates icon position without rerender, only allows icons to move within arena bounds
    if (arenaRect.top+icon.height/2 <= event.clientY &&
      event.clientY <= arenaRect.top+arenaRect.height-icon.height/2){
        icon.top = event.clientY - arenaRef.current.getBoundingClientRect().y - (icon.height/2);
      };
    if (arenaRect.left+icon.width/2 <= event.clientX &&
      event.clientX <= arenaRect.left+arenaRect.width-icon.width/2){
        icon.left = event.clientX - arenaRef.current.getBoundingClientRect().x - (icon.width/2);
      };
    // notify server of icon movement
    socket.emit('iconMove', {id: icon.id, arena: icon.arena, top: icon.top, left: icon.left});
    // update the icon in arenaStates
    setArenaStates( (prevArenaStates) => {
      return prevArenaStates.map( (arenaState, index) => {
        // find the arenaState
        if (icon.arena === index) {
          // return a new arenaState after updating it with the icon
          return arenaState.map( (prevIcon) => {
            return prevIcon.id === icon.id ? icon : prevIcon;
          });
        } else {
          return arenaState;
        };
      });
    });
  };

  // when icon move/resize movement is done on mouseup event, cleans up onmousemove listener
  function onMouseUpHandler(event) {
    document.onmousemove = null;
  };

  // resize icon prototype
  function resizeOnMouseDownHandler(mouseDownEvent) {
    // find the icon that was clicked based on the ID
    let icon = null;
    for(let i = 0; i < arenaStates[currentArena].length; i++) {
      if (arenaStates[currentArena][i].id === mouseDownEvent.currentTarget.id) {
        icon = {...arenaStates[currentArena][i]};
        break;
      };
      // error, icon should always be found
      console.warn('Icon not found in function resizeOnMouseDownHandler');
    };
    // register a mouseMove handler onto the DOM maybe called resizeElement()
    document.onmousemove = resizeElement;
    // copy icon starting positions
    const iconStartLeft = icon.left;
    const iconStartTop = icon.top;
    // copy the starting icon's width and height
    const iconStartWidth = icon.width;
    const iconStartHeight = icon.height;
    // copy the starting click position
    const startX = mouseDownEvent.clientX;
    const startY = mouseDownEvent.clientY;
    // calculate the position of the icon's center
    const iconCenterX = (icon.width/2) + icon.left + arenaRef.current.getBoundingClientRect().x;
    const iconCenterY = (icon.height/2) + icon.top;
    // calculate the position of the corner opposite of where the click started
    const oppositeCornerX = (iconCenterX - startX) + iconCenterX;
    const oppositeCornerY = (iconCenterY - startY) + iconCenterY;
    // computes the distance based on two points
    function getDistance(x1, y1, x2, y2) {
      const y = x2 - x1;
      const x = y2 - y1;
      return Math.sqrt(x * x + y * y);
    };
    // get the distance of opposite corner to starting click position
    const iconDiagonalDistance = getDistance(startX, startY, oppositeCornerX, oppositeCornerY);
    // sanity check
    // console.log(`Start: ${startX},${startY} Center: ${iconCenterX},${iconCenterY},` +
    //   `OppositeCorner: ${oppositeCornerX},${oppositeCornerY},` +
    //   `CornerDistances: ${iconDiagonalDistance}`);
    function resizeElement(mouseMoveEvent) {
      // calculate the distance from start mousedown to current mouse position
      const oppositeCornerToCurrentDistance = getDistance(oppositeCornerX, oppositeCornerY, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
      // scaler to modify the icon width and height
      const scaler =  oppositeCornerToCurrentDistance / iconDiagonalDistance;
      // modify and update icon height and width
      icon.width = Math.round(iconStartWidth * scaler);
      icon.height = Math.round(iconStartHeight * scaler);
      // left and top of icon needs to be adjusted so icon stays centered while it's resizing
      icon.left = iconStartLeft + ((iconStartWidth - icon.width) / 2);
      icon.top = iconStartTop + ((iconStartHeight - icon.height) / 2);
      socket.emit('iconEdit', icon);
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          // find the arenaState
          if (icon.arena === index) {
            // return a new arenaState after updating it with the icon
            return arenaState.map( (prevIcon) => {
              return prevIcon.id === icon.id ? icon : prevIcon;
            });
          } else {
            return arenaState;
          };
        });
      });
    };
  };

  // rotate icon on mouseclick
  function rotateOnMouseDownHandler(mouseDownEvent) {
    console.log('rotateOnMouseDownHandler');
    console.log(mouseDownEvent);
    // find the icon that was clicked based on the ID
    let icon = null;
    for(let i = 0; i < arenaStates[currentArena].length; i++) {
      if (arenaStates[currentArena][i].id === mouseDownEvent.currentTarget.id) {
        icon = {...arenaStates[currentArena][i]};
        break;
      };
      // error, icon should always be found
      console.warn('Icon not found in function resizeOnMouseDownHandler');
    };
    // register rotateElement mouseMoveHandler to DOM
    document.onmousemove = rotateElement;

    // caculate x,y position of center of icon image
    const iconCenterX = (icon.width/2) + icon.left + arenaRef.current.getBoundingClientRect().x;
    const iconCenterY = (icon.height/2) + icon.top;

    // rotates element on mouse movement
    function rotateElement(mouseMoveEvent) {
      // console.log(mouseMoveEvent);
      let deltaX = mouseMoveEvent.clientX - iconCenterX;
      let deltaY = mouseMoveEvent.clientY - iconCenterY;

      let radians = Math.atan2(deltaX, deltaY);
      let degrees = Math.round((radians * (180 / Math.PI) * -1) + 180) - 45;
      console.log(`CenterX: ${iconCenterX}, CenterY: ${iconCenterY}, 
        MouseX: ${mouseMoveEvent.clientX} MouseY: ${mouseMoveEvent.clientY}, 
        Radians: ${radians}, Degrees: ${degrees}`);
      // update icon's degrees
      icon.degrees = degrees;
      //notify server of icon rotation
      socket.emit('iconEdit', icon);
      // apply the update into arenaStates with setArenaStates and replace it with the new icon properties
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          // find the arenaState
          if (icon.arena === index) {
            // return a new arenaState after updating it with the icon
            return arenaState.map( (prevIcon) => {
              return prevIcon.id === icon.id ? icon : prevIcon;
            });
          } else {
            return arenaState;
          };
        });
      });
    };
  };
 
  // spawns an icon from the dragged icon from IconList
  function onDragDropHandler(event) {
    event.preventDefault();
    // get the name of the icon that's stored in the drop event's dataTransfer interface
    const name = event.dataTransfer.getData('text/plain');
    // check if an icon name exists
    if (!name) { // if empty string is returned
      console.error("No icon name in drop event's dataTransfer getData()");
    } else { // if an icon name was retrieved
      // get the image from props based on the retrieved name
      let image = null;
      for (let i = 0; i < props.iconsList.length; i++){
        if (props.iconsList[i].name === name){
          image = props.iconsList[i].image;
        };
      };
      // create the icon state
      const icon = {
        id: getUniqueId.next().value, // generates a unique ID that's going to be used to access and identify the icons and it's arena
        arena: currentArena, // the index of arenaStates to indicate where the icon belongs
        top: event.clientY - arenaRef.current.getBoundingClientRect().y - 50,
        left: event.clientX - arenaRef.current.getBoundingClientRect().x - 50, // CSS positioning for icon
        width: 100,
        height: 100,
        degrees: 0,
        label: "", // will be used later if a user customize the icon with a custom label
        name: name, // name of the icon
        imgSrc: image,
      };
      // tell server an icon was created, sends the icon object
      socket.emit('iconSpawn', icon);
      // add the icon to the current Arena and rerender
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          if (icon.arena === index) {
            arenaState.push(icon);
          }
          return arenaState;
        });
      });
      // sets the current selected icon so CustomizeIcon is updated
      setSelectedIcon({id: icon.id, arena: icon.arena});
    };
  };

  // called by CustomizeIcon component to update an icon
  function customizeIconUpdateHandler(updatedIcon) {
    socket.emit('iconEdit', updatedIcon);
    setArenaStates( (prevArenaStates) => {
      return prevArenaStates.map( (arenaState, index) => {
        // find the arenaState the updatedIcon should go to
        if (updatedIcon.arena === index) {
          // replace with updatedIcon
          return arenaState.map( (prevIcon) => {
            return prevIcon.id === updatedIcon.id ? updatedIcon : prevIcon;
          })
        } else {
          return arenaState;
        };
      });
    });
  };

  // called by Multistep component to add a new arenaState
  function multistepAddArenaState(event) {
    console.log('Added new arena state')
    // create new copy of currently selected arena with icons copied over
    let newArenaState = arenaStates[currentArena].map((icon) => {
      return {...icon, arena: arenaStates.length};
    });
    // add the new copy of currently selected arena
    setArenaStates( (prevArenaStates) => {
      let newArenaStates =  prevArenaStates.map( (arenaState) => {
        return arenaState;
      });
      newArenaStates.push(newArenaState);
      return newArenaStates;
    });
    // set currentArena to the newly create arenaState
    setCurrentArena( () => arenaStates.length);
    socket.emit('newArena', newArenaState);
  };

  // called by Multistep component to delete an arenaState
  function multistepDeleteArenaState(event) {
    // guard against performing deletion on a single arenaState in arenaStates
    if(arenaStates.length <= 1) {
      console.log('Only one arenaState left, cannot delete')
      return;
    };
    console.log(`Deleting step ${currentArena+1}`);
    socket.emit('deleteArena', currentArena);
    setArenaStates( (prevArenaStates) => {
      // create a new copy of arenaStates
      let newArenaStates = prevArenaStates.map( (arena) => arena);
      // null the current selected Icon as it's being deleted
      setSelectedIcon(null);
      // delete the arenaState/step
      newArenaStates.splice(currentArena, 1)
      // for each icon in arenaState that got shifted over to the left index from deletion, each arenaState
      // to the right needs to be updated to the current position of it's array
      for(let i = currentArena; i < newArenaStates.length; ++i){
        for(let j = 0; j < newArenaStates[i].length; ++j){
          newArenaStates[i][j] = {...newArenaStates[i][j], arena: i};
        };
      };
      // shift currentArena to the left of arenaStates to render the arena/step before it
      if(currentArena >= 1){
        console.log('Rendering arena/step before deleted arena');
        setCurrentArena( (prevCurrentArena) => prevCurrentArena-1)
      };
      return newArenaStates;
    });
  };

  // creates a custom context menu on right click
  function contextMenuHandler(event) {
    // prevent the default context menu from displaying
    event.preventDefault();
    // close any open customContextMenu that may be open
    setCustomContextMenu( (prevCustomContextMenu) => {
      return {...prevCustomContextMenu, isShown: false};
    });
    const offsets = arenaRef.current.getBoundingClientRect();
    // set the new customContextMenu to the new position of the user click
    setCustomContextMenu( (prevCustomContextMenu) => {
      return {...prevCustomContextMenu, top: event.clientY, left: event.clientX - offsets.x, isShown: true};
    });
  };

  // deletes icon called by CustomContextMenu component
  function deleteIconHandler(event) {
    // copy the selected Icon
    const targetIcon = {...selectedIcon};
    // erase so that we can proceed to deleting it in arenaStates
    setSelectedIcon(null);
    // create copy of arena
    const newArenaStates = arenaStates.map( (arena) => arena);
    // find the index of the icon to delete
    const targetIndex = newArenaStates[targetIcon.arena].findIndex( (icon) => icon.id === targetIcon.id);
    // find the icon in arenaStates and delete
    newArenaStates[targetIcon.arena].splice(targetIndex, 1);
    setArenaStates( () => newArenaStates);
    socket.emit('deleteIcon', targetIcon);
  }

  /*** socket.io listeners */
  React.useEffect( () => {

    socket.on('iconSpawn', (icon) => {
      console.log('Adding new icon');
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          if (icon.arena === index) {
            arenaState.push(icon);
          }
          return arenaState;
        });
      });
    });

    socket.on('iconMove', (movement) => {
      // console.log('Moving icon');
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          // find the arena that the icon belonged to
          if (index === movement.arena) {
            // find the icon and replace it with new values
            return arenaState.map( (icon) => {
              return icon.id === movement.id ? {...icon, top: movement.top, left: movement.left} : icon;
            });
          };
          return arenaState;
        });
      });
    });

    socket.on('iconEdit', (editedIcon) => {
      setArenaStates( (prevArenaStates) => {
        return prevArenaStates.map( (arenaState, index) => {
          if (editedIcon.arena === index) {
            return arenaState.map( (prevIcon) => {
              return prevIcon.id === editedIcon.id ? editedIcon : prevIcon;
            })
          } else {
            return arenaState;
          };
        });
      });
      if (selectedIcon.id === editedIcon.id) {
        setSelectedIcon({id: editedIcon.id, arena: editedIcon.arena});
      }
    });

    socket.on('joinedRoom', (roomId) => {
      console.log(`Joined room: ${roomId}`);
      window.history.replaceState(null, '', `${roomId}`);
      setRoom( () => roomId);
    });

    socket.on('newArena', (newArenaState) => {
      console.log(`Adding new arena`);
      setArenaStates( (prevArenaStates) => {
        let newArenaStates = prevArenaStates.map( (arena) => arena);
        newArenaStates.push(newArenaState);
        return newArenaStates;
      });
    });

    socket.on('deleteArena', (arenaIndex) => {
      console.log(`Recieved message to delete step: ${arenaIndex}`);
      // guard against deleting arenaState if there's only 1 state
      if(arenaStates.length <= 1) {
        console.log('Only one arenaState left, cannot delete')
        return;
      }
      console.log(`Deleting step ${arenaIndex+1}`);
      setArenaStates( (prevArenaStates) => {
        // create a new copy of arenaStates
        let newArenaStates = prevArenaStates.map( (arena) => arena);
        // probably change this behaviour later, if user is editing an icon in an arena not being deleted, this would interrupt them
        // but changing it to not unselect an icon would require reacquiring selectedIcon after arenaStates have shifted
        setSelectedIcon(null);
        // delete the arenaState/step
        newArenaStates.splice(arenaIndex, 1);
        // change arena if the currentArena is about to be deleted 
        if(currentArena >= arenaIndex && currentArena >= 1){
          setCurrentArena( (prevCurrentArena) => prevCurrentArena-1);
        };
        // for each icon in arenaState that got shifted over to the left index from deletion needs
        // to be updated to the current position of it's array
        for(let i = arenaIndex; i < newArenaStates.length; ++i){
          for(let j = 0; j < newArenaStates[i].length; ++j){
            newArenaStates[i][j] = {...newArenaStates[i][j], arena: i};
          };
        };
        return newArenaStates;
      });
    });

    socket.on('requestArenaStates', (requesterSocketId) => {
      socket.emit('arenaStatesForSocketId', arenaStates, requesterSocketId);
    });

    socket.on('updateArenaStates', (updatedArenaStates) => {
      setArenaStates( () => updatedArenaStates);
    });

    socket.on('deleteIcon', (targetIcon) => {
      console.log(`Received deleteIcon message, targetIcon: ${targetIcon.id}, ${targetIcon.arena}`);
      // if selectedIcon is the targetIcon then set it to null
      if (selectedIcon != null && selectedIcon.id === targetIcon.id && selectedIcon.arena === targetIcon.arena) {
        setSelectedIcon( () => null);
        console.log('Current Icon is selected, setting to null');
      }
      // create copy of arena
      const newArenaStates = arenaStates.map( (arena) => arena);
      // find the index of the icon to delete
      const targetIndex = newArenaStates[targetIcon.arena].findIndex( (icon) => icon.id === targetIcon.id);
      if(targetIndex !== -1){
        console.log(`Icon found at index: ${targetIndex}`)
      } else {
        console.log('Icon not found');
      }
      // find the icon in arenaStates and delete
      newArenaStates[targetIcon.arena].splice(targetIndex, 1);
      setArenaStates( () => newArenaStates);
    });

    // test messaging from server to client
    socket.on('serverMessage', (message) => console.log(message));

    // clean up socket listeners on component dismount
    return () => {
      // leave the room the socket is in
      // socket.emit('leaveRoom', room);
      socket.off('iconSpawn');
      socket.off('iconMove');
      socket.off('iconEdit');
      socket.off('joinedRoom');
      socket.off('newArena');
      socket.off('deleteArena');
      socket.off('requestArenaStates');
      socket.off('updateArenaStates');
      socket.off('deleteIcon');
      socket.off('serverMessage');
    };
  }, [arenaStates, currentArena, selectedIcon]);

  // renders the current arenaState's icons
  // takes the iconState and renders it into HTML elements
  function renderIcons() {
    return arenaStates[currentArena].map( (icon) => {
      // if an icon is selected and is the current icon being rendered then returns true
      // used for conditional rendering of certain icon properties
      const isSelected = selectedIcon != null && 
      icon.id === selectedIcon.id && 
      icon.arena === selectedIcon.arena;
      return (
        <div
          id={icon.id}
          className='Arena-Icon'
          draggable='false'
          style={{
            top: `${icon.top}px`, 
            left: `${icon.left}px`,
            width: `${icon.width}px`,
            height: `${icon.height}px`,
            transform: `rotate(${icon.degrees}deg)`,
            border: isSelected ? 
              `black solid 1px` : 'none'
          }}
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
            style={{
              width: `${icon.width-40}px`,
              height: `${icon.height-40}px`,
              top: `20px`,
              left: `20px`,
            }}
            alt={icon.name}
            draggable='false'
            onContextMenu={contextMenuHandler}
            onMouseDown={onMouseDownHandler}
            onMouseUp={onMouseUpHandler}
          >
          </img>
          <img
            id={icon.id}
            className='Arena-Resize-Img'
            src={resizeIconImg}
            style={{
              top: `${icon.height-20}px`,
              left: `${icon.width-20}px`,
              display: isSelected ?
                'block' : 'none',
            }}
            alt={icon.name}
            draggable='false'
            onMouseDown={resizeOnMouseDownHandler}
            onMouseUp={onMouseUpHandler}
          >
          </img>
          <img
            id={icon.id}
            className='Arena-Rotate-Img'
            src={rotateIconImg}
            style={{
              top: `${0}px`,
              left: `${icon.width-20}px`,
              display: isSelected ?
              'block' : 'none',
            }}
            alt={icon.name}
            draggable='false'
            onMouseDown={rotateOnMouseDownHandler}
            onMouseUp={onMouseUpHandler}
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
    onDragOver={onDragOverHandler} // browser drag and drop API
    onDrop={onDragDropHandler} // browser drag and drop API
    onContextMenu={(event) => event.preventDefault()}
    onClick={(event) => {setCustomContextMenu( (prevCustomContextMenu) => ({...prevCustomContextMenu, isShown: false}))}}
    onMouseUp={onMouseUpHandler}
    >
      {renderIcons()}
      <Multistep
        multistepAddArenaState={multistepAddArenaState}
        setCurrentArena={setCurrentArena}
        multistepDeleteArenaState={multistepDeleteArenaState}
        arenaStates={arenaStates}
        currentArena={currentArena}
      ></Multistep>
      {`Current room: ${room}`}
      <CustomizeIcon
        arenaStates={arenaStates}
        selectedIcon={selectedIcon}
        updateIcon={customizeIconUpdateHandler}
        socket={socket}
      ></CustomizeIcon>
      {customContextMenu.isShown &&
        <CustomContextMenu
          position={{top: customContextMenu.top, left: customContextMenu.left}}
          deleteIconHandler={deleteIconHandler}
        >
        </CustomContextMenu>
      }
    </div>
  );
};

export default Arena;