import React, { Component } from "react";

import { ShortUserType } from "../lib/User";
import { MessagePreview } from "./MessagePreview";
import { MessagesGroup } from "./MessagesRouter";

type Props = {
    user: ShortUserType,
    messageGroups: MessagesGroup[]
}

export class MessagesList extends Component<Props, {}> {
    renderMessageGroup(groups: MessagesGroup[]) {
        let renderedGroups = groups.map((group) => {
            return <MessagePreview user={ group.user } messages={ group.messages }/>
        });
        return renderedGroups;
    }

    render() {
        let groups = this.renderMessageGroup(this.props.messageGroups);
        return (
            <div>
                { groups }
            </div>
        )
    }
}