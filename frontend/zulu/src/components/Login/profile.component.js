import React, { Component } from "react";
import AuthService from "../../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = { currentUser: AuthService.getCurrentUser() };

  }


  onChangePassword(e) {
    this.state = {
      currentUser: {
        password: e.target.value
      }
    }
  }

  vpassword = value => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 40 characters.
        </div>
      );
    }
  };


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

        <div className="form-group">
                  <label htmlFor="password">Update Password:</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value="New password"
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
        </div>

        <p>
          <strong>About Me:</strong>{" "}
          {this.state.currentUser.fullname} ! What can you tell us about you?
        </p>




      </div>
    );
  }
}