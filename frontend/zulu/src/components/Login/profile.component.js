import React, { Component } from "react";
import AuthService from "../../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = { currentUser: AuthService.getCurrentUser() };

  }




  render() {
    console.log(this.state.currentUser);
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{this.state.currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Full name:</strong>{" "}
          {this.state.currentUser.fullname}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {this.state.currentUser.email}
        </p>

        <p>
          <strong>About Me:</strong>{" "}
          {this.state.currentUser.fullname} ! What can you tell us about you?
        </p>


      </div>
    );
  }
}