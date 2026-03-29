function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "bubble-row user" : "bubble-row bot"}>
      <div className={isUser ? "message-bubble user" : "message-bubble bot"}>{text}</div>
    </div>
  );
}

export default MessageBubble;

