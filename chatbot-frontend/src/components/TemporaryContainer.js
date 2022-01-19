import * as React from "react";
import * as ReactDOM from "react-dom";
import { Chat, HeroCard } from "@progress/kendo-react-conversational-ui";
import { DirectLine } from "botframework-directlinejs";
import AdaptiveCards from "adaptivecards";
const client = new DirectLine({
  secret: "Y_ly-If6haE.cwA.PQE.ZwOOsq4MlHcD3_YLFI-t9oW6L6DXMMBoi67LBz9WaWA",
});
const bot = {
  id: "Botyo-BotTesting",
  name: "Travel Agent",
  avatarUrl: "https://demos.telerik.com/kendo-ui/content/chat/VacationBot.png",
};
const user = {
  id: "User",
  name: "KendoReact",
};

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

