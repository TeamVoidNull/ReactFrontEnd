// import roseLogo from "../images/rose_name.png"
import { useEffect, useState } from "react";
import * as React from "react";
import cx from "classnames";

import { DirectLine } from "botframework-directlinejs";
// import { resourceLimits } from "worker_threads";
// import { act } from "react-dom/test-utils";
// import { Socket } from "socket.io";

//Direct Line way to connect to the chatbot
const client = new DirectLine({
    secret: "Pl0xVroBOWU.yElRz4iWd95g_saIACt5sGy3xp6uxzCMSQCNXGGyBg0",
  });
  const bot = {
    id: "roseqnamakertemp-bot",
    name: "Rosie",
    avatarUrl: "https://bloximages.chicago2.vip.townnews.com/tribstar.com/content/tncms/assets/v3/editorial/2/e4/2e4859c4-a92b-11e5-9d44-f30c2899702c/567a1f0b1c3de.image.jpg",
  };
  const user = {
    id: "User",
    name: "You",
  };


//Right side of the website.  All the commented out code was for using socket, which we are not using.
export default function ChatContainer() {
    // const { socket } = props

    //Message List -> Has message (text), sender (0 for user and 1 for bot), link (either empty or link), title (title of link), addon (0 for no addon, 1 for link, 2 for image) 
    const beginningMessage = "Hello, This is Rosie.  What questions do you have?"
    const [messages, setMessages] = useState<any>([{ message: beginningMessage, sender: 1, title: "", linky: "", addon: 0 }])
    const [inputMessage, setInputMessage] = useState<string>("")

    // useEffect(() => {
    //     socket.on("bot message", (res: any) => {
    //         console.log("object");
    //         setMessages([...messages, { message: res.message, sender: 1 }])
    //     })
    // },[])

    //helper function to get title (regex)
    const getBracket = (text: String) => {
        const matches = text.match(/\[(.*?)\]/g);
          const result = [];
        if (matches) {
            for (let i = 0; i < matches.length; ++i) {
                const match = matches[i];
                result.push(match.substring(1, match.length - 1)); 
            }
        }
        if(result.length > 0){
            return result[0];
        } else {
            return ""
        }
    };

    //helper function to get link (regex)
    const getLink = (text: String) => {
        const matches = text.match(/\(([^)]+)\)/);
          const result = [];
        if (matches) {
            for (let i = 0; i < matches.length; ++i) {
                const match = matches[i];
                result.push(match.substring(1, match.length - 1));  
            }
        }
        if(result.length > 0){
            return result[0];
        } else {
            return ""
        }
    };

    //called when bot sends a response back.
    const onResponse = React.useCallback(
        (activity) => {
            if (activity.from.id === bot.id) {
                const bracky = getBracket(activity.text)
                var linky = ""
                var addon = 0
                var shortened = activity.text
                //check if has addon
                if (bracky.length > 0){
                    linky = getLink(activity.text)
                    addon = 1
                    shortened = shortened.substring(0, shortened.indexOf("["))
                    //check if image
                    if (activity.text.includes("![")) {
                        addon = 2;
                        shortened = shortened.substring(0, shortened.length-1)
                        console.log(linky);
                    }
                }

                setMessages([...messages, { message: shortened, sender: 1, title: bracky, linky: linky, addon: addon}]);

                console.log("something happened");
            }
        }, [messages]
    );

    React.useEffect(() => {
        client.activity$.subscribe((activity) => onResponse(activity));
    }, [onResponse]);

    const sendPressed = () => {
        if(inputMessage !== ""){
            client
            .postActivity({
              from: {
                id: user.id,
                name: user.name,
              },
              type: "message",
              text: inputMessage,
            })
            .subscribe(
              (id) => console.log("Posted activity, assigned ID ", id),
              (error) => console.log("Error posting activity", error)
            );
            setMessages([...messages, { message: inputMessage, sender: 0, title: "", linky: "", addon: 0 }])
            setInputMessage("");
        }
        // socket.emit("client message", inputMessage);
    }

    const enterPressed = (e: any) => {
        e.preventDefault()
        if(inputMessage !== ""){
            client
            .postActivity({
              from: {
                id: user.id,
                name: user.name,
              },
              type: "message",
              text: inputMessage,
            })
            .subscribe(
              (id) => console.log("Posted activity, assigned ID ", id),
              (error) => console.log("Error posting activity", error)
            );
            setMessages([...messages, { message: inputMessage, sender: 0, title: "", linky: "", addon: 0  }])
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
                        {
                            //check addon type and posts bot message
                            if (message.addon === 0) {
                                return (
                                    <div className={cx({"message": true, "bot": message.sender === 1})} 
                                        key={`message-${index}`}>
                                        {
                                            message.message
                                        }
                                    </div>
                                )
                            } else if (message.addon === 1) {
                                return (
                                    <div className={cx({"message": true, "bot": message.sender === 1})} 
                                        key={`message-${index}`}>
                                            <a>
                                                {message.message} 
                                            </a>
                                            <br></br>
                                            <a href={message.linky}>
                                                {message.title}
                                            </a>
                                        
                                    </div>
                                )
                            } else if (message.addon === 2) {
                                return (
                                    <div className={cx({"message": true, "bot": message.sender === 1})} 
                                        key={`message-${index}`}>
                                            <a>
                                                {message.message} 
                                            </a>
                                            <br></br>
                                            <br></br>
                                            <img src={message.linky}/>
                                        
                                    </div>
                                )
                            }
                            
                        }

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
