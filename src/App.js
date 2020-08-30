import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import "./App.css";
import Post from "./components/Post";
import { makeStyles } from "@material-ui/core/styles";
import { db, auth } from "./firebase";
import { Button, Input,Modal } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: "50%",
		left: "50%",
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = React.useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				console.log(authUser);
				setUser(authUser);
			} else {
				setUser(null);
			}
		});
		return () => {
			unsubscribe();
		};
	}, [user, username]);
	useEffect(() => {
		db.collection("posts").onSnapshot((snapshot) => {
			setPosts(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					post: doc.data(),
				}))
			);
		});
	}, [posts]);

	const signUp = (event) => {
		event.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        alert(error.message)
      })
    setOpenSignIn(false);
  }

	return (
    <div className="App">
      {user?.displayName ?
      <ImageUpload username={user.displayName}/>
      :
      <h3>sorry you need to login!!</h3>
      }
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								src={logo}
								alt="instagramlogo"
								className="app__headerImage"
							/>
						</center>
						<Input
							type="text"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal
				open={openSignIn}
				onClose={() => setOpenSignIn(false)}
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								src={logo}
								alt="instagramlogo"
								className="app__headerImage"
							/>
						</center>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>
			<div className="header">
				<img src={logo} alt="" className="headerImage" />
				{user ? (
					<Button
						onClick={() => {
							auth.signOut();
						}}
					>
						Logout
					</Button>
        ) : (
            <div className="app__loginContainer">

              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
				)}
			</div>
			<br />

			{posts.map(({ id, post }) => (
				<Post
					key={id}
					username={post.username}
					caption={post.caption}
					imageUrl={post.imageUrl}
				/>
			))}
		</div>
	);
}

export default App;
