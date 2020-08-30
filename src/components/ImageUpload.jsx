import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { db, storage } from "../firebase";
import firebase from "firebase";
function ImageUpload(props) {
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.error(error.message);
			},
			() => {
        storage.ref("images").child(image.name).getDownloadURL().then(url => {
          db.collection("posts").add({
            // timestamp: firebase.firestore.FieldValue.serverTimestamp,
            caption: caption,
            imageUrl: url,
            username: props.username,
          });
          setProgress(0);
          setCaption("");
          setImage(null);
        });
			}
		);
	};
	return (
    <div className="imageUpload__container">
      <progress value={progress} max="100"/>
      <input type="text" placeholder="Enter a Caption.." onChange={(e)=>{setCaption(e.target.value)}}/>
			<input type="file" onChange={(e)=>handleChange(e)} />
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
}

export default ImageUpload;
