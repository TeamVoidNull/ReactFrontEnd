import * as React from "react";
import * as ReactDOM from "react-dom";
import { Chat, HeroCard } from "@progress/kendo-react-conversational-ui";
import { DirectLine } from "botframework-directlinejs";
import AdaptiveCards from "adaptivecards";

const client = new DirectLine({
  secret: "Pl0xVroBOWU.Tltz4ItkRPLQ8Z5PURYFoRBu2gsjtbwVAp7aecv7dsk",
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

//Just completely ignore this file it is just here

export default function TempContainer() {
  const [messages, setMessages] = React.useState([]);
  const onResponse = React.useCallback(
    (activity) => {
      let newMsg;

      if (activity.from.id === bot.id) {
        newMsg = {
          text: activity.text,
          author: bot,
          typing: activity.type === "typing",
          timestamp: new Date(activity.timestamp),
          suggestedActions: parseActions(activity.suggestedActions),
          attachments: activity.attachments ? activity.attachments : [],
        };
        setMessages([...messages, newMsg]);
      }
    },
    [messages]
  );
  React.useEffect(() => {
    client.activity$.subscribe((activity) => onResponse(activity));
  }, [onResponse]);

  const аttachmentTemplate = (props) => {
    let attachment = props.item;

    if (attachment.contentType === "application/vnd.microsoft.card.hero") {
      return (
        <HeroCard
          title={attachment.content.title || attachment.content.text}
          subtitle={attachment.content.subtitle}
          imageUrl={
            attachment.content.images ? attachment.content.images[0].url : ""
          }
          imageMaxWidth="250px"
          actions={attachment.content.buttons}
          onActionExecute={addNewMessage}
        />
      );
    } else if (
      attachment.contentType === "application/vnd.microsoft.card.adaptive"
    ) {
      let adaptiveCard = new AdaptiveCards.AdaptiveCard();
      adaptiveCard.parse(attachment.content);
      let renderedCard = adaptiveCard.render();
      let htmlToinsert = {
        __html: renderedCard.innerHTML,
      };
      return <div dangerouslySetInnerHTML={htmlToinsert} />;
    } else {
      return <div className="k-card">{attachment.content}</div>;
    }
  };

  const parseActions = (actions) => {
    if (actions !== undefined) {
      actions.actions.map((action) => {
        if (action.type === "imBack") {
          action.type = "reply";
        }
      });
      return actions.actions;
    }

    return [];
  };

  const parseText = (event) => {
    if (event.action !== undefined) {
      return event.action.value;
    } else if (event.value) {
      return event.value;
    } else {
      return event.message.text;
    }
  };

  const addNewMessage = (event) => {
    let value = parseText(event);
    client
      .postActivity({
        from: {
          id: user.id,
          name: user.name,
        },
        type: "message",
        text: value,
      })
      .subscribe(
        (id) => console.log("Posted activity, assigned ID ", id),
        (error) => console.log("Error posting activity", error)
      );

    if (!event.value) {
      setMessages([
        ...messages,
        {
          author: user,
          text: value,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="chat-container">
        <div className="header-container">
            <a>Rose Chatbot</a>
        </div>
        <Chat
        messages={messages}
        user={user}
        onMessageSend={addNewMessage}
        attachmentTemplate={аttachmentTemplate}
        />
    </div>

  );
};

