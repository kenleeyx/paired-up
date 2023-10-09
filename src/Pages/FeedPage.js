//tags: we want users to be able to tag posts(done)
// and filter by these tags
//on the feed page we can put in buttons for filters(map out tags)
//store a set of tags in the account - no, we calculate the set of tags

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App.js";
import { useState, useEffect } from "react";
import { database, storage } from "../firebase/firebase";
import { onChildAdded, onChildChanged, push, ref, onValue } from "firebase/database";
import {Feed} from '../Components/Feed'
import {Composer} from '../Components/Composer'

const DB_FEED_KEY = "feed";
const DUMMY_USERID = "dummyuser" // to use these as subs
const DUMMY_PAIRID = 'dummypair' // to use these as subs

export default function FeedPage() {
  //Pull in context from App.js
  const context = useContext(UserContext);
  const [posts, setPosts] = useState([]); //assuming user info and isLoggedIn comes from context
  
  useEffect(() => { // whenever app renders
    const postRef = ref(database, `${DB_FEED_KEY}/${DUMMY_PAIRID}`); //setup reference
    onChildAdded(postRef, (data) => { //setup listener
      setPosts((prevPosts) => [...prevPosts, { key: data.key, val: data.val() }]);
    });
  }, []);

  return (
    <>
      <div className=" flex h-screen flex-col items-center justify-center">
        <header className="fixed top-0 flex w-screen flex-row items-center justify-between p-4">
          <NavLink to="/" className="text-[2em]">
            ←
          </NavLink>
          <p className="text-[2em]">Feed</p>
          {context.isLoggedIn ? (
            <p className="text-xs">Signed In</p>
          ) : (
            <p className="text-xs">Signed Out</p>
          )}
        </header>
        <main>
          <Composer />
          <Feed posts={posts} setPosts={setPosts} />
        </main>
      </div>
    </>
  );
}
