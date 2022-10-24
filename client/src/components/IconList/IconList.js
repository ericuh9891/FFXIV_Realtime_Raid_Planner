import React from 'react';
import './IconList.css';
import TankRole from './IconImages/TankRole.png';
import DPSRole from './IconImages/DPSRole.png';
import HealerRole from './IconImages/HealerRole.png';


function IconList(props) {
  return (
    <div>
      <img src={TankRole}></img>
      <img src={DPSRole}></img>
      <img src={HealerRole}></img>
    </div>
  );
}

export default IconList;