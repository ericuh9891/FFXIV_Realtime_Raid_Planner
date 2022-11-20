import React from 'react';
import './Arena.css';
import CustomizeIcon from '../CustomizeIcon/CustomizeIcon.js';
import Multistep from '../Multistep/Multistep.js'

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
  // if a user uses a URL that has an invalid roomId then server sends an error message/webpage to user
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
   *   iconState1[],
   *   iconState2[],
   *   ...
   *   iconStateN[],
   * ]
   */

  /**
   * Each Icon States should be an array of Icon objects
   */

  /** 
   * Icon object representation should be as follow: 
   * {
   *   id: number, // id is made by adding the socketID and a unique number generator
   *   arena: number, // the arena it belongs to, the index of arenaStates
   *   top: number,
   *   left: number,
   *   label: string,
   *   name: string,
   *   imgSrc: variable containing loaded in img src, // may need to change it so that it points to a iconsList instead of hardcoded img src path
   * }
   */

  const [arenaStates, setArenaStates] = React.useState([[]]);
  const [currentArena, setCurrentArena] = React.useState(0); // may be needed later when there are multiple arenaStates
  const [selectedIcon, setSelectedIcon] = React.useState(null); // should reference icon id and arena id in arenaState
  const [room, setRoom] = React.useState(''); // may be useful later if I decide to refactor to client keeping track of rooms
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
    for(let i = 0; i < arenaStates[currentArena].length; ++i) {
      if (arenaStates[currentArena][i].id === event.currentTarget.id) {
        icon = arenaStates[currentArena][i];
        break;
      };
      // error, icon should always be found
      console.error('Icon not found in function onMouseDownHandler');
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
    // FIXME: should probably not use hardcoded values of 30 and extract the icon width/height
    if (arenaRect.top+30 <= event.clientY &&
      event.clientY <= arenaRect.top+arenaRect.height-30){
        icon.top = event.clientY - arenaRef.current.getBoundingClientRect().y - 30;
      };
    if (arenaRect.left+30 <= event.clientX &&
      event.clientX <= arenaRect.left+arenaRect.width-30){
        icon.left = event.clientX - arenaRef.current.getBoundingClientRect().x - 30;
      };
    // notify server of iconMove
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

  // when icon move movement is done on mouseup event, removes onmousemove listener
  function onMouseUpHandler(event){
    document.onmousemove = null;
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
        arena: currentArena, // the index of arenaStates to indicate where the icon belows
        top: event.clientY - arenaRef.current.getBoundingClientRect().y - 30,
        left: event.clientX - arenaRef.current.getBoundingClientRect().x - 30, // CSS positioning for icon
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
    }
    console.log(`Deleting arena state ${currentArena+1}`)
    socket.emit('deleteArena', currentArena);
    setArenaStates( (prevArenaStates) => {
      // create a new copy of arenaStates
      let newArenaStates = prevArenaStates.map( (arena) => arena);
      setSelectedIcon(null);
      newArenaStates.splice(currentArena, 1)
      // for each icon in arenaState that got shifted over to the left index from deletion needs
      // to be updated to the current position of it's array
      for(let i = currentArena; i < newArenaStates.length; ++i){
        for(let j = 0; j < newArenaStates[i].length; ++j){
          newArenaStates[i][j] = {...newArenaStates[i][j], arena: i};
        }
      }
      if(currentArena >= 1){
        console.log(`decrementing currentArena`);
        setCurrentArena( (prevCurrentArena) => prevCurrentArena-1)
      }
      console.log(`currentArena: ${currentArena}`)
      return newArenaStates;
    });
  };

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
      console.log(`Recieved message to delate arenaState: ${arenaIndex}`)
      // guard against performing deletion on a single arenaState in arenaStates
      console.log(`arenaStates length: ${arenaStates.length}`);
      console.log(arenaStates);
      if(arenaStates.length <= 1) {
        console.log('Only one arenaState left, cannot delete')
        return;
      }
      console.log(`Deleting arena state ${arenaIndex+1}`)
      setArenaStates( (prevArenaStates) => {
        // create a new copy of arenaStates
        let newArenaStates = prevArenaStates.map( (arena) => arena);
        setSelectedIcon(null);// probably change this behaviour later
        newArenaStates.splice(arenaIndex, 1)
        // change arena if the currentArena is about to be deleted 
        if(currentArena >= arenaIndex && currentArena >= 1){
          console.log(`decrementing currentArena`);
          setCurrentArena( (prevCurrentArena) => prevCurrentArena-1)
        }
        // for each icon in arenaState that got shifted over to the left index from deletion needs
        // to be updated to the current position of it's array
        for(let i = arenaIndex; i < newArenaStates.length; ++i){
          for(let j = 0; j < newArenaStates[i].length; ++j){
            newArenaStates[i][j] = {...newArenaStates[i][j], arena: i};
          }
        }
        console.log(`currentArena: ${currentArena}`)
        return newArenaStates;
      });

      /*
      console.log(`Deleteing arenaState: ${arenaIndex+1}`)
      // guard against performing deletion on a empty arenaStates
      if(arenaStates.length <= 1) {
        console.log('No arena to delete')
        return;
      }
      console.log('Deleting arena state')
      setArenaStates( (prevArenaStates) => {
        // create a new copy of arenaStates
        let newArenaStates = prevArenaStates.map( (arena) => arena);
        // delete the state based on index aka currentArena
        console.log(`Before deletion:`);
        console.log(newArenaStates);
        console.log(`Deleted arena:`);
        console.log(newArenaStates.splice(arenaIndex, 1));
        console.log(`After deletion:`);
        console.log(newArenaStates);
        if(selectedIcon != null && selectedIcon.arena === arenaIndex) {
          setSelectedIcon(null);
        }
        if(currentArena === arenaIndex && currentArena >= 1){
          console.log(`Current Arena: ${currentArena}, Arena Index: ${arenaIndex}`);
          setCurrentArena( (prevCurrentArena) => prevCurrentArena-1)
        }
        return newArenaStates;
      });
      */
    });

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
    };
  }, [arenaStates, currentArena]);

  // renders the current arenaState's icons
  function renderIcons() {
    return arenaStates[currentArena].map( (icon) => {
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
    onDragOver={onDragOverHandler} // browser drag and drop API
    onDrop={onDragDropHandler} // browser drag and drop API
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
    </div>
  );
};

export default Arena;