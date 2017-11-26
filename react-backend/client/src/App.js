import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';


class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/books" component={ViewBooks} />
          <Route path="/new" component={NewBook} />
        </div>
      </Router>
    );
  }
}

class ViewBooks extends Component {
  constructor() {
    super();
    this.state = {authenticated: false, books: []};
  }

  componentDidMount() {
    fetch('/books')
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated, books: resJson.books}));
  }

  render() {
    return(
      <div className="ViewBooks">
        <h1>Penn Textbook Exchange</h1>
        <h2>Books</h2>
           <p>{this.state.authenticated ? "" : "Please log in to view books." }</p>
           {this.state.books.map((book) => (<h3 className='book'>book</h3>))}
           {this.state.authenticated ? <Link to="/new">Create new post</Link> : <Link to="/">Back</Link>}
      </div>
    );
  }
}

class NewBook extends Component {
  handleSubmit(event) {
    event.preventDefault();
    fetch('/books', {method: 'POST', body: JSON.stringify({'title': event.target.title.value, 'class': event.target.class.value, 'price': event.target.price.value, 'email': event.target.email.value, 'details': event.target.details.value}), headers: {"Content-Type": "application/json"}})
      .then(res => console.log(res));    
  }

  render() {
    return(
    <div className="NewBook">
      <h1>Penn Textbook Exchange</h1>
      <h2>Create New Book</h2>
      <form onSubmit={this.handleSubmit}>
          <p>Title<br />
            <input type="text" name="title"/></p>
            <p>Class<br />
            <input type="text" name="class" /></p>
            <p>Price<br />
            <input type="text" name="price" /></p>
            <p>Email<br />
            <input type="text" name="email" /></p>
            <p>Details<br />
            <input type="text" name="details" /></p>
            <p><input type="submit" /></p>
          </form>
          <Link to="/books">View Books</Link>

    </div>
    );
  }
}


class Home extends Component {
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

          <p>You are currently logged {this.state.logged}. Click <Link to="/books">here</Link> to view books.</p>
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
