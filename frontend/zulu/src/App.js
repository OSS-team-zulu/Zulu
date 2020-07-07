import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import MapComponent from "./components/Map/MapGeojsonMarkers.jsx";
import Register from  "./components/Login/register.component";
import LoginWithRouter from "./components/Login/login.component";
import Profile from "./components/Login/profile.component";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser} = this.state;

    return (
      <Router>
        <div >
            <div>
                <nav className="navbar navbar-expand navbar-light bg-primary">
                    <Link to={"/"} className="navbar-brand">
                    Zulu App
                    </Link>
                    <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/map"} className="nav-link">
                        Map
                        </Link>
                    </li>

                    </div>

                    {currentUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                        <Link to={"/profile"} className="nav-link">
                            {currentUser.username}
                        </Link>
                        </li>
                        <li className="nav-item">
                        <a href="/login" className="nav-link" onClick={this.logOut}>
                            Logout
                        </a>
                        </li>
                    </div>
                    ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                        <Link to={"/login"} className="nav-link">
                            Login
                        </Link>
                        </li>

                        <li className="nav-item">
                        <Link to={"/register"} className="nav-link">
                            Sign Up
                        </Link>
                        </li>
                    </div>
                    )}
                </nav>

          <div >
            <Switch>
              <Route exact path={["/", "/map"]} component={MapComponent} />
              <Route exact path="/login" component={LoginWithRouter} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </div>
        </div>

        </div>
      </Router>
    );
  }
}

export default App;