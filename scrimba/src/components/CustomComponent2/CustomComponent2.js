import React from 'react'
import ReactDOM from 'react-dom'
import './CustomComponent2.css'



function Header() {
  return (
    <header>
      <nav className="CustomComponent-header-nav">
        <img className="CustomComponent-header-nav-img" src="./logo192.png"></img>
        <ul className="CustomComponent-header-nav-ul">
          <li>Pricing</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  const currentDate = new Date();
  const author = "UHuang";
  return (
    <footer>{`© 20${currentDate.getFullYear() % 100} ${author} development. All rights reserved`}</footer>
  );
}

function Contents() {
  const reasons = [
    "Hirability",
    "Reuseable components",
    "Possible branching to React Native for multi-platform development",
  ]
  let key = 1;
  const listElement = reasons.map( (reason) => <li key={++key}>{reason}</li>);
  return (
    <React.Fragment>
      <h1>Reasons I'm excited to learn React</h1>
      <ol>{listElement}</ol>
    </React.Fragment>
  );
}

class CustomComponent2 extends React.Component {
  constructor(props) {
    super(props);

  }

  render () {
    return (
      <React.Fragment>
        <Header />
        <Contents />
        <Footer />
      </React.Fragment>
    );
  }
};

export default CustomComponent2;