import { collection, limit, onSnapshot, orderBy, query, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
	attachedImage?: string;
	tweet: string;
	userId: string;
	username: string;
	createdAt: number;
	id: string;
}

const Wrapper = styled.div `
	display: flex;
	gap: 10px;
	flex-direction: column;
	overflow-y: scroll;
`;

export default function Timeline() {
	const [tweets, setTweet] = useState<ITweet[]>([]);

	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;

		const fetchTweets = async() => {
			const q = query(
				collection(db, "tweets"),
				orderBy("createdAt", "desc"),
				limit(25)
			);

			// fetch
			/**
			const snapshot = await getDocs(q);
			const tweets = snapshot.docs.map((doc) => {
				const { tweet, createdAt, userId, username, attachedImage } = doc.data();
				return {
					tweet, createdAt, userId, username, attachedImage,
					id: doc.id
				}
			});
			setTweet(tweets);
			*/

			// snapshot
			unsubscribe = await onSnapshot(q, (snapshot) => {
				const tweets = snapshot.docs.map((doc) => {
					const { tweet, createdAt, userId, username, attachedImage } = doc.data();
					return {
						tweet, createdAt, userId, username, attachedImage,
						id: doc.id
					}
				});
				setTweet(tweets);
			});
		};

		fetchTweets();

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		}
	}, []);

	return (
		<Wrapper>
			{tweets.map((t) => (
				<Tweet key={t.id} {...t} />
			))}
		</Wrapper>
	);
}