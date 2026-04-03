import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/useAuth.js";
import * as chatApi from "./api.js";
import { ChatLayout } from "./components/ChatLayout.jsx";
import { Composer } from "./components/Composer.jsx";
import { MessageList } from "./components/MessageList.jsx";
import { ThinkingPanel } from "./components/ThinkingPanel.jsx";
import { useAgentPusher } from "./hooks/useAgentPusher.js";
import { useThinkingTimeline } from "./hooks/useThinkingTimeline.js";

export function ChatPage() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState(
    /** @type {null | { id: string, role: string, content: string, createdAt: string }[]} */ (
      null
    ),
  );
  const [listError, setListError] = useState(/** @type {string | null} */ (null));

  const { steps: thinkingSteps, pushThinking, clear: clearThinking, exiting } =
    useThinkingTimeline();

  const refreshMessages = useCallback(async () => {
    try {
      const list = await chatApi.getMessages();
      setMessages(list);
      setListError(null);
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String(e.message)
          : "Không tải được lịch sử";
      setListError(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await chatApi.getMessages();
        if (!cancelled) {
          setMessages(list);
          setListError(null);
        }
      } catch (e) {
        const msg =
          e && typeof e === "object" && "message" in e
            ? String(e.message)
            : "Không tải được lịch sử";
        if (!cancelled) setListError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useAgentPusher({
    userId: user?.id,
    onThinking: (payload) => {
      pushThinking(payload);
    },
    onThinkingClear: () => {
      clearThinking({ immediate: false });
    },
    onMessageCreated: () => {
      clearThinking({ immediate: false });
      void refreshMessages();
    },
  });

  return (
    <ChatLayout user={user} onLogout={logout}>
      <MessageList
        messages={messages}
        error={listError}
        onRetry={refreshMessages}
      />
      <ThinkingPanel steps={thinkingSteps} exiting={exiting} />
      <Composer
        onMessageSent={refreshMessages}
        onSendStart={() => clearThinking({ immediate: true })}
      />
    </ChatLayout>
  );
}
