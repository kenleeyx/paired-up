import NavBar from "../Details/NavBar.js";

export default function ChatPage() {
  return (
    <div className=" flex h-screen flex-col items-center justify-center">
      <NavBar label="Chat" />
      <main>
        <p>Insert Chat</p>
      </main>
    </div>
  );
}
