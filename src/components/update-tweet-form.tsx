import {useEffect, useLayoutEffect, useState} from "react";
import {doc,updateDoc} from "firebase/firestore";
import {auth, db, storage} from "../firebase.ts";
import { AttachFileButton, AttachFileInput, Form, imageMaxMB, imageMaxSize, SubmitButton, TextArea } from "./tweet-form-components.ts";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface UpdateTweetFormProps {
    id: string;
    setUpdate: (value: boolean) => void;
    currentTweet: string;
    currentPhoto?: string;
}

export default function UpdateTweetForm({id, setUpdate, currentPhoto, currentTweet} : UpdateTweetFormProps) {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
	const [file, setFile] = useState<File|null>(null);
    const [photoState, setPhotoState] = useState(false);
    const [changeFile, setChangeFile] = useState(false);
    const [message, setMessage] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;

        if (files && files.length === 1) {
			if (files[0].size > imageMaxSize) {
				alert(`Please use images less than ${imageMaxMB}MB.`);
			} else {
				setFile(files[0]);
                setChangeFile(true);
			}
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user || isLoading || tweet === "" || tweet.length > 140) return;

        try {
            setLoading(true);
            let url = "";

            if (file) {
				const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
				const result = await uploadBytes(locationRef, file);
				url = await getDownloadURL(result.ref);
            }

            await updateDoc(doc(db, "tweets", id), {
                tweet,
                updateDate: Date.now(),
                photo: url
            })

        } catch (e) {
            console.log(e);
        } finally {
            setUpdate(false);
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        setTweet(currentTweet);

        if(!currentPhoto) return;
        setPhotoState(true);
    }, [currentTweet, currentPhoto]);

    useEffect(() => {
        if(changeFile && photoState) {
            setMessage("Update Photo ✅");
        } else if(!changeFile && photoState) {
            setMessage("Added Photo ✅   Do you want Change?")
        } else if(!changeFile && !photoState) {
            setMessage("Add Photo");
        }
    },[changeFile, photoState]);

    return (
        <Form onSubmit={onSubmit}>
            <TextArea rows={5} maxLength={140} onChange={onChange} value={tweet}
                        placeholder={'What is happening?'}/>
            <AttachFileButton htmlFor={'updateFile'}>{message}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type={'file'} id={'updateFile'} accept={'image/*'}/>
            <SubmitButton type={"submit"} value={isLoading ? 'Updating...' : 'Update Tweet'}/>
        </Form>
    );
}