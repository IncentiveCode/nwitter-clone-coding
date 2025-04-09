import styled from "styled-components"

export const Wrapper = styled.div `
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 512px;
	padding: 50px 0px;
`;

export const Title = styled.h1 `
	font-size: 42px;
	color: white;
	padding-bottom: 20px;
`;

export const Logo = styled.img `
	width: 256px;
	height: 256px;
`;

export const Form = styled.form `
	margin-top: 50px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
`;

export const Input = styled.input `
	margin: 0 10px;
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 90%;
	font-size: 16px;
	&[type="submit"] {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`;

export const Error = styled.span `
	font-weight: 600;
	color: tomato;
`;

export const Switcher = styled.span `
	margin-top: 20px;
	a {
		color: #c2dfe3;
	}
`;