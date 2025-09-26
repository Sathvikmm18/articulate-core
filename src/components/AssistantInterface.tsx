import { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Sphere } from "@react-three/drei";
import { Mic, Send, Upload, Calendar, FileText, Code, Globe, Zap, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskPanel } from "@/components/TaskPanel";
import aiAvatarPlaceholder from "@/assets/ai-avatar-placeholder.jpg";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  taskType?: string;
}

const AvatarSphere = () => {
  return (
    <mesh>
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#00bfff"
          transparent
          opacity={0.7}
          emissive="#001122"
          wireframe
        />
      </Sphere>
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        AI
      </Text>
    </mesh>
  );
};

const taskButtons = [
  { icon: Calendar, label: "Schedule", type: "calendar", color: "primary" },
  { icon: FileText, label: "Summarize", type: "summarize", color: "secondary" },
  { icon: Code, label: "Code Help", type: "code", color: "accent" },
  { icon: Globe, label: "Browse", type: "browse", color: "primary" },
  { icon: Zap, label: "Analyze", type: "analyze", color: "secondary" },
];

export const AssistantInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm Mindeep. I can help you with scheduling, summarizing documents, coding tasks, web browsing, and much more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [currentTaskType, setCurrentTaskType] = useState<string>("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      taskType: selectedTask || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSelectedTask(null);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you need help with: "${inputValue}". ${
          selectedTask ? `This looks like a ${selectedTask} task. ` : ""
        }I'm processing this using the most appropriate LLM for optimal results. Let me get back to you with a comprehensive response!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  const handleTaskSelect = (taskType: string) => {
    setSelectedTask(taskType === selectedTask ? null : taskType);
    setCurrentTaskType(taskType);
    setIsTaskPanelOpen(true);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would implement actual speech recognition
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Chat Panel */}
      <motion.div
        className="flex-1 flex flex-col max-w-2xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="glass-panel m-4 mb-2 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Mindeep</h1>
              <p className="text-foreground-secondary text-sm">
                Powered by GPT-4, Claude, LLaMA & specialized models
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <Card className="glass-panel p-4">
            <h3 className="text-sm font-medium text-foreground-secondary mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              {taskButtons.map((task) => {
                const Icon = task.icon;
                const isSelected = selectedTask === task.type;
                return (
                  <Button
                    key={task.type}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTaskSelect(task.type)}
                    className={`glass-button hover-lift ${
                      isSelected ? "glow-primary" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {task.label}
                  </Button>
                );
              })}
            </div>
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <Badge variant="secondary" className="bg-gradient-secondary">
                  {selectedTask} mode selected
                </Badge>
              </motion.div>
            )}
          </Card>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.type === "user"
                    ? "glass-panel bg-gradient-primary text-primary-foreground"
                    : "glass-panel"
                }`}
              >
                <div className="space-y-2">
                  {message.taskType && (
                    <Badge variant="outline" className="text-xs">
                      {message.taskType}
                    </Badge>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4">
          <Card className="glass-panel p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything... I'll route it to the best LLM!"
                className="flex-1 bg-input border-input-border focus:ring-ring"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={`glass-button ${isListening ? "glow-primary" : ""}`}
              >
                <Mic className={`w-4 h-4 ${isListening ? "text-primary" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="glass-button"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-primary hover:opacity-90 glow-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center"
              >
                <Badge variant="secondary" className="pulse-glow">
                  Listening...
                </Badge>
              </motion.div>
            )}
          </Card>
        </div>
      </motion.div>

      {/* 3D Avatar Panel */}
      <motion.div
        className="flex-1 min-h-screen"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-panel m-4 h-[calc(100vh-2rem)] overflow-hidden">
          <div className="h-full relative">
            {/* Avatar Canvas */}
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <pointLight position={[-10, -10, -10]} color="#8b5cf6" />
              <AvatarSphere />
              <OrbitControls enableZoom={false} />
            </Canvas>

            {/* Avatar Status Overlay */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-secondary glow-secondary">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                Active
              </Badge>
            </div>

            {/* Avatar Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="glass-panel p-4">
                <h3 className="font-semibold mb-2 gradient-text-secondary">
                  AI Avatar Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Mode:</span>
                    <span>Conversational</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Active LLM:</span>
                    <span className="text-primary">GPT-4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Expression:</span>
                    <span>Thinking</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Task Panel */}
      <TaskPanel
        isOpen={isTaskPanelOpen}
        onClose={() => setIsTaskPanelOpen(false)}
        taskType={currentTaskType}
      />
    </div>
  );
};