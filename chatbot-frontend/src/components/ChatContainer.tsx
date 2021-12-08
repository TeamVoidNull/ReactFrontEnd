// import roseLogo from "../images/rose_name.png"
import { useEffect, useState } from "react";
import cx from "classnames";
import { Socket } from "socket.io";

export default function ChatContainer(props: { socket: any; }) {
    const { socket } = props
    const [messages, setMessages] = useState<any>([])
    const [inputMessage, setInputMessage] = useState<string>("")

    useEffect(() => {
        socket.on("bot message", (res: any) => {
            setMessages([...messages, { message: res.message, sender: 1 }])
        })
    })

    const sendPressed = () => {
        setMessages([...messages, { message: inputMessage, sender: 0 }])
        socket.emit("client message", inputMessage);
        setInputMessage("");
    }

    const enterPressed = (e: any) => {
        e.preventDefault()
        if(inputMessage !== ""){
            setMessages([...messages, { message: inputMessage, sender: 0 }])
            socket.emit("client message", inputMessage);
            setInputMessage("");
        }
    }

    return (
        <div className="chat-container">
            <div className="header-container">
                <a>Rose Chatbot</a>
            </div>
            <div className="chatbox">
                {
                    messages.map((message:any, index:number) => 
                        <div className={cx({"message": true, "bot": message.sender === 1})} 
                        key={`message-${index}`}>
                            {
                                message.message
                            }
                        </div>
                    )
                }
            </div>
            <form onSubmit={e => enterPressed(e)}>
                <input type="text" id="message" value={inputMessage} placeholder="Type your message here" onChange={e => setInputMessage(e.target.value)} ></input>
                <i className="bi bi-send" onClick={sendPressed}></i>
            </form>
        </div>
    )
}
