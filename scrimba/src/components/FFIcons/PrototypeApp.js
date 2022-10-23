import React from 'react';
import Sidebar from './Sidebar';
import Arena from './Arena';

import './PrototypeApp.css';

function PrototypeApp() {
  return (
    <div className='PrototypeApp'>
      <Sidebar></Sidebar>
      <Arena></Arena>
    </div>
  );
};

export default PrototypeApp;