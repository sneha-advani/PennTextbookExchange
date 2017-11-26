import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {logged: 'out', register: false}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    if (this.state.register) {
      fetch('/register')
      .then(res => res.json())
      .then(resJson => this.setState({logged: resJson.logged, register: true}));
    }
    else {
      fetch('/login')
      .then(res => res.json())
      .then(resJson => this.setState({logged: resJson.logged, register: false}));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.register) {
      fetch('/register', {method: 'POST', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res));
    } else {
      fetch('/login', {method: 'POST', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res));
    }
    
  }

  handleRegister(event) {
    event.preventDefault();
    if (this.state.register) {
      this.setState({logged: 'out', register: false});
    } else {
      this.setState({logged: 'out', register: true});
    }
    
  }

  render() {
    return (
      <div className="App">
      <h1 className="homelogo">Penn Textbook Exchange</h1>
          <p>Welcome to Penn Textbook Exchange - a place for you to easily buy and sell used textbooks for classes at Penn. Browse our repository of textbooks for the book you need for a specific Penn class at a competitive price, and get connected with a Penn student from whom you can pick up the book on campus!</p>
          <p>You are currently logged {this.state.logged}.</p>
          <form onSubmit={this.handleSubmit}>
          <p>Username<br />
            <input type="text" name="username"/></p>
            <p>Password<br />
            <input type="password" name="password" /></p>
            <p><input type="submit" /></p>
          </form>
          <button type="button" onClick={this.handleRegister}>{this.state.register ? 'Log In' : 'Create Account'}</button>
      </div>
    );
  }
}

export default App;
