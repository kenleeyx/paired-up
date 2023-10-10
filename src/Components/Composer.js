// might want to create an edit post option also - need to change from push to update

import { useState } from "react";
import { database, storage } from "../firebase/firebase";
import { ref as sRef, uploadBytes, getDownloadURL,} from 'firebase/storage';
import { push, ref } from "firebase/database";

const DB_FEED_KEY = "feed";
const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

//<Composer postContent = {post} />
export function Composer(props) {
    const [formInfo, setFormInfo] = useState({
        file: props.postContent ? props.postContent.val.file : null,
        postMessage: props.postContent ? props.postContent.val.message : '',
        date: props.postContent ? props.postContent.val.date : null,
        tags: props.postContent ? props.postContent.val.tags : '',
    })

    const textChange = (e) => {
        const name = e.target.id
        const value = e.target.value
        setFormInfo((prevState) => {
            return ({ ...prevState, [name]: value })
        })
    };

    const imgChange = (e) => {
        setFormInfo((prevState) => {
            return ({ ...prevState, file: e.target.files[0] })
        })
    };

    const writeData = (event) => {
        event.preventDefault();
        const fileRef = sRef(storage,`feedImages/${DUMMY_PAIRID}/${formInfo.file.name}`)
        uploadBytes(fileRef, formInfo.file)
          .then(() => getDownloadURL(fileRef))
          .then((url) => {
            const messageListRef = ref(database, `${DUMMY_PAIRID}/feed`);
              push(messageListRef, {
                  user: DUMMY_USERID,
                  message: formInfo.postMessage,
                  date: `${new Date().toLocaleString()}`,
                  file: url,
                  tags: formInfo.tags, //set elements are unique; register each element once only
                  comments: [],
              })
          })
          .then(() => {
            //reset form after submit
            setFormInfo({
                file: null,
                postMessage: '',
                date: null,
                tags:''
            });
          }); 
        };

    return (
    <div>
    Do not edit posts with Composer yet - I need to update the database methods - KL
        <form onSubmit={writeData} className = 'flex bg-yellow-300 justify-center'>
            <input
                type='text'
                id='postMessage'
                placeholder='enter caption here:'
                onChange={(e) => { textChange(e) }}
                value={formInfo.postMessage}
                className='text-black'
            />
            <br />
            <input
                type='text'
                id='tags'
                placeholder='enter tags separated by spaces'
                onChange={(e) => { textChange(e) }}
                value={formInfo.tags}
                className='text-black'
            />
            <br />
            <input type='file' onChange={(e) => { imgChange(e) }} />
            <br />
            <input type='submit' value='Send'/> 
        </form>
        </div>
        )
}