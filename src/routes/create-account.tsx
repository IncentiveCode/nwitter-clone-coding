import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from '../firebase.ts';
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Logo, Switcher, Title, Wrapper } from "../components/auth-components.ts";
import GitHubButton from "../components/github-btn.tsx";

export default function CreateAccount() {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);	
	const [name, setName] = useState("");
	const [email, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {name, value} } = e;
		if (name === "name") { setName(value); }
		else if (name === "email") { setMail(value); }
		else if (name === "password") { setPassword(value); }
	};

	const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");

		if (isLoading ||
			name === "" ||
			email === "" || 
			password === "")
			return;

		try {
			setLoading(true);

			// create an account
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			console.log(credential.user);

			// set the name of the user
			await updateProfile(credential.user, {
				displayName: name,
			});

			// redirect to the home page
			navigate("/");
		} catch(e) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return <Wrapper>
		<Title>Join US !</Title>
		<Logo src="../../logo.png" />
		<Form onSubmit={onSubmit}>
			<Input name="name" 
				value={name} 
				placeholder="Name" 
				type="text" 
				onChange={onChange}
				required/>
			<Input name="email" 
				value={email} 
				placeholder="e-mail" 
				type="email" 
				onChange={onChange}
				required/>
			<Input name="password" 
				value={password} 
				placeholder="Password" 
				type="password" 
				onChange={onChange}
				required/>
			<Input 
				type="submit" 
				value={isLoading ? "Loading..." : "Create Account"} />
		</Form>
		{error != "" ? <Error>{error}</Error> : null}

		<Switcher>
			Already have an account? <Link to="/login">Log in &rarr;</Link>
		</Switcher>

		<GitHubButton />
	</Wrapper>
}