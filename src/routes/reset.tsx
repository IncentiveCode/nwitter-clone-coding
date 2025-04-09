import { useState } from "react";
import { auth } from '../firebase.ts';
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components.ts";
import GitHubButton from "../components/github-btn.tsx";

export default function Reset() {
	const [isLoading, setLoading] = useState(false);	
	const [email, setMail] = useState("");
	const [error, setError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {name, value} } = e;
		if (name === "email") { setMail(value); }
	};

	const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");

		if (isLoading ||
			email === "")
			return;

		try {
			setLoading(true);
			sendPasswordResetEmail(auth, email);
			alert('Please check your e-mail.');
		} catch(e) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return <Wrapper>
		<Title>Reset password</Title>
		<Form onSubmit={onSubmit}>
			<Input name="email" 
				value={email} 
				placeholder="e-mail" 
				type="email" 
				onChange={onChange}
				required/>
			<Input 
				type="submit" 
				value={isLoading ? "Loading..." : "Request reset"} />
		</Form>
		{error != "" ? <Error>{error}</Error> : null}

		<Switcher>
			Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
		</Switcher>

		<Switcher>
			Already have an account? <Link to="/login">Log in &rarr;</Link>
		</Switcher>

		<GitHubButton />
	</Wrapper>
}