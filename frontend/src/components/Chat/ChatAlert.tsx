import { nanoid } from "nanoid";

import Notification from "@components/Notifications/Notification";
import type {
  MessageQueryData,
  NotificationQueryData,
  UserQueryData,
} from "@store/user/user.slice";

export interface ChatAlertProps {
  message: MessageQueryData;
  sender: UserQueryData;
}

const ChatAlert = ({ message, sender }: ChatAlertProps) => {
  const notification: NotificationQueryData = {
    id: nanoid(20),
    sender: sender,
    type: (message.notificationData as any).type || "",
    data: (message.notificationData as any).data || {},
    read: message.read,
    created_at: new Date(message.created_at),
    updated_at: new Date(message.created_at),
  };

  return <Notification notification={notification} isChatAlert width="100%" />;
};

export default ChatAlert;
