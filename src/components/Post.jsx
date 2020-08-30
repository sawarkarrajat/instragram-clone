import React from "react";
import "../css/Post.css";
import Avatar from "@material-ui/core/Avatar";
function Post(props) {
	return (
		<div className="post">
			<div className="post__header">
				<Avatar className="post__avatar" alt="personavatar" src={props.imageUrl} />
        <h3>{props.username}</h3>
			</div>
			<img src={props.imageUrl} alt="person" className="post__image" />
			<h4 className="post__text">
        <strong>{props.username}</strong> {props.caption}
			</h4>
		</div>
	);
}

export default Post;
