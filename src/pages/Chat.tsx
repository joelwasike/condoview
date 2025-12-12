import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "The property inspection is scheduled for tomorrow",
    time: "2m ago",
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can we discuss the lease renewal?",
    time: "15m ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Thank you for the quick response!",
    time: "1h ago",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "I'm interested in the Harbor View property",
    time: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    lastMessage: "The maintenance team will arrive at 2pm",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! I wanted to follow up on the property viewing we discussed last week.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Hello Sarah! Yes, of course. The property at 19 Abernethy Street is still available.",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Perfect! I'd love to schedule a viewing. Is tomorrow afternoon available?",
    time: "10:33 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "Tomorrow works great. How about 2:00 PM? I can meet you at the property.",
    time: "10:35 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content: "The property inspection is scheduled for tomorrow",
    time: "10:36 AM",
    isMe: false,
  },
];

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <DashboardLayout title="Chat">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Contacts List */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-secondary border-0"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${
                  selectedContact.id === contact.id ? "bg-secondary" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent border-2 border-card rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-card-foreground truncate">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-xl shadow-card overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                {selectedContact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-card rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Video className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-card-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-secondary border-0"
              />
              <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
