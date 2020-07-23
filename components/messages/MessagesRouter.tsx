import React, { Component } from "react";
import { Route} from "react-router-dom";
import { ShortUserType } from "../lib/User";
import {MessagesList} from "./MessagesList";
import {Messages} from "./Messages";
import {MessagesStorage} from "./MessagesStorage";

export interface MessageType {
    message_id: number,
    sender_id: number
    text: string
}
export interface MessagesGroup {
    user: ShortUserType,
    messages: MessageType[],
}

type Props = {
    user: ShortUserType
}
type State = {
    messageStorage: MessagesStorage
}
export class MessageRouter extends Component<Props, State> {

    componentDidMount() {
        if (this.state.messageStorage.getAll().length > 1) {
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/messages");
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();
        xhr.onload = () => {
            this.setState({
                messageStorage: this.state.messageStorage.setGroups(JSON.parse(xhr.response))
            })
        }
    }

    render() {
        return (
            <div>
                <Route exact path=":user_id">
                    <Messages messages={ this.state.messageStorage } user={ this.props.user }/>
                </Route>
                <Route>
                    <MessagesList
                        user={ this.props.user }
                        messageGroups={ this.state.messageStorage.getAll() }
                    />
                </Route>
            </div>
        )
    }
    
}