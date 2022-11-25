import React from 'react';
import './CustomContextMenu.css';

function CustomContextMenu(props) {
  const [menuValue, setMenuValue] = React.useState('Delete');
  return (
    <div
      className='CustomContextMenu'
      style={{top:`${props.position.top}px`, left:`${props.position.left}px`}}
      onClick={(event) => props.deleteIconHandler(event)}
    >
      {menuValue}
    </div>
  )
}

export default CustomContextMenu;