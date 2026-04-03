import { AppProviders } from "@/app/AppProviders.jsx";
import { ChatLayout } from "@/features/chat/components/ChatLayout.jsx";
import { Composer } from "@/features/chat/components/Composer.jsx";
import { MessageList } from "@/features/chat/components/MessageList.jsx";
import { ThinkingPanel } from "@/features/chat/components/ThinkingPanel.jsx";

function App() {
  return (
    <AppProviders>
      <ChatLayout>
        <MessageList />
        <ThinkingPanel />
        <Composer />
      </ChatLayout>
    </AppProviders>
  );
}

export default App;
