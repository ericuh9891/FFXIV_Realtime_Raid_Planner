import './App.css';
import IconList from './components/IconList/IconList.js';
import Arena from './components/Arena/Arena.js';

// svg imports
import areaProximity from './IconImages/AreaProximity.svg';
import circle from './IconImages/Circle.svg';
import cone from './IconImages/Cone.svg';
import donut from './IconImages/Donut.svg';
import enemy from './IconImages/Enemy.svg';
import halfCircle from './IconImages/HalfCircle.svg';
import knock from './IconImages/Knock.svg';
import playerProximity from './IconImages/PlayerProximity.svg';
import push from './IconImages/Push.svg';
import quarter from './IconImages/Quarter.svg';
import ring from './IconImages/Ring.svg';
import square from './IconImages/Square.svg';
import stack from './IconImages/Stack.svg';
import stackLine from './IconImages/StackLine.svg';
import triangle from './IconImages/Triangle.svg';


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
  {name: 'Samurai',
  image: require('./IconImages/Samurai.png')},
  {name: 'Reaper',
  image: require('./IconImages/Reaper.png')},
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
  {name: 'Enemy',
  image: enemy},
  {name: 'AreaProximity',
  image: areaProximity},
  {name: 'PlayerProximity',
  image: playerProximity},
  {name: 'Push',
  image: push},
  {name: 'Knock',
  image: knock},
  {name: 'Stack',
  image: stack},
  {name: 'StackLine',
  image: stackLine},
  {name: 'Circle',
  image: circle},
  {name: 'Donut',
  image: donut},
  {name: 'Ring',
  image: ring},
  {name: 'Quarter',
  image: quarter},
  {name: 'HalfCircle',
  image: halfCircle},
  {name: 'Cone',
  image: cone},
  {name: 'Triangle',
  image: triangle},
  {name: 'Square',
  image: square},
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
