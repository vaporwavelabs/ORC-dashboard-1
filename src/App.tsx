import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Database, 
  Shield, 
  Zap, 
  Maximize2, 
  Settings, 
  MessageSquare, 
  FolderKanban, 
  Wrench, 
  Bug,
  Send,
  User,
  Bot,
  Image as ImageIcon,
  Palette,
  Moon,
  Sun,
  AlertCircle,
  Terminal,
  Activity,
  Layers,
  ExternalLink,
  Search,
  LayoutGrid,
  Plus,
  ChevronDown,
  Trash2,
  File,
  Upload,
  X,
  FileText,
  Video,
  Music,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type BackgroundType = 'abstract' | 'dark' | 'minimal' | 'nature';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  timestamp: number;
}

interface MemoryItem {
  id: string;
  name: string;
  type: string;
  size: string;
  timestamp: number;
}

interface Workspace {
  id: string;
  name: string;
  sessionIds: string[];
  activeTab?: 'chat' | 'system' | 'memory' | 'research' | 'security' | 'workspace' | 'tools';
  securitySubView?: 'menu' | 'local-scan' | 'kali-terminal';
  chatSubView?: 'chat' | 'sessions';
  currentSessionId?: string;
  selectedKaliTools?: string[];
  kaliTarget?: string;
  kaliManualCommand?: string;
  memoryItems?: MemoryItem[];
  selectedAgent?: string;
  agentDeployments?: Record<string, 'local' | 'cloud'>;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

// --- AnythingLLM Configuration ---
const ANYTHING_LLM_API_KEY = process.env.ANYTHING_LLM_API_KEY || '';
const ANYTHING_LLM_BASE_URL = process.env.ANYTHING_LLM_BASE_URL || '';
const ANYTHING_LLM_WORKSPACE_SLUG = process.env.ANYTHING_LLM_WORKSPACE_SLUG || '';

// --- Constants ---

const AGENT_STATS_DATA: Record<string, { reasoning: number, coding: number, creative: number, speed: number, specialization: string }> = {
  'Main Agent Orchestral': { reasoning: 98, coding: 92, creative: 95, speed: 85, specialization: 'General Purpose / Complex Reasoning' },
  'Chat': { reasoning: 85, coding: 70, creative: 98, speed: 95, specialization: 'Conversational / Creative Writing' },
  'Sub Agent': { reasoning: 92, coding: 98, creative: 75, speed: 88, specialization: 'Technical Tasks / Debugging' },
  'Embed Agent': { reasoning: 70, coding: 60, creative: 50, speed: 99, specialization: 'Vectorization / Data Retrieval' },
  'Scout': { reasoning: 88, coding: 80, creative: 82, speed: 90, specialization: 'Web Research / Data Gathering' }
};

const TASK_LEADERBOARD = [
  { task: 'Complex Reasoning', best: 'Main Agent Orchestral', score: 98 },
  { task: 'Software Engineering', best: 'Sub Agent', score: 98 },
  { task: 'Creative Writing', best: 'Chat', score: 98 },
  { task: 'Data Vectorization', best: 'Embed Agent', score: 99 },
  { task: 'Information Retrieval', best: 'Scout', score: 90 },
];

// --- Components ---

const WaveChart = () => {
  return (
    <div className="relative h-64 w-full flex items-center justify-center overflow-hidden mt-4">
      {/* Recreating the layered wave look from the image with more precision */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top Waves (Cool Blue Theme) */}
        {[
          { color: '#007AFF', scale: 1.0, h: 120, b: '50%', op: 0.6, blur: 'blur-3xl' },
          { color: '#5AC8FA', scale: 0.85, h: 100, b: '50%', op: 0.5, blur: 'blur-2xl' },
          { color: '#00C7BE', scale: 0.7, h: 80, b: '50%', op: 0.4, blur: 'blur-xl' },
          { color: '#E5F1FF', scale: 0.55, h: 60, b: '50%', op: 0.3, blur: 'blur-lg' },
          { color: '#FFFFFF', scale: 0.4, h: 40, b: '50%', op: 0.2, blur: 'blur-md' },
        ].map((wave, i) => (
          <motion.div
            key={`top-${i}`}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: wave.op, scaleY: 1 }}
            transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
            className={`absolute w-full rounded-[100%] ${wave.blur}`}
            style={{ 
              backgroundColor: wave.color,
              height: `${wave.h}px`,
              transform: `scaleX(${wave.scale})`,
              bottom: wave.b
            }}
          />
        ))}
        
        {/* Bottom Waves (Cool Blue Theme) - Mirrored */}
        {[
          { color: '#FFFFFF', scale: 0.4, h: 40, t: '50%', op: 0.2, blur: 'blur-md' },
          { color: '#E5F1FF', scale: 0.55, h: 60, t: '50%', op: 0.3, blur: 'blur-lg' },
          { color: '#00C7BE', scale: 0.7, h: 80, t: '50%', op: 0.4, blur: 'blur-xl' },
          { color: '#5AC8FA', scale: 0.85, h: 100, t: '50%', op: 0.5, blur: 'blur-2xl' },
          { color: '#007AFF', scale: 1.0, h: 120, t: '50%', op: 0.6, blur: 'blur-3xl' },
        ].map((wave, i) => (
          <motion.div
            key={`bottom-${i}`}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: wave.op, scaleY: 1 }}
            transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
            className={`absolute w-full rounded-[100%] ${wave.blur}`}
            style={{ 
              backgroundColor: wave.color,
              height: `${wave.h}px`,
              transform: `scaleX(${wave.scale})`,
              top: wave.t
            }}
          />
        ))}
        
        {/* Horizontal Divider Line (Subtle) */}
        <div className="absolute w-[90%] h-[1px] bg-blue-100 top-1/2 -translate-y-1/2 opacity-30" />
      </div>
      
      {/* Month Labels (Exact spacing from image) */}
      <div className="absolute top-[55%] w-full flex justify-between px-12 text-[11px] font-bold text-slate-400/80 uppercase tracking-[0.15em]">
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
      </div>
    </div>
  );
};

const DockItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-colors"
    >
      <Icon className="w-6 h-6 text-white" />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-tighter">
        {label}
      </span>
    </motion.button>
  );
};

export default function App() {
  const [background, setBackground] = useState<BackgroundType>('abstract');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'system' | 'memory' | 'research' | 'security' | 'workspace' | 'tools'>('chat');
  const [securitySubView, setSecuritySubView] = useState<'menu' | 'local-scan' | 'kali-terminal'>('menu');
  const [selectedKaliTools, setSelectedKaliTools] = useState<string[]>([]);
  const [kaliTarget, setKaliTarget] = useState('');
  const [kaliManualCommand, setKaliManualCommand] = useState('');
  const [pendingTask, setPendingTask] = useState<{
    type: 'scan' | 'kali';
    tool?: string;
    target?: string;
    options?: string[];
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Welcome to AnythingLLM. How can I assist you today?' }
  ]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());
  const [chatSubView, setChatSubView] = useState<'chat' | 'sessions'>('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.1 Pro');
  const [subAgents, setSubAgents] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { 
      id: 'default', 
      name: 'Main Workspace', 
      sessionIds: [],
      activeTab: 'chat',
      securitySubView: 'menu',
      chatSubView: 'chat',
      memoryItems: [],
      selectedAgent: 'Main Agent Orchestral',
      agentDeployments: {
        'Main Agent Orchestral': 'cloud',
        'Chat': 'cloud',
        'Sub Agent': 'local',
        'Embed Agent': 'local',
        'Scout': 'cloud'
      },
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1.0
    }
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('default');
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceNameInput, setWorkspaceNameInput] = useState('');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('Main Agent Orchestral');
  const [agentDeployments, setAgentDeployments] = useState<Record<string, 'local' | 'cloud'>>({
    'Main Agent Orchestral': 'cloud',
    'Chat': 'cloud',
    'Sub Agent': 'local',
    'Embed Agent': 'local',
    'Scout': 'cloud'
  });
  const [maxTokens, setMaxTokens] = useState(4096);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1.0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Session & Workspace Management ---
  useEffect(() => {
    const savedSessions = localStorage.getItem('anything_llm_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    const savedWorkspaces = localStorage.getItem('anything_llm_workspaces');
    if (savedWorkspaces) {
      const parsed = JSON.parse(savedWorkspaces);
      setWorkspaces(parsed);
      if (parsed.length > 0) {
        const firstWorkspace = parsed[0];
        setActiveWorkspaceId(firstWorkspace.id);
        // Restore state from first workspace
        if (firstWorkspace.activeTab) setActiveTab(firstWorkspace.activeTab);
        if (firstWorkspace.securitySubView) setSecuritySubView(firstWorkspace.securitySubView);
        if (firstWorkspace.chatSubView) setChatSubView(firstWorkspace.chatSubView);
        if (firstWorkspace.memoryItems) setMemoryItems(firstWorkspace.memoryItems);
        if (firstWorkspace.selectedAgent) setSelectedAgent(firstWorkspace.selectedAgent);
        if (firstWorkspace.agentDeployments) setAgentDeployments(firstWorkspace.agentDeployments);
        if (firstWorkspace.maxTokens) setMaxTokens(firstWorkspace.maxTokens);
        if (firstWorkspace.temperature) setTemperature(firstWorkspace.temperature);
        if (firstWorkspace.topP) setTopP(firstWorkspace.topP);
      }
    }
  }, []);

  // Update current workspace state when view state changes
  useEffect(() => {
    if (!activeWorkspaceId) return;
    
    setWorkspaces(prev => {
      const current = prev.find(w => w.id === activeWorkspaceId);
      if (!current) return prev;

      // Only update if something actually changed to avoid unnecessary re-renders
      if (
        current.activeTab === activeTab &&
        current.securitySubView === securitySubView &&
        current.chatSubView === chatSubView &&
        current.currentSessionId === currentSessionId &&
        JSON.stringify(current.selectedKaliTools) === JSON.stringify(selectedKaliTools) &&
        current.kaliTarget === kaliTarget &&
        current.kaliManualCommand === kaliManualCommand &&
        JSON.stringify(current.memoryItems) === JSON.stringify(memoryItems) &&
        current.selectedAgent === selectedAgent &&
        JSON.stringify(current.agentDeployments) === JSON.stringify(agentDeployments) &&
        current.maxTokens === maxTokens &&
        current.temperature === temperature &&
        current.topP === topP
      ) {
        return prev;
      }

      return prev.map(w => 
        w.id === activeWorkspaceId ? { 
          ...w, 
          activeTab, 
          securitySubView, 
          chatSubView,
          currentSessionId,
          selectedKaliTools,
          kaliTarget,
          kaliManualCommand,
          memoryItems,
          selectedAgent,
          agentDeployments,
          maxTokens,
          temperature,
          topP
        } : w
      );
    });
  }, [activeTab, securitySubView, chatSubView, activeWorkspaceId, currentSessionId, selectedKaliTools, kaliTarget, kaliManualCommand, memoryItems, selectedAgent, agentDeployments, maxTokens, temperature, topP]);

  useEffect(() => {
    localStorage.setItem('anything_llm_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Switch session and view state when workspace changes
  useEffect(() => {
    const workspace = workspaces.find(w => w.id === activeWorkspaceId);
    if (!workspace) return;

    // Restore view state
    if (workspace.activeTab) setActiveTab(workspace.activeTab);
    if (workspace.securitySubView) setSecuritySubView(workspace.securitySubView);
    if (workspace.chatSubView) setChatSubView(workspace.chatSubView);
    if (workspace.selectedKaliTools) setSelectedKaliTools(workspace.selectedKaliTools);
    if (workspace.kaliTarget) setKaliTarget(workspace.kaliTarget);
    if (workspace.kaliManualCommand) setKaliManualCommand(workspace.kaliManualCommand);
    if (workspace.memoryItems) setMemoryItems(workspace.memoryItems);
    else setMemoryItems([]);

    if (workspace.selectedAgent) setSelectedAgent(workspace.selectedAgent);
    if (workspace.agentDeployments) setAgentDeployments(workspace.agentDeployments);
    if (workspace.maxTokens) setMaxTokens(workspace.maxTokens);
    if (workspace.temperature) setTemperature(workspace.temperature);
    if (workspace.topP) setTopP(workspace.topP);

    if (workspace.sessionIds.length > 0) {
      const targetSessionId = workspace.currentSessionId || workspace.sessionIds[0];
      if (targetSessionId !== currentSessionId) {
        const session = sessions.find(s => s.id === targetSessionId);
        if (session) {
          setCurrentSessionId(session.id);
          setMessages(session.messages);
        } else {
          createNewSession();
        }
      }
    }
  }, [activeWorkspaceId]);

  const saveCurrentSession = () => {
    setSessions(prev => {
      const updatedSessions = [...prev];
      const existingIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
      
      const sessionName = messages.length > 1 
        ? messages.find(m => m.role === 'user')?.content.slice(0, 30) + '...'
        : 'New Session';

      const newSession: ChatSession = {
        id: currentSessionId,
        name: sessionName,
        messages: messages,
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        updatedSessions[existingIndex] = newSession;
      } else {
        updatedSessions.unshift(newSession);
      }

      localStorage.setItem('anything_llm_sessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });
  };

  // Auto-save every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      saveCurrentSession();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [messages, currentSessionId]);

  const loadSession = (session: ChatSession) => {
    saveCurrentSession(); // Save current before switching
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setChatSubView('chat');
  };

  const createNewSession = () => {
    saveCurrentSession();
    const newId = Date.now().toString();
    setCurrentSessionId(newId);
    setMessages([{ id: '1', role: 'assistant', content: 'Welcome to AnythingLLM. How can I assist you today?' }]);
    setChatSubView('chat');
    
    // Link to workspace
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, sessionIds: [newId, ...w.sessionIds] } : w
    ));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('anything_llm_sessions', JSON.stringify(updated));
      return updated;
    });
    if (currentSessionId === id) {
      createNewSession();
    }
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const updateWorkspaceName = () => {
    if (!workspaceNameInput.trim()) {
      setIsEditingWorkspace(false);
      return;
    }
    setWorkspaces(prev => prev.map(w => 
      w.id === activeWorkspaceId ? { ...w, name: workspaceNameInput.trim() } : w
    ));
    setIsEditingWorkspace(false);
  };

  const createNewWorkspace = () => {
    const newId = Date.now().toString();
    const newWorkspace: Workspace = {
      id: newId,
      name: `Workspace ${workspaces.length + 1}`,
      sessionIds: [],
      activeTab: 'chat',
      securitySubView: 'menu',
      chatSubView: 'chat',
      selectedKaliTools: [],
      kaliTarget: '',
      kaliManualCommand: '',
      memoryItems: [],
      selectedAgent: 'Main Agent Orchestral',
      agentDeployments: {
        'Main Agent Orchestral': 'cloud',
        'Chat': 'cloud',
        'Sub Agent': 'local',
        'Embed Agent': 'local',
        'Scout': 'cloud'
      },
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1.0
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newId);
    createNewSession();
    setShowWorkspaceMenu(false);
  };

  const deleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return;
    const workspaceToDelete = workspaces.find(w => w.id === id);
    if (workspaceToDelete) {
      // Remove associated sessions
      setSessions(prev => {
        const updated = prev.filter(s => !workspaceToDelete.sessionIds.includes(s.id));
        localStorage.setItem('anything_llm_sessions', JSON.stringify(updated));
        return updated;
      });
    }
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (activeWorkspaceId === id) {
      const remainingWorkspaces = workspaces.filter(w => w.id !== id);
      setActiveWorkspaceId(remainingWorkspaces[0]?.id || 'default');
    }
    setShowWorkspaceMenu(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const lowerInput = input.toLowerCase().trim();
    
    // Detect Security Commands
    const scanMatch = lowerInput.match(/^scan\s+(folder|app|code|system)$/);
    const kaliTools = ['nmap', 'spiderfoot', 'metasploit', 'burp', 'wireshark', 'john'];
    const kaliMatch = kaliTools.find(tool => lowerInput.startsWith(tool));

    if (scanMatch || kaliMatch) {
      if (scanMatch) {
        setPendingTask({ type: 'scan', tool: `Scan ${scanMatch[1].charAt(0).toUpperCase() + scanMatch[1].slice(1)}` });
      } else if (kaliMatch) {
        setPendingTask({ type: 'kali', tool: input });
      }
      setInput('');
      setActiveTab('security');
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      if (!ANYTHING_LLM_API_KEY) {
        throw new Error("API Key is missing. Please configure ANYTHING_LLM_API_KEY in your settings.");
      }
      if (!ANYTHING_LLM_BASE_URL) {
        throw new Error("Base URL is missing. Please configure ANYTHING_LLM_BASE_URL.");
      }
      if (!ANYTHING_LLM_WORKSPACE_SLUG) {
        throw new Error("Workspace Slug is missing. Please configure ANYTHING_LLM_WORKSPACE_SLUG.");
      }

      const response = await fetch(`${ANYTHING_LLM_BASE_URL}/api/v1/workspace/${ANYTHING_LLM_WORKSPACE_SLUG}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANYTHING_LLM_API_KEY}`
        },
        body: JSON.stringify({
          message: currentInput,
          mode: 'chat'
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Your API key appears to be invalid or expired.");
        }
        if (response.status === 404) {
          throw new Error(`Workspace "${ANYTHING_LLM_WORKSPACE_SLUG}" not found. Please check the slug.`);
        }
        if (response.status === 500) {
          throw new Error("Server Error: The AnythingLLM instance encountered an internal error.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Connection failed with status ${response.status}`);
      }

      const data = await response.json();
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.textResponse || "The neural engine returned an empty response." 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error("AnythingLLM API Error:", error);
      const userFriendlyMessage = error.message.includes('Failed to fetch') 
        ? "Network Error: Could not reach your AnythingLLM instance. Please check your Base URL and connection."
        : error.message;
      
      setError(userFriendlyMessage);
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `⚠️ ${userFriendlyMessage}` 
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MemoryItem[] = Array.from(files).map((file: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(1) + ' KB',
      timestamp: Date.now()
    }));

    setMemoryItems(prev => [...newItems, ...prev]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMemoryItem = (id: string) => {
    setMemoryItems(prev => prev.filter(item => item.id !== id));
  };

  const backgrounds: Record<BackgroundType, string> = {
    abstract: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2564&auto=format&fit=crop',
    dark: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=2564&auto=format&fit=crop',
    minimal: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2564&auto=format&fit=crop',
    nature: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2564&auto=format&fit=crop'
  };

  const toggleBackground = () => {
    const types: BackgroundType[] = ['abstract', 'dark', 'minimal', 'nature'];
    const currentIndex = types.indexOf(background);
    const nextIndex = (currentIndex + 1) % types.length;
    setBackground(types[nextIndex]);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center p-[1.3rem] md:p-[2.6rem] overflow-hidden">
      {/* Global Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 h-[42px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Model</h2>
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => {
              const models = ['Gemini 3.1 Pro', 'Gemini 3.1 Flash', 'Claude 3.5 Sonnet', 'GPT-4o'];
              const next = models[(models.indexOf(selectedModel) + 1) % models.length];
              setSelectedModel(next);
            }}>
              <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-brand-orange whitespace-nowrap">{selectedModel}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400 group-hover:text-brand-orange transition-colors" />
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 shrink-0" />
        
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5">
            {subAgents.map((agent, i) => (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={i} 
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-white/5 flex items-center gap-1.5 shrink-0"
              >
                <div className="w-1 h-1 bg-brand-purple rounded-full" />
                <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{agent}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleBackground} className="p-2 text-slate-400 hover:text-brand-orange transition-colors">
            <Palette className="w-4 h-4" />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400 hover:text-brand-orange transition-colors">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Background Layer */}
      <motion.div 
        key={background}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={backgrounds[background]} 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </motion.div>

        {/* Main Dashboard Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 w-full max-w-[800px] bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[85vh] max-h-[850px] border border-transparent dark:border-white/5 mt-12"
        >
          {/* Browser-style Window Header */}
          <div className="h-[40px] flex items-end gap-1 px-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 relative z-30">
            <div className="flex-1 flex items-end gap-1 overflow-x-auto no-scrollbar">
              {workspaces.map(w => (
                <div key={w.id} className="group relative flex items-center">
                  {isEditingWorkspace && activeWorkspaceId === w.id ? (
                    <input
                      autoFocus
                      value={workspaceNameInput}
                      onChange={(e) => setWorkspaceNameInput(e.target.value)}
                      onBlur={updateWorkspaceName}
                      onKeyDown={(e) => e.key === 'Enter' && updateWorkspaceName()}
                      className="px-4 h-[33px] text-[8px] font-bold uppercase tracking-[0.2em] rounded-t-xl bg-white dark:bg-slate-900 text-brand-orange border-t border-x border-slate-100 dark:border-white/5 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] outline-none w-32"
                    />
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveWorkspaceId(w.id)}
                        className={`px-4 h-[33px] text-[8px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all whitespace-nowrap pr-12 ${
                          activeWorkspaceId === w.id 
                            ? 'bg-white dark:bg-slate-900 text-brand-orange border-t border-x border-slate-100 dark:border-white/5 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        {w.name}
                      </button>
                      {activeWorkspaceId === w.id && (
                        <button 
                          onClick={() => {
                            setWorkspaceNameInput(w.name);
                            setIsEditingWorkspace(true);
                          }}
                          className="absolute right-6 p-1 text-slate-300 hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all"
                          title="Rename Workspace"
                        >
                          <Settings className="w-2 h-2" />
                        </button>
                      )}
                      {workspaces.length > 1 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkspace(w.id);
                          }}
                          className="absolute right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete Workspace"
                        >
                          <Trash2 className="w-2 h-2" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              <button 
                onClick={createNewWorkspace}
                className="p-2 text-slate-400 hover:text-brand-orange transition-colors mb-1"
                title="New Workspace"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Chat Interface with Background Graphics */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">

          {/* Wave Chart as Background for Chat */}
          <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
            <WaveChart />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {chatSubView === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-[1.95rem] pb-24 space-y-4 scrollbar-hide relative z-10">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                          msg.role === 'user' 
                            ? 'bg-brand-orange text-white rounded-tr-none' 
                            : msg.content.startsWith('⚠️')
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-tl-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {msg.role === 'user' ? (
                              <User className="w-3 h-3" />
                            ) : msg.content.startsWith('⚠️') ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <Bot className="w-3 h-3 text-brand-purple" />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                              {msg.role === 'user' ? 'Operator' : 'AnythingLLM'}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-white/5 rounded-tl-none shadow-md">
                           <div className="flex gap-1">
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                           </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </>
                ) : (
                  <>
                    <div className="px-8 py-4 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative z-20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Session History</span>
                      </div>
                      <button 
                        onClick={() => setChatSubView('chat')}
                        className="text-[10px] font-bold text-brand-orange uppercase tracking-widest hover:underline"
                      >
                        Back to Chat
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-3 scrollbar-hide relative z-10">
                      {sessions.filter(s => activeWorkspace.sessionIds.includes(s.id)).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <Database className="w-12 h-12" />
                        <p className="text-xs font-bold uppercase tracking-widest">No saved sessions in this workspace</p>
                      </div>
                    ) : (
                      sessions.filter(s => activeWorkspace.sessionIds.includes(s.id)).map((session) => (
                        <div 
                          key={session.id}
                          className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all group"
                        >
                          <button 
                            onClick={() => loadSession(session)}
                            className="flex-1 text-left"
                          >
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-4">{session.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {new Date(session.timestamp).toLocaleString()} • {session.messages.length} messages
                            </p>
                          </button>
                          <button 
                            onClick={() => deleteSession(session.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
                )}
              </motion.div>
            ) : activeTab === 'research' ? (
              <motion.div 
                key="research"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 space-y-4 relative z-10"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Research Protocols</h3>
                <div className="grid gap-3">
                  {[
                    { label: 'Wide Search', desc: 'Broad spectrum data gathering', icon: Search },
                    { label: 'Deep Search', desc: 'Intensive neural pattern analysis', icon: Layers },
                    { label: 'Secure Search', desc: 'Encrypted query execution', icon: Shield },
                  ].map((opt) => (
                    <button key={opt.label} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-left group">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                        <opt.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'security' ? (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 space-y-4 relative z-10 overflow-y-auto no-scrollbar"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {securitySubView === 'menu' ? 'Security Operations' : 
                     securitySubView === 'local-scan' ? 'Local Security Scan' : 'Kali Terminal Suite'}
                  </h3>
                  {securitySubView !== 'menu' && (
                    <button 
                      onClick={() => setSecuritySubView('menu')}
                      className="text-[10px] font-bold text-brand-orange uppercase tracking-widest hover:underline"
                    >
                      Back to Menu
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {securitySubView === 'menu' ? (
                    <motion.div 
                      key="menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid gap-3"
                    >
                      <button 
                        onClick={() => setSecuritySubView('local-scan')}
                        className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-left group"
                      >
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Local Security Scan</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Folder, App, Code, or System Integrity</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => setSecuritySubView('kali-terminal')}
                        className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-left group"
                      >
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Kali Terminal</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Advanced penetration testing environment</p>
                        </div>
                      </button>
                    </motion.div>
                  ) : securitySubView === 'local-scan' ? (
                    <motion.div 
                      key="local-scan"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {[
                        { label: 'Scan Folder', icon: FolderKanban, id: 'folder' },
                        { label: 'Scan App', icon: LayoutGrid, id: 'app' },
                        { label: 'Scan Code', icon: Bug, id: 'code' },
                        { label: 'Full System', icon: Activity, id: 'system' },
                      ].map((opt) => (
                        <button 
                          key={opt.id} 
                          onClick={() => setPendingTask({ type: 'scan', tool: opt.label })}
                          className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-center group"
                        >
                          <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                            <opt.icon className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{opt.label}</p>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="kali"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Nmap', desc: 'Network Mapper' },
                          { label: 'Spiderfoot', desc: 'OSINT Automation' },
                          { label: 'Metasploit', desc: 'Exploitation' },
                          { label: 'Burp Suite', desc: 'Web Proxy' },
                          { label: 'Wireshark', desc: 'Packet Analysis' },
                          { label: 'John', desc: 'Password Cracker' },
                        ].map((tool) => (
                          <button 
                            key={tool.label}
                            onClick={() => {
                              setSelectedKaliTools(prev => 
                                prev.includes(tool.label) 
                                  ? prev.filter(t => t !== tool.label) 
                                  : [...prev, tool.label]
                              );
                            }}
                            className={`p-3 rounded-xl border transition-all text-left group ${
                              selectedKaliTools.includes(tool.label)
                                ? 'bg-brand-orange/10 border-brand-orange shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 hover:border-brand-orange/50'
                            }`}
                          >
                            <p className={`text-xs font-bold transition-colors ${
                              selectedKaliTools.includes(tool.label)
                                ? 'text-brand-orange'
                                : 'text-slate-900 dark:text-white group-hover:text-brand-orange'
                            }`}>{tool.label}</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{tool.desc}</p>
                          </button>
                        ))}
                      </div>

                      {selectedKaliTools.length > 0 && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setPendingTask({ 
                            type: 'kali', 
                            tool: selectedKaliTools.join(', '),
                            target: kaliTarget || undefined
                          })}
                          className="w-full py-3 bg-brand-orange text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20"
                        >
                          Prepare Execution ({selectedKaliTools.length})
                        </motion.button>
                      )}

                      <div className="p-4 bg-slate-900 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Search className="w-3 h-3 text-brand-orange" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Specification</span>
                        </div>
                        <input 
                          type="text"
                          value={kaliTarget}
                          onChange={(e) => setKaliTarget(e.target.value)}
                          placeholder="Enter target (IP, Domain, Folder)..."
                          className="w-full bg-transparent text-slate-200 text-xs focus:outline-none font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && kaliTarget) {
                              setPendingTask({ 
                                type: 'kali', 
                                tool: selectedKaliTools.length > 0 ? selectedKaliTools.join(', ') : 'Custom Scan', 
                                target: kaliTarget 
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-3 h-3 text-brand-orange" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manual Command</span>
                        </div>
                        <input 
                          type="text"
                          value={kaliManualCommand}
                          onChange={(e) => setKaliManualCommand(e.target.value)}
                          placeholder="Enter kali command..."
                          className="w-full bg-transparent text-slate-200 text-xs focus:outline-none font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && kaliManualCommand) {
                              setPendingTask({ type: 'kali', tool: kaliManualCommand });
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task Summary Overlay */}
                <AnimatePresence>
                  {pendingTask && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 flex items-center justify-center p-6"
                    >
                      <div className="w-full max-w-sm space-y-6 text-center">
                        <div className="flex justify-center">
                          <div className="p-4 bg-brand-orange/10 rounded-full">
                            <Zap className="w-8 h-8 text-brand-orange" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Task Summary</h4>
                          <p className="text-xs text-slate-400 uppercase tracking-widest">Review before execution</p>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-white/5 text-left space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">{pendingTask.type === 'scan' ? 'Security Scan' : 'Kali Execution'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target/Tool</span>
                            <span className="text-xs font-bold text-brand-orange">{pendingTask.target || pendingTask.tool}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Search</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Enabled</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => setPendingTask(null)}
                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              const msg = `Executing ${pendingTask.type === 'scan' ? 'security scan' : 'Kali command'}: ${pendingTask.tool}. Secure search active.`;
                              setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `🚀 ${msg}\n\nTask initiated successfully. Monitoring neural feedback...` }]);
                              setPendingTask(null);
                              setSelectedKaliTools([]);
                              setKaliTarget('');
                              setKaliManualCommand('');
                              setActiveTab('chat');
                            }}
                            className="flex-1 py-3 bg-brand-orange text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20"
                          >
                            Execute Y
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : activeTab === 'workspace' ? (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 space-y-4 relative z-10"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workspace Management</h3>
                <div className="grid gap-3">
                  {[
                    { label: 'Create Project Workspace', desc: 'Initialize new neural environment', icon: LayoutGrid },
                    { label: 'Delete Workspace', desc: 'Permanent resource deallocation', icon: Bug },
                  ].map((opt) => (
                    <button key={opt.label} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-left group">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                        <opt.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'tools' ? (
              <motion.div 
                key="tools"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 space-y-4 relative z-10"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skills & Tools</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tools List', icon: Wrench },
                    { label: 'Add Tools', icon: Zap },
                    { label: 'Remove Tools', icon: Bug },
                    { label: 'Upgrade Tools', icon: Maximize2 },
                  ].map((opt) => (
                    <button key={opt.label} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/50 transition-all text-center group">
                      <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'system' ? (
              <motion.div 
                key="system"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 space-y-6 relative z-10 flex flex-col overflow-y-auto no-scrollbar"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model Configuration</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Engine Online</span>
                  </div>
                </div>

                {/* Agent Selection */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Active Agent</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Main Agent Orchestral', 'Chat', 'Sub Agent', 'Embed Agent', 'Scout'].map((agent, index) => (
                      <div 
                        key={agent} 
                        className={`flex flex-col gap-1 ${
                          (index === 1 || index === 2) ? 'h-[68px] w-[300px]' : ''
                        }`}
                      >
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            selectedAgent === agent 
                              ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20' 
                              : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:border-brand-orange/30'
                          }`}
                        >
                          {agent}
                        </button>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
                          <button 
                            onClick={() => setAgentDeployments(prev => ({ ...prev, [agent]: 'local' }))}
                            className={`flex-1 py-1 text-[7px] font-bold uppercase rounded-md transition-all ${agentDeployments[agent] === 'local' ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm' : 'text-slate-400'}`}
                          >
                            Local
                          </button>
                          <button 
                            onClick={() => setAgentDeployments(prev => ({ ...prev, [agent]: 'cloud' }))}
                            className={`flex-1 py-1 text-[7px] font-bold uppercase rounded-md transition-all ${agentDeployments[agent] === 'cloud' ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm' : 'text-slate-400'}`}
                          >
                            Cloud
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuration Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Parameters</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Max Tokens</label>
                        <span className="text-[10px] font-mono text-brand-orange">{maxTokens}</span>
                      </div>
                      <input 
                        type="range" min="256" max="8192" step="256" 
                        value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Temperature</label>
                        <span className="text-[10px] font-mono text-brand-orange">{temperature.toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="2" step="0.1" 
                        value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Top P</label>
                        <span className="text-[10px] font-mono text-brand-orange">{topP.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.05" 
                        value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Agent Stats */}
                  <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Performance Metrics: {selectedAgent}</p>
                    <div className="space-y-4">
                      {[
                        { task: 'Reasoning', score: AGENT_STATS_DATA[selectedAgent]?.reasoning || 0 },
                        { task: 'Coding', score: AGENT_STATS_DATA[selectedAgent]?.coding || 0 },
                        { task: 'Creative', score: AGENT_STATS_DATA[selectedAgent]?.creative || 0 },
                        { task: 'Speed', score: AGENT_STATS_DATA[selectedAgent]?.speed || 0 },
                      ].map((stat) => (
                        <div key={stat.task} className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-slate-500">{stat.task}</span>
                            <span className="text-slate-900 dark:text-white">{stat.score}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              key={`${selectedAgent}-${stat.task}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.score}%` }}
                              className="h-full bg-brand-orange"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Agent Specialization</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-orange/10 rounded-lg">
                        {agentDeployments[selectedAgent] === 'local' ? <Cpu className="w-3 h-3 text-brand-orange" /> : <Cloud className="w-3 h-3 text-brand-orange" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{selectedAgent}</p>
                          <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${agentDeployments[selectedAgent] === 'local' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {agentDeployments[selectedAgent]}
                          </span>
                        </div>
                        <p className="text-[8px] text-slate-500 uppercase">{AGENT_STATS_DATA[selectedAgent]?.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Best for Task (Leaderboard)</p>
                    <div className="space-y-2">
                      {TASK_LEADERBOARD.slice(0, 3).map((item) => (
                        <div key={item.task} className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-medium">{item.task}</span>
                          <span className="text-[9px] font-bold text-brand-orange uppercase">{item.best}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="memory"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 p-8 relative z-10 flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vector Database</h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Memory management protocols active</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20"
                  >
                    <Upload className="w-3 h-3" />
                    Upload Media
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    multiple 
                    className="hidden" 
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                  {memoryItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                      <Database className="w-12 h-12 text-slate-400" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No data stored in memory</p>
                    </div>
                  ) : (
                    memoryItems.map((item) => {
                      const isImage = item.type.startsWith('image/');
                      const isVideo = item.type.startsWith('video/');
                      const isAudio = item.type.startsWith('audio/');
                      const Icon = isImage ? ImageIcon : isVideo ? Video : isAudio ? Music : FileText;
                      
                      return (
                        <div key={item.id} className="group flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-brand-orange/30 transition-all">
                          <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-brand-orange transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-slate-400 uppercase font-medium">{item.size}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-medium">•</span>
                              <span className="text-[10px] text-slate-400 uppercase font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeMemoryItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Chat Bar (Higher Position) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] z-20">
            <div className="relative flex items-center group">
              <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl -m-1 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Command AnythingLLM..."
                disabled={isLoading}
                className="relative w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all shadow-xl dark:text-white disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 p-3 bg-slate-900 dark:bg-brand-orange text-white rounded-xl hover:bg-slate-800 dark:hover:bg-brand-orange/80 transition-all active:scale-95 z-10 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Dock Trigger Area */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-24 z-20 flex items-end justify-center pb-8"
        onMouseEnter={() => setIsDockVisible(true)}
        onMouseLeave={() => setIsDockVisible(false)}
      >
        <AnimatePresence>
          {isDockVisible && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="max-w-[95vw] md:max-w-4xl overflow-hidden"
            >
              <div className="flex gap-3 p-3 bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-x-auto scrollbar-hide no-scrollbar">
                <div className="flex gap-3 shrink-0">
                  <DockItem icon={Database} label="Memory" onClick={() => setActiveTab('memory')} />
                  <DockItem icon={Cpu} label="Model Config" onClick={() => setActiveTab('system')} />
                  <DockItem icon={Shield} label="Security" onClick={() => setActiveTab('security')} />
                  <DockItem icon={Zap} label="Performance" onClick={() => setActiveTab('system')} />
                  <DockItem icon={Maximize2} label="Context Window" onClick={() => setActiveTab('system')} />
                </div>
                
                <div className="w-px h-8 bg-white/10 self-center mx-1 shrink-0" />
                
                <div className="flex gap-3 shrink-0">
                  <DockItem icon={Zap} label="New Chat" onClick={() => { setActiveTab('chat'); createNewSession(); }} />
                  <DockItem icon={MessageSquare} label="History" onClick={() => { setActiveTab('chat'); setChatSubView('sessions'); }} />
                  <DockItem icon={FolderKanban} label="Projects" onClick={() => setActiveTab('workspace')} />
                  <DockItem icon={Search} label="Research" onClick={() => setActiveTab('research')} />
                  <DockItem icon={LayoutGrid} label="Applications" onClick={() => setActiveTab('workspace')} />
                  <DockItem icon={Wrench} label="Skills" onClick={() => setActiveTab('tools')} />
                  <DockItem icon={Bug} label="Self Debug" onClick={() => setActiveTab('system')} />
                </div>
                
                <div className="w-px h-8 bg-white/10 self-center mx-1 shrink-0" />
                
                <div className="flex gap-3 shrink-0">
                  <DockItem icon={Palette} label="Background" onClick={toggleBackground} />
                  <DockItem icon={darkMode ? Sun : Moon} label={darkMode ? "Light Mode" : "Dark Mode"} onClick={() => setDarkMode(!darkMode)} />
                  <DockItem icon={Settings} label="Settings" onClick={() => setActiveTab('system')} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hint for dock */}
        {!isDockVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="w-12 h-1 bg-white/30 rounded-full mb-4"
          />
        )}
      </div>

      {/* Floating Labels (Inspired by the Image) */}
      <div className="fixed bottom-8 right-8 text-right pointer-events-none hidden md:block">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-tight">
          AnythingLLM v1.0<br />
          Neural Engine Active
        </p>
        <p className="text-white/60 text-sm font-bold uppercase tracking-widest mt-4">
          OVER 1000 OF<br />
          EDITABLE GRAPHS
        </p>
      </div>
      
      <div className="fixed bottom-8 left-8 max-w-[200px] pointer-events-none hidden md:block">
        <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider leading-relaxed">
          Designed for high-performance AI orchestration and real-time cognitive monitoring.
        </p>
      </div>
    </div>
  );
}
