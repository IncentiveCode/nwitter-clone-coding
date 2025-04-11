import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebase";
import { AttachFileButton, AttachFileInput, Form, SubmitButton, TextArea } from "./tweet-form-components";

export default function PostTweetForm() {
	const [isLoading, setLoading] = useState(false);
	const [tweet, setTweet] = useState("");
	// const [file, setFile] = useState<File|null>(null);
	const [file, setFile] = useState("");

	const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	}
	const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files && files.length === 1) {
			const reader = new FileReader();
			reader.onloadend = () => {
				// setFile(files[0]);
				setFile(reader.result as string);
			}
			reader.readAsDataURL(files[0]);
		}
	}
	const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const user = auth.currentUser;
		if (!user || isLoading || tweet === "" || tweet.length > 140) return;

		try {
			setLoading(true);
			await addDoc(collection(db, "tweets"), {
				tweet,
				createdAt: Date.now(),
				username: user.displayName || "Anonymous",
				userId: user.uid,
				attachedImage: file,
			});
		} catch(e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form onSubmit={onSubmit}>
			<TextArea rows={5} maxLength={140} value={tweet} onChange={onChange} placeholder="What is happening?"/>
			<AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add Photo"}</AttachFileButton>
			<AttachFileInput 
				type="file" 
				id="file" 
				accept="image/*" 
				onChange={onFileChange}
			/>
			<SubmitButton
				type="submit" 
				value={isLoading ? "Posting..." : "Post Tweet"}
			/>
		</Form>
	);
}