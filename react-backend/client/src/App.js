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
      <p>   <strong>Class:</strong> {this.props.class}</p>
      <p>   <strong>Price:</strong> ${this.props.price}</p>
      <p>   <strong>Other details:</strong> {this.props.details}</p>
      {this.props.type ? <span><p>   <strong>Interested: </strong>{this.props.likes}</p><button onClick={this.props.deleteClick} number={this.props.number}>Delete</button></span> : <span><button onClick={this.props.contactClick} number={this.props.number}>Contact</button>  <button onClick={this.props.interestedClick} number={this.props.number}>Interested ({this.props.likes})</button></span>}
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
    this.logoutClick = this.logoutClick.bind(this);
  }

  componentDidMount() {
    fetch('/account', { credentials: 'include' })
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated, username: resJson.username, books: resJson.books}));
  }

  loginClick(event) {
    fetch('/account', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'login'}), headers: {"Content-Type": "application/json"}})
  }

  linkClick(event) {
    fetch('/account', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'link'}), headers: {"Content-Type": "application/json"}})
  }

  logoutClick(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'logout'}), headers: {"Content-Type": "application/json"}})
  }

  deleteClick(event) {
    fetch('/account', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'delete', 'postID': this.state.books[event.target.getAttribute('number')]._id}), headers: {"Content-Type": "application/json"}})
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
           {this.state.books.map((book, index) => <Book key={index} deleteClick={this.deleteClick} title={book.title} price={book.price} class={book.class} email={book.email} details = {book.details} number={index} type={true} likes={book.likes} />)}
           {this.state.authenticated ? <Link to="/" onClick={this.logoutClick}>Log out</Link> : <span><p>Please log in to view your account.</p><Link to="/" onClick={this.loginClick}>Login</Link><br /></span> }
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
    this.state = {authenticated: false, books: [], searchType: 'title'};
    this.linkClick = this.linkClick.bind(this);
    this.accountClick = this.accountClick.bind(this);
    this.contactClick = this.contactClick.bind(this);
    this.search = this.search.bind(this);
    this.searchButton = this.searchButton.bind(this);
    this.interestedClick = this.interestedClick.bind(this);
  }

  linkClick(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'link'}), headers: {"Content-Type": "application/json"}})
  }

  accountClick(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'account'}), headers: {"Content-Type": "application/json"}})
  }

  logoutClick(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'logout'}), headers: {"Content-Type": "application/json"}})
  }

  contactClick(event) {
    window.location.href = "mailto:" + this.state.books[event.target.getAttribute('number')].email;
  }

  interestedClick(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button': 'interested', 'postID': this.state.books[event.target.getAttribute('number')]._id}), headers: {"Content-Type": "application/json"}})
      .then(fetch('/books', { credentials: 'include'})
        .then(res => res.json())
        .then(resJson => this.setState({authenticated: resJson.authenticated, books: resJson.books})));
  }

  search(event) {
    fetch('/books', {method: 'POST', credentials: 'include', body: JSON.stringify({'button' : 'search', 'searchTerm': event.target.value, 'searchType': this.state.searchType}), headers: {"Content-Type": "application/json"}})
      .then(fetch('/books', { credentials: 'include'})
        .then(res => res.json())
        .then(resJson => this.setState({authenticated: resJson.authenticated, books: resJson.books})));
  }

  searchButton(event) {
    if (this.state.searchType === 'title') {
      this.setState({searchType: 'class'});
    } else {
      this.setState({searchType: 'title'});
    }
  }

  componentDidMount() {
    fetch('/books', { credentials: 'include' })
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
           {this.state.authenticated ? <span>Search by {this.state.searchType}: <input type="text" id="myInput" onKeyUp={this.search} placeholder="Search for books.." />     <button onClick={this.searchButton}>Search by {this.state.searchType === 'title' ? 'class' : 'title'}</button></span> : <p>Please log in to view books.</p> }
           {this.state.books.map((book, index) => <Book key={index} interestedClick={this.interestedClick} contactClick={this.contactClick} likes={book.likes} class={book.class} number={index} type={false} title={book.title} price={book.price} email={book.email} details={book.details} />)}
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
    fetch('/new', { credentials: 'include' })
      .then(res => res.json())
      .then(resJson => this.setState({authenticated: resJson.authenticated}));
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/new', {method: 'POST', credentials: 'include', body: JSON.stringify({'title': event.target.title.value, 'class': event.target.class.value, 'price': event.target.price.value, 'email': event.target.email.value, 'details': event.target.details.value}), headers: {"Content-Type": "application/json"}})
      .then(event.target.reset());
  }

  linkClick(event) {
    fetch('/new', {method: 'POST', credentials: 'include', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
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
          <Link to="/books" onClick={this.linkClick} >View all books</Link>
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
      fetch('/register', {credentials: 'include'})
        .then(res => res.json())
        .then(resJson => this.setState({logged: resJson.logged, register: true}));
    }
    else {
      fetch('/login', {credentials: 'include'})
        .then(res => res.json())
        .then(resJson => this.setState({logged: resJson.logged, register: false}));
    }
  }

  linkClick(event) {
    if (this.state.register) {
      fetch('/register', {method: 'POST', credentials: 'include', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
    } else {
      fetch('/login', {method: 'POST', credentials: 'include', body: JSON.stringify({'button': 'link'}), headers: {"Content-Type": "application/json"}})
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.register) {
      fetch('/register', {method: 'POST', credentials: 'include', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
    } else {
      fetch('/login', {method: 'POST', credentials: 'include', body: JSON.stringify({'username': event.target.username.value, 'password': event.target.password.value}), headers: {"Content-Type": "application/json"}})
        .then (fetch('/login', { credentials: 'include' })
          .then(res => res.json())
          .then(resJson => this.setState({logged: resJson.logged, register: false}))
          .then(window.location.reload()));
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
          <div className="footer">
              <p>Created by Sneha Advani</p>
           </div>
      </div>
    );
  }
}

export default App;
