import { useState, useEffect } from "react";
import { database } from "../firebase/firebase";
import { onChildAdded, push, ref } from "firebase/database";

const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

export function Post(props) {
    const [commentInput, setCommentInput] = useState({})
    const [commentList, setCommentList] = useState([])
    const DB_FEED_KEY = `feed`;

    // /placeholderforuserid/${props.postContent.key}/comments

    useEffect(() => { // whenever app renders
        const commentRef = ref(database, `${DB_FEED_KEY}/${DUMMY_PAIRID}/${props.postContent.key}/comments`); //setup reference 
        onChildAdded(commentRef, (data) => { //setup listener
            setCommentList((prevComments) => [...prevComments, { key: data.key, val: data.val() }]);
        });
    }, []);

    const writeComment = () => {
        const commentRef = ref(database, `${DB_FEED_KEY}/${DUMMY_PAIRID}/${props.postContent.key}/comments`);
        push(commentRef, commentInput
        ).then(() => {
            //reset form after submit
            setCommentInput({
                commentingUser: DUMMY_USERID,
                commentText: '',
            });
        });
    };

    const commentListItems = commentList.map((comment) => (
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={comment.key} >
            {comment.val.commentingUser} : {comment.val.commentText}  
        </div>
    ))

    return (      
        <div className='w-1/5 bg-green-300 p-5 m-2 border-black border' key={props.postContent.key}>
            {props.postContent.val.user}
            {props.postContent.val.file ? <img src={props.postContent.val.file} alt='Post message' /> : null}
            {props.postContent.val.message}
            <br />
            {props.postContent.val.date}
            <br />
            <input
              type='text'
              id='Comment'
              placeholder='Comment?'
              onChange={(e) => {setCommentInput({
                commentingUser: 'placeholder for context', 
                commentText: e.target.value,
                })}}
              value={commentInput.commentText}
              className = 'text-black'
            />
            <button onClick={writeComment}>Post</button>
            {commentListItems}
        </div>

    )
}