import logo from './logo.svg';
import AirBnb from './components/AirBnb/AirBnb.js'

function App() {
	return (
		<div className="App">
			<AirBnb/>
		</div>
	);
}

function Project1Markup() {
	return (
		<div className="Project1Markup">
			<img src={logo} style={{
					width: "200px",
				}}

			/>
			<h1 style={{fontSize: "80px"}}>Fun facts about React</h1>
			<ul style={{fontSize: "28px"}}>
				<li>Was first released in 2013</li>
				<li>Was originally created by Jordan Walke</li>
				<li>Has well over 100K stars on Github</li>
				<li>Is maintained by Facebook</li>
				<li>Powers thousands of enterprise apps, including mobile apps</li>
			</ul>
		</div>
	);
}

export default App;
