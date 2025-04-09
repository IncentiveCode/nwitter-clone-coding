import { useState } from "react";
import { auth } from '../firebase.ts';
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Error, Form, Input, Logo, Switcher, Title, Wrapper } from "../components/auth-components.ts";
import GitHubButton from "../components/github-btn.tsx";

export default function Login() {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);	
	const [email, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: {name, value} } = e;
		if (name === "email") { setMail(value); }
		else if (name === "password") { setPassword(value); }
	};

	const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");

		if (isLoading ||
			email === "" || 
			password === "")
			return;

		try {
			setLoading(true);

			await signInWithEmailAndPassword(auth, email, password);

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
		<Title>Log into</Title>
		<Logo src="../../logo.png" />
		<Form onSubmit={onSubmit}>
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
				value={isLoading ? "Loading..." : "Login"} />
		</Form>
		{error != "" ? <Error>{error}</Error> : null}

		<Switcher>
			Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
		</Switcher>

		<Switcher>
			Forgot password? <Link to="/reset">password reset &rarr;</Link>
		</Switcher>

		<GitHubButton />
	</Wrapper>
}