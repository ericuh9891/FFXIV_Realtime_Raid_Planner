import './App.css';
import Sidebar from './components/Sidebar/Sidebar.js';
import Arena from './components/Arena/Arena.js';

const iconList = [
  require('./IconImages/TankRole.png'),
  require('./IconImages/DPSRole.png'),
  require('./IconImages/HealerRole.png'),
  require('./IconImages/Waymark1.png'),
  require('./IconImages/Waymark2.png'),
  require('./IconImages/Waymark3.png'),
  require('./IconImages/Waymark4.png'),
  require('./IconImages/WaymarkA.png'),
  require('./IconImages/WaymarkB.png'),
  require('./IconImages/WaymarkC.png'),
  require('./IconImages/WaymarkD.png'),
];

function App() {
  return (
    <div className="App">
      <Sidebar iconList={iconList}></Sidebar>
      <Arena iconList={iconList}></Arena>
    </div>
  );
}

export default App;
