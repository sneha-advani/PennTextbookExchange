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
          <Route path="/account" component={MyBooks} />
        </div>
      </Router>
    );
  }
}

class Book extends Component {
  render () {
    return(
      <div className="Book">
      <h3>{this.props.title}</h3>
      <p>   Class: {this.props.class}</p>
      <p>   Price: ${this.props.price}</p>
      <p>   Other details: {this.props.details}</p>
      {this.props.type ? <button onClick={this.props.deleteClick} number={this.props.number}>Delete</button> : <span><button onClick={this.props.contactClick} number={this.props.number}>Contact</button>  <button number={this.props.number}>Interested</button></span>}
    </div>
    );
  }
}

class MyBooks extends Component {
  constructor() {
    super();
    this.state = {authenticated: false, username: '', books: []};
    this.linkClick = this.linkClick.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
  }

  componentDidMount() {
    fetch('/account')
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated, username: resJson.username, books: resJson.books}));
  }

  loginClick(event) {
    fetch('/account', {method: 'POST', body: JSON.stringify({'button' : 'login'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  linkClick(event) {
    fetch('/account', {method: 'POST', body: JSON.stringify({'button' : 'link'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  deleteClick(event) {
    fetch('/account', {method: 'POST', body: JSON.stringify({'button' : 'delete', 'postID': this.state.books[event.target.getAttribute('number')]._id}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res))
      .then(fetch('/account')
        .then(res => res.json())
        .then(resJson => this.setState({authenticated: resJson.authenticated, username: resJson.username, books: resJson.books})));
  }

  render() {
    return(
      <div className="MyBooks">
      <div className="header">
            <h1 className="headerText">Penn Textbook Exchange</h1>
      </div>
        <p></p>
        <p></p>
        <h2>My Books</h2>
           {this.state.authenticated ? "" : <span><p>Please log in to view your account.</p><Link to="/" onClick={this.loginClick}>Login</Link><br /></span> }
           {this.state.books.map((book, index) => <Book deleteClick={this.deleteClick} title={book.title} price={book.price} class={book.class} email={book.email} details = {book.details} number={index} type={true} />)}
           <Link to="/books" onClick={this.linkClick}>Back to all books</Link>
      <div className="footer">
        <p>Created by Sneha Advani</p>
      </div>
      </div>
    );
  }

}

class ViewBooks extends Component {
  constructor() {
    super();
    this.state = {authenticated: false, books: []};
    this.linkClick = this.linkClick.bind(this);
    this.accountClick = this.accountClick.bind(this);
    this.contactClick = this.contactClick.bind(this);
  }

  linkClick(event) {
    fetch('/books', {method: 'POST', body: JSON.stringify({'button' : 'link'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  accountClick(event) {
    fetch('/books', {method: 'POST', body: JSON.stringify({'button' : 'account'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  logoutClick(event) {
    fetch('/books', {method: 'POST', body: JSON.stringify({'button' : 'logout'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  contactClick(event) {
    window.location.href = "mailto:" + this.state.books[event.target.getAttribute('number')].email;
  }

  componentDidMount() {
    fetch('/books')
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated, books: resJson.books}));
  }

  render() {
    return(
      <div className="ViewBooks">
        <div className="header">
            <h1 className="headerText">Penn Textbook Exchange</h1>
        </div>
        <p></p>
        <p></p>
        <h2>Available Books</h2>
           <p>{this.state.authenticated ? "" : "Please log in to view books." }</p>
           {this.state.books.map((book, index) => <Book contactClick={this.contactClick} number={index} type={false} title={book.title} price={book.price} email={book.email} details={book.details} />)}
           {this.state.authenticated ? <span><Link to="/new" onClick={this.linkClick}>Create new post</Link><span> </span><Link to="/account" onClick={this.accountClick}>View my books</Link><span> </span><Link to="/" onClick={this.logoutClick}>Log out</Link></span> : <Link to="/">Back</Link>}
           <p></p>
           <div className="footer">
              <p>Created by Sneha Advani</p>
           </div>
      </div>
    );
  }
}

class NewBook extends Component {
  constructor() {
    super();
    this.state = {authenticated: false};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.linkClick = this.linkClick.bind(this);
  }

  componentDidMount() {
    fetch('/new')
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated}));
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/new', {method: 'POST', body: JSON.stringify({'title': event.target.title.value, 'class': event.target.class.value, 'price': event.target.price.value, 'email': event.target.email.value, 'details': event.target.details.value}), headers: {"Content-Type": "application/json"}})
      .then(res => console.log(res))
      .then(event.target.reset());
  }

  linkClick(event) {
    fetch('/new', {method: 'POST', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
      .then (res => console.log(res));
  }

  render() {
    return(
    <div className="NewBook">
      <div className="header">
            <h1 className="headerText">Penn Textbook Exchange</h1>
      </div>
        <p></p>
        <p></p>
      <h2>Create New Book</h2>
      {!this.state.authenticated ? <p>Please log in to create a post.</p> :
      <form className="formStyle" onSubmit={this.handleSubmit}>
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
        }
          <Link to="/books" onClick={this.linkClick} >View Books</Link>
          <div className="footer">
              <p>Created by Sneha Advani</p>
           </div>

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
    this.linkClick = this.linkClick.bind(this);
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

  linkClick(event) {
    if (this.state.register) {
      fetch('/register', {method: 'POST', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res));
    } else {
      fetch('/login', {method: 'POST', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.register) {
      fetch('/register', {method: 'POST', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res));
    } else {
      fetch('/login', {method: 'POST', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
        .then(res => console.log(res))
        .then (fetch('/login')
          .then(res => res.json())
          .then(resJson => this.setState({logged: resJson.logged, register: false})));
    }
    event.target.reset();
    
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
          <p className="text">Welcome to Penn Textbook Exchange - a place for you to easily buy and sell used textbooks for classes at Penn. Browse our repository of textbooks for the book you need for a specific Penn class at a competitive price, and get connected with a Penn student from whom you can pick up the book on campus!</p>

          <p>You are currently logged {this.state.logged}. Click <Link to="/books" onClick={this.linkClick}>here</Link> to view books.</p>
          <span className="formStyle">
          <h2>{this.state.register ? "Register" : "Login"}</h2>
          <form className="login" onSubmit={this.handleSubmit}>
          <p>Username<br />
            <input type="text" name="username"/></p>
            <p>Password<br />
            <input type="password" name="password" /></p>
            <p><input type="submit" /></p>
          </form>
          </span>
          <button type="button" onClick={this.handleRegister}>{this.state.register ? 'Log In' : 'Create Account'}</button>
      </div>
    );
  }
}

export default App;
