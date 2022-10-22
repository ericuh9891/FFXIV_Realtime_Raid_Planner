import React from 'react';
import Draggable from 'react-draggable';
import './FFIcons.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001/");
console.log(`Created socket: ${socket}`);

export function FFIconsDraggable(props) {
  const [position, setPosition] = React.useState({ x: 0, y: 0});

  function trackPos(data) {
    setPosition({ x: data.x, y: data.y});
  };

  React.useEffect( () => {
    socket.emit('iconMoved', position);
  }, [position]);

  return (
    <Draggable
      onDrag={(event, data) => trackPos(data)}
    >
      <div className='FFIcons'
      >
        x {position.x.toFixed(0)}, y: {position.y.toFixed(0)}
      </div>
    </Draggable>
  );
};

export function FFIconsPrototype(props) {

  const [pos1, setPos1] = React.useState(0);
  const [pos2, setPos2] = React.useState(0);
  const [pos3, setPos3] = React.useState(0);
  const [pos4, setPos4] = React.useState(0);
  const [innerText, setInnerText] = React.useState("");
  const iconRef = React.useRef();

  function dragMouseDown(event) {
    event = event || window.event;
    event.preventDefault();
    // get current mouse position from MouseEvent
    setPos3(event.clientX);
    setPos4(event.clientY);
    document.onmousemove = elementDrag;
  };
  
  function elementDrag(event) {
    event = event || window.event;
    event.preventDefault();

    setPos3(event.clientX);
    setPos4(event.clientY);
    // console.log(`Event X: ${event.clientX}, Y: ${event.clientY} Icon X: ${iconRef.current.style.left}`);
    // console.log(iconRef.current);
    iconRef.current.style.left = event.clientX + 'px';
    iconRef.current.style.top = event.clientY + 'px';

    /*
    // calculate the new cursor position
    const disX = pos3 - event.clientX;
    const disY = pos4 - event.clientY; 
    setPos1(disX);
    setPos2(disY);
    setPos3(event.clientX);
    setPos4(event.clientY);
    // move element based on new position
    event.target.style.left = (iconRef.current.offsetLeft - disX) + 'px';
    event.target.style.top = (iconRef.current.offsetTop - disY) + 'px';
    */
  }

  // set clean up of MouseEvent listeners when user release the mouse button on the element
  // React.useEffect( () => {
  //   // console.log(iconRef);
  //   iconRef.current.onmouseup = closeDragElement;
  //   // console.log(iconRef);
  // },[])

  function closeDragElement(event) {
    document.onmousemove = null; 
  }

  return (
    <div className='FFIcons'
    onMouseDown={dragMouseDown}
    onMouseUp={closeDragElement}
    ref={iconRef}
    >
      {`X: ${pos3}, Y: ${pos4}`}
    </div>
  );
};
