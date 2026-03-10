"use client";

import CreateChannelModal from "../modals/create-channel-modal";
import CreateServerModal from "../modals/create-server-modal";
import DeleteMessageModal from "../modals/delete-message-modal";
import DeleteServerChannel from "../modals/delete-server-channel";
import DeleteServerModal from "../modals/delete-server-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import EditServerModal from "../modals/edit-server-modal";
import InviteModal from "../modals/invite-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import MembersModal from "../modals/members-modal";
import MessageFileModal from "../modals/message-file-modal";
import { IncomingCallModal } from "../modals/incoming-call-modal";
import { OutgoingCallModal } from "../modals/outgoing-call-modal";
import UpdateAiInfo from "../modals/update-ai-infromation";

export const ModalProvider = () => {
    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteServerChannel />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
            <IncomingCallModal />
            <OutgoingCallModal />
            <UpdateAiInfo />
        </>
    );
};
