import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { AttachFileButton, AttachFileInput, Form, imageMaxMB, imageMaxSize, SubmitButton, TextArea } from "./tweet-form-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostTweetForm() {
	const [isLoading, setLoading] = useState(false);
	const [tweet, setTweet] = useState("");

	// firebase storage 를 사용하는 경우
	const [file, setFile] = useState<File|null>(null);
	// firebase storage 를 안 쓰고 base64 압축을 사용하는 경우.
	// const [file, setFile] = useState("");

	const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	}

	// firebase storage 를 사용하는 경우
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		if (files && files.length === 1) {
			// image size check
			// console.log("file size : ", files[0].size);
			if (files[0].size > imageMaxSize) {
				alert(`Please use images less than ${imageMaxMB}MB.`);
			} else {
				setFile(files[0]);
			}
		}
	}

	// firebase storage 를 안 쓰고 base64 압축을 사용하는 경우.
	/**
	const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

		if (files && files.length === 1) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFile(reader.result as string);
			}
			reader.readAsDataURL(files[0]);
		}
	}
	 */

	const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const user = auth.currentUser;
		if (!user || isLoading || tweet === "" || tweet.length > 140) return;

		try {
			setLoading(true);
			
			const doc = await addDoc(collection(db, "tweets"), {
				tweet,
				createdAt: Date.now(),
				username: user.displayName || "Anonymous",
				userId: user.uid,
			});

			// firebase storage 를 사용하는 경우
			if (file) {
				const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
				const result = await uploadBytes(locationRef, file);
				const url = await getDownloadURL(result.ref);
				await updateDoc(doc, {
					photo: url,
				});
			}

			setTweet("");
			setFile(null);

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