import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import UpdateTweetForm from "./update-tweet-form";

const Wrapper = styled.div<{ isUpdating: boolean }>`
	display: grid;
	grid-template-columns: ${({isUpdating}) => (isUpdating ? "1fr" : "3fr 1fr")};
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
`;

const Column = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 상단-하단 요소 간에 공간 배분 */
`;

const Photo = styled.img `
	width: 100px;
	height: 100px;
	border-radius: 15px;
`;

const Username = styled.p `
	font-weight: 600;
	font-size: 15px;
`;

const Payload = styled.p `
	margin: 10px 0px;
	font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const UpdateButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const ButtonBox = styled.div`
    margin-top: 10px;
`;

export default function Tweet({username, attachedImage, tweet, userId, id }: ITweet) {
	const user = auth.currentUser;
	const [isUpdate, setUpdate] = useState(false);

	const onUpdate = () => {
		setUpdate((current) => !current);
    }

    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");

        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
        } catch (e) {
            console.log(e);
        } 
    }

	return (
		<Wrapper isUpdating={isUpdate}>
			<Column>
				<Username>{username}</Username>
				<Payload>{tweet}</Payload>
				{isUpdate && <UpdateTweetForm id={id} setUpdate={setUpdate} afterFile={attachedImage} afterTweet={tweet}/>}
                {user?.uid === userId && (
                    <ButtonBox>
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                        <UpdateButton onClick={onUpdate}>{isUpdate ? "Cancel" : "Update"}</UpdateButton>
                    </ButtonBox>
                )}
			</Column>
			<Column>
				{
					attachedImage 
						? <Photo src={attachedImage} />
						: null
				}
			</Column>
		</Wrapper>
	)
}