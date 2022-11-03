import './App.css';
import IconList from './components/IconList/IconList.js';
import Arena from './components/Arena/Arena.js';

const iconsList = [
  {name: 'TankRole',
  image: require('./IconImages/TankRole.png')},
  {name: 'DPSRole',
  image: require('./IconImages/DPSRole.png')},
  {name: 'HealerRole',
  image: require('./IconImages/HealerRole.png')},
  {name: 'DarkKnight',
  image: require('./IconImages/DarkKnight.png')},
  {name: 'Gunbreaker',
  image: require('./IconImages/Gunbreaker.png')},
  {name: 'Paladin',
  image: require('./IconImages/Paladin.png')},
  {name: 'Warrior',
  image: require('./IconImages/Warrior.png')},
  {name: 'Astrologian',
  image: require('./IconImages/Astrologian.png')},
  {name: 'Sage',
  image: require('./IconImages/Sage.png')},
  {name: 'Scholar',
  image: require('./IconImages/Scholar.png')},
  {name: 'WhiteMage',
  image: require('./IconImages/WhiteMage.png')},
  {name: 'Dragoon',
  image: require('./IconImages/Dragoon.png')},
  {name: 'Monk',
  image: require('./IconImages/Monk.png')},
  {name: 'Ninja',
  image: require('./IconImages/Ninja.png')},
  {name: 'BlackMage',
  image: require('./IconImages/BlackMage.png')},
  {name: 'RedMage',
  image: require('./IconImages/RedMage.png')},
  {name: 'Summoner',
  image: require('./IconImages/Summoner.png')},
  {name: 'Bard',
  image: require('./IconImages/Bard.png')},
  {name: 'Dancer',
  image: require('./IconImages/Dancer.png')},
  {name: 'Machinist',
  image: require('./IconImages/Machinist.png')},
  {name: 'Waymark1',
  image: require('./IconImages/Waymark1.png')},
  {name: 'Waymark2',
  image: require('./IconImages/Waymark2.png')},
  {name: 'Waymark3',
  image: require('./IconImages/Waymark3.png')},
  {name: 'Waymark4',
  image: require('./IconImages/Waymark4.png')},
  {name: 'WaymarkA',
  image: require('./IconImages/WaymarkA.png')},
  {name: 'WaymarkB',
  image: require('./IconImages/WaymarkB.png')},
  {name: 'WaymarkC',
  image: require('./IconImages/WaymarkC.png')},
  {name: 'WaymarkD',
  image: require('./IconImages/WaymarkD.png')},
];

function App() {
  return (
    <div className="App">
      <IconList iconsList={iconsList}></IconList>
      <Arena iconsList={iconsList}></Arena>
    </div>
  );
}

export default App;
