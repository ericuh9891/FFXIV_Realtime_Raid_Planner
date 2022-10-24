import React from 'react';
import './Sidebar.css'
import IconList from '../IconList/IconList.js'
import Preview from '../Preview/Preview.js'

function Sidebar(props) {
  return (
    <div className='Sidebar'>
      <IconList></IconList>
      <Preview></Preview>
    </div>
  );
};

export default Sidebar;