import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
	margin-top: 50px;
	background-color: white;
	font-weight: 600;
	width: 90%;
	color: black;
	padding: 10px 20px;
	border-radius: 50px;
	border: 0;
	display: flex;
	gap: 5px;
	align-items: center;
	justify-content: center;

	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
`;

const Logo = styled.img`
	height: 25px;
`;

export default function GitHubButton() {
	const navigate = useNavigate();

	const onClick = async () => {
		try {
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider);
			
			// redirect to the home page
			navigate("/");
		}
		catch (e) {
			console.log(e);
		}
	}

	return (
		<Button onClick={onClick}>
			<Logo src="../../github-mark.svg" />
			Continue with Github
		</Button>
	);
}