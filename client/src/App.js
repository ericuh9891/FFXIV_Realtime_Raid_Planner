import './App.css';
import IconList from './components/IconList/IconList.js';
import Arena from './components/Arena/Arena.js';

// const icons = [
//   require('./IconImages/TankRole.png'),
//   require('./IconImages/DPSRole.png'),
//   require('./IconImages/HealerRole.png'),
//   require('./IconImages/Waymark1.png'),
//   require('./IconImages/Waymark2.png'),
//   require('./IconImages/Waymark3.png'),
//   require('./IconImages/Waymark4.png'),
//   require('./IconImages/WaymarkA.png'),
//   require('./IconImages/WaymarkB.png'),
//   require('./IconImages/WaymarkC.png'),
//   require('./IconImages/WaymarkD.png'),
// ];

const iconsList = [
  {name: 'TankRole',
  image: require('./IconImages/TankRole.png')},
  {name: 'DPSRole',
  image: require('./IconImages/DPSRole.png')},
  {name: 'HealerRole',
  image: require('./IconImages/HealerRole.png')},
]

function App() {
  return (
    <div className="App">
      <IconList iconsList={iconsList}></IconList>
      <Arena iconsList={iconsList}></Arena>
    </div>
  );
}

export default App;
