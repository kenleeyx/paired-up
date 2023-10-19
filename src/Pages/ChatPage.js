//-----------React-----------//
import { useState, useEffect } from "react";

//-----------Firebase-----------//
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";

//-----------Components-----------//
import NavBar from "../Details/NavBar.js";
import { ChatComposer } from "../Components/Chat/ChatComposer";
import { Chat } from "../Components/Chat/Chat";
import ContextHelper from "../Components/Helpers/ContextHelper.js";

//-----------Media-----------//

export default function ChatPage() {
  //Pull in context from App.js asd
  const pairKey = ContextHelper("pairKey");
  const [chat, setChat] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    // whenever app renders asd
    if (pairKey) {
      const userRef = ref(database, `rooms/${pairKey}/backgroundImage`); //setup reference
      onValue(userRef, (result) => {
        const val = result.val();
        if (val) {
          setBackgroundImage(val.backgroundImageURL);
        }
      });

      const postRef = ref(database, `rooms/${pairKey}/chat`); //setup reference
      onValue(postRef, (data) => {
        let dataArray = [];
        if (data.val()) {
          dataArray = Object.keys(data.val()).map((key) => {
            return { key: key, val: data.val()[key] };
          });
        }
        setChat(dataArray);
      });
    }
  }, [pairKey]);

  return (
    <div className="">
      <NavBar label="Chat" />
      <main
        className="mb-[50px] h-screen bg-cover bg-center bg-no-repeat pt-[80px]"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : null
        }
      >
        <Chat chat={chat} />
        <p className="pt-[85px] text-transparent">blank</p>
        <ChatComposer />
      </main>
    </div>
  );
}
