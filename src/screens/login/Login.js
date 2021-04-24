import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";

import Header from "../header/Header";
import "./Login.css";

const styles = {
  card: {
    padding: "15px",
    position: "relative",
    top: "90px",
    left: "50%",
    width: "325px",
    transform: "translateX(-50%)",
  },
  title: {
    fontSize: 20,
  },
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      usernameRequired: "dispNone",
      password: "",
      passwordRequired: "dispNone",
      incorrectUsernamePassword: "dispNone",
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
    };
  }

  loginClickHandler = () => {
    this.setState({ incorrectUsernamePassword: "dispNone" });
    this.state.username === ""
      ? this.setState({ usernameRequired: "dispBlock" })
      : this.setState({ usernameRequired: "dispNone" });
    this.state.password === ""
      ? this.setState({ passwordRequired: "dispBlock" })
      : this.setState({ passwordRequired: "dispNone" });

    if (this.state.username === "" || this.state.password === "") {
      return;
    }

    if (this.state.username === "admin" && this.state.password === "admin") {
      sessionStorage.setItem("username", "admin");
      sessionStorage.setItem(
        "access-token",
        "IGQVJYN0tKM19ScjdabGt4NFpyQ0xLaGtxU0dPbFdQc281NUI1S1E3bmpWMzAwSFlBaUEwVlpra2RRdFFqOFpsei0xQzJYYWt3ZATJIWk9Od3VXUE5WWHB6eXJ2dS05QjRXcXV6TWk3cDgxV0huVzJYNF9RZAGFuNENzNUpF"
      );
      this.setState({ loggedIn: true });
      this.props.history.push("/home");
    } else {
      this.setState({ incorrectUsernamePassword: "dispBlock" });
    }
  };

  inputUsernameChangeHandler = (e) => {
    this.setState({ username: e.target.value });
  };

  inputPasswordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="main-container">
        <Header />
        <Card style={styles.card}>
          <CardContent>
            <Typography style={styles.title}> LOGIN </Typography>
            <br />
            <FormControl required style={{ width: "100%" }}>
              <InputLabel htmlFor="username"> Username </InputLabel>
              <Input
                id="username"
                type="text"
                value={this.state.username}
                onChange={this.inputUsernameChangeHandler}
              />
              <FormHelperText className={this.state.usernameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required style={{ width: "100%" }}>
              <InputLabel htmlFor="password"> Password </InputLabel>
              <Input
                id="password"
                type="password"
                onChange={this.inputPasswordChangeHandler}
                value={this.state.password}
              />
              <FormHelperText className={this.state.passwordRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <div className={this.state.incorrectUsernamePassword}>
              <span className="red"> Incorrect username and/or password </span>
            </div>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.loginClickHandler}
            >
              {" "}
              LOGIN{" "}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withRouter(Login);
