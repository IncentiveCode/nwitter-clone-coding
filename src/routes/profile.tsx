import styled from "styled-components";
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react";
import { imageMaxMB, imageMaxSize } from "../components/tweet-form-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 20px;
`;
const AvatarUpload = styled.label `
	width: 80px;
	overflow: hidden;
	height: 80px;
	border-radius: 50%;
	background-color: #9db4c0;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		width: 50px;
	}
`;
const AvatarImg = styled.img `
	width: 100%;
`;
const AvatarInput = styled.input `
	display: none;
`;
const NameArea = styled.div `
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`;
const Name = styled.span `
	font-size: 22px;
`;
const Tweets = styled.div `
	display: flex;
	gap: 10px;
	flex-direction: column;
	width: 100%;
	overflow-y: scroll;
`;


const FormButtonArea = styled.div `
	display: flex;
	gap: 10px;
	flex-direction: row;
`;
const Form = styled.form `
	margin: 0 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
`;
const Input = styled.input `
	margin: 0 10px;
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 50%;
	font-size: 16px;
	&[type="submit"],
	&[type="button"] {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`;

export default function Profile() {
	const user = auth.currentUser;
	const [avatar, setAvatar] = useState(user?.photoURL);
	const [tweets, setTweets] = useState<ITweet[]>([]);
	const onAvatarChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
		if (!user) return;

		const { files } = e.target;
		if (files && files.length === 1) {
			const file = files[0];

			// size check
			if (file.size > imageMaxSize) {
				alert(`Please use images less than ${imageMaxMB}MB.`);
			} else {
				const locationRef = ref(storage, `avatars/${user?.uid}`);
				const result = await uploadBytes(locationRef, file);
				const avatarUrl = await getDownloadURL(result.ref);

				setAvatar(avatarUrl);
				await updateProfile(user, {
					photoURL: avatarUrl,
				});
			}
		}
	}

	// name update
	const [isLoading, setLoading] = useState(false);	
	const [isNameUpdate, setNameUpdate] = useState(false);
	const [insertedName, setName] = useState("");

	const onUpdateMode = () => {
		setName(user?.displayName ?? "");
		setNameUpdate((prev) => !prev);
	};
	const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {value} } = e;
		setName(value);
	};
	const onUpdateNickname = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user) return;
		if (isLoading || insertedName === "") return;

		try {
			setLoading(true);

			await updateProfile(user, {
				displayName: insertedName,
			});
		} catch(e) {
			if (e instanceof FirebaseError) {
				console.log(e.message);
			}
		} finally {
			setLoading(false);
			setNameUpdate(false);
		}
	};

	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;

		const fetchTweets = async () => {
			const q = query(	
				collection(db, "tweets"),
				where("userId", "==", user?.uid),
				orderBy("createdAt", "desc"),
				limit(25)
			);

			unsubscribe = onSnapshot(q, (snapshot) => {
				const tweets = snapshot.docs.map((doc) => {
					const { tweet, createdAt, userId, username, photo } = doc.data();
					return {
						tweet, createdAt, userId, username, photo,
						id: doc.id
					}
				});
				setTweets(tweets);
			});
		};

		fetchTweets();
		setName(user?.displayName ?? "");

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		}
	}, []);

	return <Wrapper>
		<AvatarUpload htmlFor="avatar">
			{avatar ? ( 
				<AvatarImg src={avatar} />
			) : ( 
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  					<path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
				</svg>
			)}
		</AvatarUpload>
		<AvatarInput 
			onChange={onAvatarChange} 
			id="avatar" 
			type="file" 
			accept="image/*" 
		/>
		{isNameUpdate ? (
			<Form onSubmit={onUpdateNickname}>
				<Input 
					name="insertedName"
					value={insertedName}
					placeholder="Please wirte your nickname"
					type="text"
					onChange={onNameChange}
					required />
				<FormButtonArea>
					<Input
						type="submit"
						value={isLoading ? "Loading..." : "Update"} />
					<Input
						type="button"
						onClick={onUpdateMode}
						value="cancel"
						disabled={isLoading ? true : false} />
				</FormButtonArea>
			</Form>
		) : (
			<NameArea>
				<Name>{user?.displayName ?? "Anonymous"}</Name>
				<Input 
					type="button"
					onClick={onUpdateMode}
					value="change nickname" />
			</NameArea>
		)}
		<Tweets>
			{tweets.map((t) => (
				<Tweet key={t.id} {...t} />
			))}
		</Tweets>
	</Wrapper>
}