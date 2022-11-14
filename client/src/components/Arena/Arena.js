import React from 'react';
import './Arena.css';
import CustomizeIcon from '../CustomizeIcon/CustomizeIcon.js';

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
}

// generates unique IDs for user
function* uniqueIdGenerator() {
  const limit = 10000;
  for(let id = 0; id < limit; id++) {
    yield `${socket.id} ${id}`;
  };
  console.log(`hit limit of ${limit} IDs`);
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
    for(let i = 0; i < icons.length; i++) {
      if (icons[i].id === event.currentTarget.id) {
        icon = icons[i];
        break;
      };
    };
    // get the arena's DOM CSS properties
    const arenaRect = arenaRef.current.getBoundingClientRect();
    // registers DOM to listen for onmousemove event and move the selected icon
    // based on mouse movement and keeps it with the bounds of the arena
    document.onmousemove = (event) => {
      elementDrag(event, icon, arenaRect);
    };
    setSelectedIcon( () => icon);
  };

  function elementDrag(event, icon, arenaRect) {
    event = event || window.event;
    event.preventDefault();
    // updates icon position without rerender, only allows icons to move within arena bounds
    if (arenaRect.top+30 <= event.clientY &&
      event.clientY <= arenaRect.top+arenaRect.height-30){
        icon.top = event.clientY - arenaRef.current.getBoundingClientRect().y - 30;
      }
    if (arenaRect.left+30 <= event.clientX &&
      event.clientX <= arenaRect.left+arenaRect.width-30){
        icon.left = event.clientX - arenaRef.current.getBoundingClientRect().x - 30;
      }
    // notify server of iconMove
    socket.emit('iconMove', {id: icon.id, top: icon.top, left: icon.left})
    // updates icons
    setIcons( (prevIcons) => {
      return prevIcons.map( (prevIcon) => {
        return prevIcon.id === icon.id ? icon : prevIcon;
      })
    });
  }

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
        left: event.clientX - arenaRef.current.getBoundingClientRect().x - 30, // CSS positioning for icon
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
            return {...icon, top: movement.top, left: movement.left};
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

    socket.on('joinedRoom', (roomId) => {
      console.log(`Joined room: ${roomId}`);
      setRoom( () => roomId);
    })
    // clean up socket listeners on component dismount
    return () => {
      // leave the room the socket is in
      // socket.emit('leaveRoom', room);
      socket.off('iconSpawn');
      socket.off('iconMove');
      socket.off('iconEdit');
      socket.off('joinedRoom');
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
    onDragOver={onDragOverHandler} // browser drag and drop API
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