import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, FileText, Code, Globe, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  taskType: string;
}

const taskContent = {
  calendar: {
    icon: Calendar,
    title: "Calendar Management",
    description: "Schedule meetings, set reminders, and manage your calendar",
    features: ["Smart scheduling", "Meeting preparation", "Reminder system", "Calendar integration"],
    color: "primary",
  },
  summarize: {
    icon: FileText,
    title: "Document Summarization",
    description: "Extract key insights from documents, PDFs, and web content",
    features: ["PDF analysis", "Key points extraction", "Multi-language support", "Visual summaries"],
    color: "secondary",
  },
  code: {
    icon: Code,
    title: "Code Assistance",
    description: "Get help with programming, debugging, and code optimization",
    features: ["Code review", "Bug fixing", "Optimization tips", "Multi-language support"],
    color: "accent",
  },
  browse: {
    icon: Globe,
    title: "Web Browsing",
    description: "Fetch real-time information and browse the web intelligently",
    features: ["Real-time data", "Research assistance", "Fact checking", "Content analysis"],
    color: "primary",
  },
  analyze: {
    icon: Zap,
    title: "Data Analysis",
    description: "Analyze data patterns, generate insights, and create visualizations",
    features: ["Pattern detection", "Statistical analysis", "Visualization", "Predictive modeling"],
    color: "secondary",
  },
};

export const TaskPanel = ({ isOpen, onClose, taskType }: TaskPanelProps) => {
  const task = taskContent[taskType as keyof typeof taskContent];
  
  if (!task) return null;

  const Icon = task.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 z-50"
          >
            <Card className="glass-panel h-full rounded-none rounded-l-2xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-${task.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{task.title}</h2>
                      <Badge variant="outline" className="text-xs mt-1">
                        {taskType}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-muted"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-foreground-secondary leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Capabilities</h3>
                    <div className="space-y-2">
                      {task.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl">
                    <h4 className="font-medium mb-2 gradient-text-secondary">
                      AI Model Selection
                    </h4>
                    <p className="text-xs text-foreground-secondary">
                      This task will be automatically routed to the most suitable LLM based on complexity and requirements.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border/30">
                  <Button 
                    className={`w-full bg-gradient-${task.color} hover:opacity-90 glow-${task.color}`}
                    onClick={onClose}
                  >
                    Start {task.title}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};