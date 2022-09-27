
// import "./CustomPage.css"
import React from "react"

const customPageCSS1 = {
	color: 'blue',
	backgroundColor: 'grey',
};

const customPageCSS2 = {
	fontSize: '40px',
	color: 'red',
};

const customPageCSS = {
	...customPageCSS1,
	...customPageCSS2,
};

class CustomPage extends React.Component{
	constructor(props) {
		super(props);
		this.state =  {
			reasons: [
			"Hirability",
			"Reuseable components",
			"Possible branching to React Native for multi-platform development",
			]
		};
	};

	createList() {
		const reasonsListItems = this.state.reasons.map((reason) =>
			<li>{reason}</li>
		);
		return (
			<ol style={customPageCSS}>{reasonsListItems}</ol>
		);
	};

	render() {
		return(
			<div>
				<h1>Reasons I'm excited to learn React:</h1>
				{this.createList()}
			</div>
		);
	};
};

export default CustomPage;