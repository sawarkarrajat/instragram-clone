import React, { useState, useEffect } from "react";
import "../css/Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";

function Post(props) {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	useEffect(() => {
		let unsubscribe;
		if (props.postId) {
			unsubscribe = db
				.collection("posts")
				.doc(props.postId)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}
		return () => {
			unsubscribe();
		};
	}, [props.postId]);
	const postComment = (event) => {
		event.preventDefault();

		db.collection("posts").doc(props.postId).collection("comments").add({
			text: comment,
			username: props.user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setComment("");
	};
	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt="personavatar"
					src={props.imageUrl}
				/>
				<h3>{props.username}</h3>
			</div>
			<img src={props.imageUrl} alt="person" className="post__image" />
			<h4 className="post__text">
				<strong>{props.username}</strong> {props.caption}
			</h4>
			<div className="post__comments">
				{comments.map((comment) => (
					<p key={comment.id}>
						<strong>{comment.username}</strong> {comment.text}
					</p>
				))}
			</div>
			{props.user && (
				<form className="post__form">
					<input
						type="text"
						className="post__input"
						placeholder="Add a comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						className="post__button"
						disabled={!comment}
						type="submit"
						onClick={postComment}
					>
						post
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
