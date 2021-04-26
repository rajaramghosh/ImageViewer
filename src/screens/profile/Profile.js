import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import "./Profile.css";
import Header from "../../common/header/Header";
import Post from "../post/Post";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import Edit from "@material-ui/icons/Edit";
import Modal from "react-modal";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ProfilePic from "../../assets/profilePic.png";

const classes = (theme) => ({
  avatar: {
    width: "144px",
    height: "144px",
    marginRight: "30px",
    border: "1px solid white",
  },
  fabEdit: {
    margin: "0 10px",
  },
});

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

/* Profile Class retrieves the Media and User Details and implements the 
functions for Likes and Comments and render those */
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: {
        username: "abc",
        postCount: 10,
        followerCount: 10,
        followingCount: 20,
        fullName: "Rajaram Ghosh",
      },
      postsData: [],
      isEditNameModalOpen: false,
      editNameInput: "",
      usernameRequired: "dispNone",
      isPostModalOpen: false,
      modalPost: null,
    };
  }

  openEditNameModalHandler = () => {
    this.setState({ isEditNameModalOpen: true });
  };

  closeEditNameModalHandler = () => {
    this.setState({ isEditNameModalOpen: false });
  };

  editNameInputChangeHandler = (event) => {
    this.setState({ editNameInput: event.target.value });
  };

  editNameSubmitHandler = (event) => {
    this.state.editNameInput === ""
    ? this.setState({ usernameRequired: "dispBlock" })
    : this.setState({ usernameRequired: "dispNone" });

    if (this.state.editNameInput === "") {
      return;
    }
    const { profileData, editNameInput } = this.state;
    profileData.fullName = editNameInput;
    this.setState({
      profileData,
      editNameInput: "",
    });
    this.closeEditNameModalHandler();
  };

  openPostModalHandler = (post) => {
    this.setState({
      isPostModalOpen: true,
      modalPost: post,
    });
  };

  closePostModalHandler = () => {
    this.setState({ isPostModalOpen: false });
  };

  componentDidMount() {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${sessionStorage.getItem(
      "access-token"
    )}`;
    fetch(url, {
      headers: {
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          postsData: json.data,
          postCount: json.data.length,
        });
      })
      .catch((err) => console.log({ err }));

    const userUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${sessionStorage.getItem(
      "access-token"
    )}`;
    fetch(userUrl, {
      headers: {
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          userName: json.username,
        });
      })
      .catch((err) => console.log({ err }));
  }

  render() {
    const { profileData, postsData } = this.state;
    const { classes } = this.props;
    const isUserLoggedIn = sessionStorage.getItem("access-token") !== null;
    if (!isUserLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header />
        <div className="page-container">
          <div className="profile-container">
            <Avatar
              alt="Profile Picture"
              variant="circular"
              src={ProfilePic}
              className={classes.avatar}
            />
            <div className="user-info-container">
              <span className="username">{this.state.userName}</span>
              <div className="profile-stats">
                <span className="stat">Posts: {this.state.postCount}</span>

                <span className="stat">
                  Follows: {profileData.followingCount}
                </span>
                <span className="stat">
                  Followed By: {profileData.followerCount}
                </span>
              </div>
              <span className="fullname">{profileData.fullName}</span>
              <Fab
                color="secondary"
                aria-label="edit"
                className={classes.fabEdit}
              >
                <Edit onClick={this.openEditNameModalHandler} />
                <Modal
                  style={modalStyle}
                  ariaHideApp={false}
                  isOpen={this.state.isEditNameModalOpen}
                  contentLabel="editNameModal"
                  onRequestClose={this.closeEditNameModalHandler}
                >
                  <span className="edit-name-modal-title">Edit</span>
                  <br />
                  <br />
                  <FormControl required className={classes.modalFormControl}>
                    <InputLabel htmlFor="full-name">Full Name</InputLabel>
                    <Input
                      type="text"
                      id="full-name"
                      onChange={this.editNameInputChangeHandler}
                      value={this.state.editNameInput}
                    />
                    <FormHelperText className={this.state.usernameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.editNameSubmitHandler}
                  >
                    Update
                  </Button>
                </Modal>
              </Fab>
            </div>
          </div>
          <GridList
            className="posts-grid"
            cols={3}
            spacing={4}
            cellHeight="auto"
          >
            {postsData &&
              postsData.map((post) => (
                <GridListTile key={post.id}>
                  <div
                    className="post-image-container"
                    onClick={() => this.openPostModalHandler(post)}
                  >
                    <img
                      className="post-image"
                      src={post.media_url}
                      alt="PostIma"
                    />
                  </div>
                  <Modal
                    style={modalStyle}
                    ariaHideApp={false}
                    isOpen={this.state.isPostModalOpen}
                    contentLabel="postModal"
                    onRequestClose={this.closePostModalHandler}
                  >
                    <Post
                      postData={this.state.modalPost}
                      sourcePage="profile"
                    />
                  </Modal>
                </GridListTile>
              ))}
          </GridList>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(classes)(Profile));
