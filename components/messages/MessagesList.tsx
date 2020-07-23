import React, { Component } from "react";

import { ShortUserType } from "../lib/User";
import { MessagePreview } from "./MessagePreview";

export interface Message {
    message_id: number,
    text: string
}

export interface MessagesGroup {
    user: ShortUserType,
    messages: Message[]
}

type Props = {
    user: ShortUserType
}
type State = {
    groupMessages: MessagesGroup[]
}
export class MessagesList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            groupMessages: []
        }
    }

    componentDidMount() {
        if (this.state.groupMessages.length > 1) {
            return;
        } 
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/messages");
        xhr.setRequestHeader("Authentication", window.token);
        xhr.send();

        xhr.onload = () => {
            this.setState({
                groupMessages: JSON.parse(xhr.response)
            })
        }
    }

    renderMessageGroup(groups: MessagesGroup[]) {
        let renderedGroups = groups.map((group) => {
            return <MessagePreview user={ group.user } messages={ group.messages }/>
        })
        return renderedGroups;
    }

    render() {
        let groups = this.renderMessageGroup(this.state.groupMessages);
        return (
            <div>
                { groups }
            </div>
        )
    }
}