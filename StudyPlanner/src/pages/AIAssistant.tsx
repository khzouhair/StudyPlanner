// import { useState } from 'react';
// import { Bot, Send } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Card } from '@/components/ui/card';
// import { Course, Task, Exam } from '@/lib/models';

// interface AIAssistantProps {
//   courses: Course[];
//   tasks: Task[];
//   exams: Exam[];
// }

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// export default function AIAssistant({ courses, tasks, exams }: AIAssistantProps) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Bonjour! Je suis votre assistant AI StudyPlanner. Je peux vous aider à organiser votre emploi du temps, gérer vos tâches et planifier vos examens. Comment puis-je vous aider aujourd'hui?",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const generateResponse = (userMessage: string): string => {
//     const lowerMessage = userMessage.toLowerCase();
    
//     // Analyse des tâches
//     if (lowerMessage.includes('tâche') || lowerMessage.includes('task')) {
//       const pendingTasks = tasks.filter(t => t.status === 'pending');
//       const urgentTasks = tasks.filter(t => {
//         const deadline = new Date(t.deadline);
//         const today = new Date();
//         const diffTime = deadline.getTime() - today.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays <= 2 && t.status === 'pending';
//       });

//       if (urgentTasks.length > 0) {
//         return `Vous avez ${urgentTasks.length} tâche(s) urgente(s):\n${urgentTasks.map(t => `- ${t.title} (échéance: ${new Date(t.deadline).toLocaleDateString()})`).join('\n')}\n\nJe vous recommande de les prioriser dès maintenant.`;
//       }

//       if (pendingTasks.length > 0) {
//         return `Vous avez ${pendingTasks.length} tâche(s) en attente. Souhaitez-vous que je vous aide à les organiser par priorité?`;
//       }

//       return "Excellente nouvelle! Vous n'avez pas de tâches en attente. C'est le bon moment pour réviser ou prendre de l'avance.";
//     }

//     // Analyse des examens
//     if (lowerMessage.includes('examen') || lowerMessage.includes('exam')) {
//       const upcomingExams = exams.filter(e => {
//         const examDate = new Date(e.date);
//         const today = new Date();
//         return examDate >= today;
//       }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//       if (upcomingExams.length > 0) {
//         const nextExam = upcomingExams[0];
//         const courseName = courses.find(c => c.id === nextExam.courseId)?.name || 'Cours';
//         const daysUntil = Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
//         return `Votre prochain examen est en ${courseName} dans ${daysUntil} jour(s) (${new Date(nextExam.date).toLocaleDateString()}).\n\n${upcomingExams.length > 1 ? `Vous avez ${upcomingExams.length} examens à venir au total.` : ''} Je vous suggère de créer un planning de révision dès maintenant.`;
//       }

//       return "Vous n'avez pas d'examens à venir dans votre calendrier actuel.";
//     }

//     // Analyse des cours
//     if (lowerMessage.includes('cours') || lowerMessage.includes('course') || lowerMessage.includes('emploi')) {
//       return `Vous avez ${courses.length} cours enregistré(s):\n${courses.map(c => `- ${c.name} (Prof: ${c.instructor})`).join('\n')}\n\nSouhaitez-vous que je vous aide à organiser votre emploi du temps autour de ces cours?`;
//     }

//     // Organisation générale
//     if (lowerMessage.includes('organis') || lowerMessage.includes('planif') || lowerMessage.includes('aide')) {
//       const stats = {
//         courses: courses.length,
//         pendingTasks: tasks.filter(t => t.status === 'pending').length,
//         upcomingExams: exams.filter(e => new Date(e.date) >= new Date()).length,
//       };

//       return `Voici un aperçu de votre situation:\n\n📚 ${stats.courses} cours\n✏️ ${stats.pendingTasks} tâches en attente\n📝 ${stats.upcomingExams} examens à venir\n\nJe peux vous aider à:\n- Prioriser vos tâches urgentes\n- Créer un planning de révision\n- Organiser votre emploi du temps\n\nQue souhaitez-vous faire en premier?`;
//     }

//     return "Je suis là pour vous aider à organiser votre emploi du temps et vos études. Vous pouvez me demander des informations sur vos tâches, examens, cours ou me demander de vous aider à planifier votre temps.";
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: input.trim(),
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     // Simulate AI response delay
//     setTimeout(() => {
//       const response = generateResponse(userMessage.content);
//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: response,
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, assistantMessage]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//           <Bot className="h-8 w-8 text-primary" />
//           Assistant AI
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Votre assistant personnel pour organiser vos études
//         </p>
//       </div>

//       <Card className="flex-1 flex flex-col overflow-hidden">
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.role === 'user' ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 {message.role === 'assistant' && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Bot className="h-5 w-5 text-primary" />
//                   </div>
//                 )}
//                 <div
//                   className={`rounded-lg px-4 py-3 max-w-[80%] ${
//                     message.role === 'user'
//                       ? 'bg-primary text-primary-foreground'
//                       : 'bg-muted text-foreground'
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap text-sm leading-relaxed">
//                     {message.content}
//                   </p>
//                   <p className="text-xs opacity-70 mt-2">
//                     {message.timestamp.toLocaleTimeString('fr-FR', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//                 {message.role === 'user' && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
//                     <span className="text-sm font-semibold text-secondary-foreground">
//                       Vous
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex gap-3 justify-start">
//                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Bot className="h-5 w-5 text-primary" />
//                 </div>
//                 <div className="rounded-lg px-4 py-3 bg-muted">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                     <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                     <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         <div className="border-t p-4">
//           <div className="flex gap-2">
//             <Textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Posez une question sur votre emploi du temps, vos tâches..."
//               className="min-h-[60px] resize-none"
//               disabled={isLoading}
//             />
//             <Button
//               onClick={handleSend}
//               disabled={!input.trim() || isLoading}
//               size="icon"
//               className="h-[60px] w-[60px]"
//             >
//               <Send className="h-5 w-5" />
//             </Button>
//           </div>
//           <p className="text-xs text-muted-foreground mt-2">
//             Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
//           </p>
//         </div>
//       </Card>
//     </div>
//   );
// }


import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Course, Task, Exam } from '@/lib/models';

interface AIAssistantProps {
  courses: Course[];
  tasks: Task[];
  exams: Exam[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant({ courses, tasks, exams }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am your AI StudyPlanner assistant. I can help you organize your schedule, manage your tasks, and plan your exams. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyse des tâches
    if (lowerMessage.includes('tâche') || lowerMessage.includes('task')) {
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      const urgentTasks = tasks.filter(t => {
        const deadline = new Date(t.deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2 && t.status === 'pending';
      });

      if (urgentTasks.length > 0) {
        return `You have ${urgentTasks.length} urgent task(s):\n${urgentTasks.map(t => `- ${t.title} (due: ${new Date(t.deadline).toLocaleDateString()})`).join('\n')}\n\nI recommend prioritizing them right away.`;
      }

      if (pendingTasks.length > 0) {
        return `You have ${pendingTasks.length} pending task(s). Would you like me to help you organize them by priority?`;
      }

      return "Great news! You have no pending tasks. It's a good time to review or get ahead.";
    }

    // Analyse des examens
    if (lowerMessage.includes('examen') || lowerMessage.includes('exam')) {
      const upcomingExams = exams.filter(e => {
        const examDate = new Date(e.date);
        const today = new Date();
        return examDate >= today;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (upcomingExams.length > 0) {
        const nextExam = upcomingExams[0];
        const courseName = courses.find(c => c.id === nextExam.courseId)?.name || 'Cours';
        const daysUntil = Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `Your next exam is in ${courseName} in ${daysUntil} day(s) (${new Date(nextExam.date).toLocaleDateString()}).\n\n${upcomingExams.length > 1 ? `You have ${upcomingExams.length} exams coming up in total.` : ''} I suggest creating a study plan starting now.`;
      }

      return "If you prefer a more friendly or formal tone, I can adjust it.";
    }

    // Analyse des cours
    if (lowerMessage.includes('cours') || lowerMessage.includes('course') || lowerMessage.includes('emploi')) {
      return `You have ${courses.length} registered course(s):\n${courses.map(c => `- ${c.name} (Instructor: ${c.instructor})`).join('\n')}\n\nWould you like me to help you organize your schedule around these courses?`;
    }

    // Organisation générale
    if (lowerMessage.includes('organis') || lowerMessage.includes('planif') || lowerMessage.includes('aide')) {
      const stats = {
        courses: courses.length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        upcomingExams: exams.filter(e => new Date(e.date) >= new Date()).length,
      };

      return `Here is an overview of your situation:\n\n📚 ${stats.courses} courses\n✏️ ${stats.pendingTasks} pending tasks\n📝 ${stats.upcomingExams} upcoming exams\n\nI can help you with:\n- Prioritizing your urgent tasks\n- Creating a study plan\n- Organizing your schedule\n\nWhat would you like to do first?`;
    }

    return "I am here to help you organize your schedule and studies. You can ask me for information about your tasks, exams, courses, or ask me to help you plan your time.";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          Assistant AI
        </h1>
        <p className="text-muted-foreground mt-2">
          Your personal assistant for organizing your studies
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      You
                    </span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-lg px-4 py-3 bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question about your schedule, tasks..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
           Press Enter to send, Shift+Enter for a new line
          </p>
        </div>
      </Card>
    </div>
  );
}
