import {useEffect, useLayoutEffect, useState} from "react";
import {doc,updateDoc} from "firebase/firestore";
import {auth, db} from "../firebase.ts";
import { AttachFileButton, AttachFileInput, Form, SubmitButton, TextArea } from "./tweet-form-components.ts";

interface UpdateTweetFormProps {
    id: string;
    setUpdate: (value: boolean) => void;
    afterTweet: string;
    afterFile?: string;
}

export default function UpdateTweetForm({id, setUpdate, afterFile, afterTweet} : UpdateTweetFormProps) {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<string | null>(null);
    const [changeFile, setChangeFile] = useState(false);
    const [message, setMessage] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files && files.length === 1) {
			const reader = new FileReader();
			reader.onloadend = () => {
				// setFile(files[0]);
				setFile(reader.result as string);
			}
			reader.readAsDataURL(files[0]);
		}
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user || isLoading || tweet === "" || tweet.length > 140) return;

        try {
            setLoading(true);
            await updateDoc(doc(db, "tweets", id), {
                tweet,
				attachedImage: file,
                updateDate: Date.now()
            })
        } catch (e) {
            console.log(e);
        } finally {
            setUpdate(false);
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if(!afterFile) return;
        setFile(afterFile);
        setTweet(afterTweet);
    }, []);

    useEffect(() => {
        if(changeFile && file) {
            setMessage("Update Photo ✅");
        } else if(!changeFile && file) {
            setMessage("Added Photo ✅   Do you want Change?")
        } else if(!changeFile && !file) {
            setMessage("Add Photo");
        }
    },[changeFile, file]);

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