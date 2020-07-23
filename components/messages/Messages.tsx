import React, { Component } from "react";
import { MessageType } from "./MessagesRouter";
import {ShortUserType} from "../lib/User";
import {MessagesStorage} from "./MessagesStorage";
import { Message } from "./Message";

type Props = {
    messages: MessagesStorage,
    user: ShortUserType
}

export class Messages extends Component<Props, {}> {

    renderMessage(messages: MessageType[], user_id: number) {
        let result = messages.map((message) => {
            let className = "my";
            if (message.sender_id == user_id) {
                className = "user";
            }
            return <Message className={className} text={message.text}/>
        });
        return result;
    }

    render() {
        let { user, messages } = this.props.messages.getMessageGroup(this.props.user.id);
        let renderedMessage = this.renderMessage(messages, user.id);

        return (
            <div>
                { renderedMessage }
            </div>
        )

    }
}