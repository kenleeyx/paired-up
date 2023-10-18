//-----------Componets-----------//
import { Message } from "./Message";
import ContextHelper from "../Helpers/ContextHelper";

//<Chat chat={chat} />
export function Chat(props) {
  const userEmail = ContextHelper("email");

  const messages = props.chat.map((chatMessage, index) => {
    return (
      <Message
        chatMessage={chatMessage}
        key={chatMessage.key}
        postIndex={index}
        sender={userEmail === chatMessage.val.user ? "self" : "other"}
      />
    );
  });

  return <div className="max-w-screen flex h-full flex-col">{messages}</div>;
}
