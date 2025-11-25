import { 
  Brain, 
  Database, 
  Layout, 
  Eye, 
  Layers, 
  Code2, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Wrench, 
  Star, 
  Trophy, 
  Award,
  Share2
} from 'lucide-react';

export const projects = [
  {
    title: "Adaptive Entropy UDA",
    desc: "Universal Domain Adaptation framework using entropy-guided pseudo-labeling and dynamic rejection loss for non-overlapping label spaces.",
    tags: ["PyTorch", "Deep Learning", "Research", "Domain Adaptation"],
    category: "ML/DL",
    icon: Layers,
    color: "purple",
    link: "https://github.com/SaadH-077/Adaptive-Entropy-Guided-Universal-Domain-Adaptation_AEG-UDA-"
  },
  {
    title: "Road Damage Detection",
    desc: "Multi-label classification system identifying 26 road damage types using ResNet50, InceptionV3, and VGG16 with transfer learning.",
    tags: ["PyTorch", "Computer Vision", "Deep Learning"],
    category: "ML/DL",
    icon: Eye,
    color: "red",
    link: "https://github.com/SaadH-077/Road-Damage-Classification-Using-ResNet50-InceptionV3-and-VGG16-A-Deep-Learning-Approach",
    architecture: {
      nodes: [
        { id: 'input', label: 'Input Images', type: 'client', desc: 'Road surface dataset (26 classes)' },
        { id: 'backbone1', label: 'ResNet50', type: 'ai', desc: 'Feature extraction backbone 1' },
        { id: 'backbone2', label: 'InceptionV3', type: 'ai', desc: 'Feature extraction backbone 2' },
        { id: 'fusion', label: 'Feature Fusion', type: 'service', desc: 'Concatenation of feature vectors' },
        { id: 'output', label: 'Classifier', type: 'code', desc: 'Softmax layer for damage type prediction' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "python",
      code: `class RoadDamageClassifier(nn.Module):
    def __init__(self, num_classes=26):
        super(RoadDamageClassifier, self).__init__()
        # Load pretrained backbones
        self.resnet = models.resnet50(pretrained=True)
        self.inception = models.inception_v3(pretrained=True)
        
        # Freeze early layers
        for param in self.resnet.parameters():
            param.requires_grad = False
            
        # Fusion Layer
        self.fusion = nn.Sequential(
            nn.Linear(2048 + 2048, 1024),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(1024, num_classes)
        )

    def forward(self, x):
        f1 = self.resnet(x)
        f2 = self.inception(x)
        combined = torch.cat((f1, f2), dim=1)
        return self.fusion(combined)`
    }
  },
  {
    title: "Federated Learning Opt.",
    desc: "Benchmarking FedAvg, SCAFFOLD, FedGH & FedSAM algorithms on non-IID MNIST data for distributed training efficiency.",
    tags: ["Federated Learning", "Optimization", "Python"],
    category: "ML/DL",
    icon: Share2,
    color: "blue",
    link: "https://github.com/SaadH-077/Federated-Learning-Optimization"
  },
  {
    title: "Neural Network Pruning",
    desc: "Comparative analysis of structured/unstructured pruning and Lottery Ticket Hypothesis with Knowledge Distillation for model compression.",
    tags: ["Model Compression", "PyTorch", "Research"],
    category: "ML/DL",
    icon: Zap,
    color: "orange",
    link: "https://github.com/SaadH-077/DeepPruning-ATML"
  },
  {
    title: "SmartCourseAdvisor",
    desc: "RAG-based academic advisor using Mistral-7B and ChromaDB. Provides personalized university course recommendations based on student history.",
    tags: ["RAG", "Mistral-7B", "LangChain", "Gradio"],
    category: "GenAI / NLP",
    icon: MessageSquare,
    color: "pink",
    link: "https://github.com/SaadH-077/SmartCourseAdvisor-RAG",
    architecture: {
      nodes: [
        { id: 'ui', label: 'Student Interface', type: 'client', desc: 'Gradio/React Web UI for query input' },
        { id: 'orch', label: 'LangChain Orchestrator', type: 'server', desc: 'Context retrieval & prompt construction' },
        { id: 'llm', label: 'Mistral-7B', type: 'ai', desc: 'LLM for reasoning & response generation' },
        { id: 'vec', label: 'ChromaDB', type: 'database', desc: 'Vector store for course catalog embeddings' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "python",
      code: `class RAGAdvisor:
    def __init__(self, model_name="mistralai/Mistral-7B-v0.1"):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.db = Chroma(persist_directory="./db", embedding_function=self.embeddings)
        self.llm = HuggingFacePipeline.from_model_id(
            model_id=model_name,
            task="text-generation",
            pipeline_kwargs={"max_new_tokens": 512}
        )
    
    def get_recommendation(self, query, student_history):
        # Retrieve relevant course descriptions
        docs = self.db.similarity_search(query, k=3)
        context = "\\n".join([d.page_content for d in docs])
        
        # Construct prompt with history and context
        prompt = f"""
        Student History: {student_history}
        Available Courses: {context}
        Question: {query}
        
        Recommend courses that align with the student's history and query:
        """
        return self.llm(prompt)`
    }
  },
  {
    title: "Vision3D Landmark Recon",
    desc: "3D reconstruction pipeline using ORB features and triangulation to generate 3D point clouds from 2D multi-view images.",
    tags: ["Computer Vision", "OpenCV", "3D Reconstruction"],
    category: "Computer Vision",
    icon: Eye,
    color: "green",
    link: "https://github.com/SaadH-077/Vision3D-Landmark-Recon"
  },
  {
    title: "EmployNet Portal",
    desc: "Full-stack HR management system enabling companies to automate payroll, attendance, and benefits. Features role-based access control.",
    tags: ["MERN Stack", "React.js", "Node.js", "MongoDB"],
    category: "Software Engineering",
    icon: Layout,
    color: "cyan",
    link: "https://github.com/SaadH-077/EmployNet",
    architecture: {
      nodes: [
        { id: 'web', label: 'Admin Dashboard', type: 'client', desc: 'React.js SPA with Redux state management' },
        { id: 'api', label: 'Express REST API', type: 'server', desc: 'Node.js backend with JWT Auth middleware' },
        { id: 'db', label: 'MongoDB Atlas', type: 'database', desc: 'NoSQL database for employee records' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "javascript",
      code: `const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    // Check role-based access
    if (req.path.includes('/admin') && user.role !== 'admin') {
      return res.status(403).send({ error: 'Access denied. Admin only.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};`
    }
  },
  {
    title: "TradeBiz Platform",
    desc: "Real-time trading platform with live offers, WebSocket integration, and secure authentication for seamless marketplace transactions.",
    tags: ["MERN Stack", "Socket.IO", "TypeScript"],
    category: "Software Engineering",
    icon: BarChart3,
    color: "blue",
    link: "https://github.com/SaadH-077/tradebiz-mern",
    architecture: {
      nodes: [
        { id: 'ui', label: 'Trading Dashboard', type: 'client', desc: 'React + TypeScript UI with real-time charts' },
        { id: 'ws', label: 'Socket.IO Server', type: 'server', desc: 'Real-time bidirectional event handling' },
        { id: 'api', label: 'REST API', type: 'server', desc: 'Express.js backend for order management' },
        { id: 'db', label: 'MongoDB', type: 'database', desc: 'Transactional data storage' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "typescript",
      code: `// WebSocket Order Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe_market', (symbol: string) => {
    socket.join(symbol);
    // Send initial snapshot
    const snapshot = await OrderBook.getSnapshot(symbol);
    socket.emit('market_snapshot', snapshot);
  });

  socket.on('place_order', async (order: Order) => {
    try {
      const result = await MatchingEngine.process(order);
      
      // Broadcast updates to subscribers
      io.to(order.symbol).emit('order_book_update', result.bookUpdates);
      
      // Notify specific user
      if (result.trade) {
        io.to(result.trade.buyerId).emit('trade_executed', result.trade);
        io.to(result.trade.sellerId).emit('trade_executed', result.trade);
      }
    } catch (error) {
      socket.emit('order_error', { message: error.message });
    }
  });
});`
    }
  },
  {
    title: "DananasBB Website",
    desc: "Modern, responsive website for a Toronto-based burger chain. Features a custom Spotify player integration, immersive UI/UX design, and seamless navigation.",
    tags: ["HTML/CSS", "Tailwind CSS", "JavaScript", "UI/UX"],
    category: "Software Engineering",
    icon: Layout,
    color: "yellow",
    link: "https://github.com/SaadH-077/DananasBB-Website",
    architecture: {
      nodes: [
        { id: 'ui', label: 'Frontend UI', type: 'client', desc: 'Responsive HTML5/Tailwind interface' },
        { id: 'audio', label: 'Spotify Player', type: 'service', desc: 'Custom audio player integration' },
        { id: 'ux', label: 'UX Design', type: 'design', desc: 'Modern aesthetic with smooth interactions' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "javascript",
      code: `// Custom Audio Player Logic
const togglePlay = () => {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('play-btn');
  
  if (audio.paused) {
    audio.play();
    btn.classList.add('playing');
    startVisualizer();
  } else {
    audio.pause();
    btn.classList.remove('playing');
    stopVisualizer();
  }
};

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});`
    }
  },
  {
    title: "Saad.AI Portfolio",
    desc: "The recursive architecture of this very website. A React-based cyber-interface featuring 3D visualization, terminal emulation, and agentic UI patterns.",
    tags: ["React", "Three.js", "Framer Motion", "Vite"],
    category: "Software Engineering",
    icon: Code2,
    color: "cyan",
    link: "https://github.com/SaadH-077/saad-ai-portfolio",
    architecture: {
      nodes: [
        { id: 'client', label: 'React Client', type: 'client', desc: 'Vite-powered SPA with Framer Motion animations' },
        { id: '3d', label: 'Three.js Engine', type: 'ai', desc: 'R3F Canvas for Holographic Globe & Neural Background' },
        { id: 'state', label: 'State Manager', type: 'service', desc: 'React Hooks & Context for Terminal/Guide state' },
        { id: 'deploy', label: 'Vercel Edge', type: 'server', desc: 'CI/CD Pipeline & Global CDN Distribution' }
      ],
      edges: []
    },
    codeSnippet: {
      language: "jsx",
      code: `// FIXED
function App() {
  const [loading, setLoading] = useState(true);
  const [terminalMode, setTerminalMode] = useState(false);

  // Initialize the Cyber-Interface
  useEffect(() => {
    const initSystem = async () => {
      await loadAssets();
      setLoading(false);
    };
    initSystem();
  }, []);

  return (
    <div className="cyber-container">
      <NeuralBackground />
      <AnimatePresence>
        {loading ? <Preloader /> : (
          <MainInterface>
            <HeroSection />
            <ArchitectureView />
            <TerminalOverlay active={terminalMode} />
          </MainInterface>
        )}
      </AnimatePresence>
    </div>
  );
}`
    }
  }
];

export const technicalSkills = [
  { 
    category: "Agentic & Multimodal AI", 
    items: ["LangGraph", "LangChain", "RAG", "HuggingFace", "Ollama", "Oracle AI Agent Studio", "Mistral", "Whisper", "TTS", "TTV"], 
    icon: Zap, 
    color: "blue" 
  },
  { 
    category: "Cloud & DevOps", 
    items: ["Docker", "Git", "Oracle Cloud Infrastructure (OCI)", "Azure", "Vercel", "CI/CD"], 
    icon: Wrench, 
    color: "orange" 
  },
  { 
    category: "Machine Learning & Deep Learning", 
    items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "FastAI", "OpenCV"], 
    icon: Brain, 
    color: "purple" 
  },
  { 
    category: "Natural Language Processing (NLP)", 
    items: ["LLMs", "Sentiment Analysis", "Prompt Engineering", "Transformers"], 
    icon: MessageSquare, 
    color: "pink" 
  },
  { 
    category: "Computer Vision", 
    items: ["Vision Transformers (ViTs)", "GANs", "CycleGANs", "GNNs", "Object Detection", "Semantic Segmentation"], 
    icon: Eye, 
    color: "green" 
  },
  { 
    category: "Data Engineering & Analysis", 
    items: ["Oracle Analytics", "BeautifulSoup", "Selenium", "ChromiumDriver", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Tableau", "Power BI"], 
    icon: BarChart3, 
    color: "yellow" 
  },
  { 
    category: "Full Stack & Databases", 
    items: ["FastAPI", "PostgreSQL", "React.js", "MERN", "MongoDB", "Flask", "Streamlit", "Gradio", "n8n"], 
    icon: Code2, 
    color: "cyan" 
  },
  { 
    category: "Programming Languages", 
    items: ["Python", "C/C++", "SQL", "HTML/CSS", "JavaScript"], 
    icon: Code2, 
    color: "cyan" 
  },
];

export const awards = [
  { 
    title: "Award of Distinction", 
    desc: "Received for outstanding academic achievement in BS Computer Science (Class of 2025) at LUMS.", 
    icon: Trophy, 
    color: "yellow" 
  },
  { 
    title: "Dean's Honour List '23-24", 
    desc: "Ranked in top tier for exceptional GPA (>3.6). Third consecutive year of recognition for academic excellence.", 
    icon: Star, 
    color: "purple" 
  },
  { 
    title: "Dean's Honour List '22-23", 
    desc: "Awarded for consistent academic excellence and exceeding performance expectations in Sophomore year.", 
    icon: Star, 
    color: "pink" 
  },
  { 
    title: "Dean's Honour List '21-22", 
    desc: "Recognized for high academic standing and remarkable grade point average in Freshman year.", 
    icon: Star, 
    color: "blue" 
  },
  { 
    title: "Winner - PuYPT", 
    desc: "1st Place in Punjab Young Physicist Tournament (2019). Presented and defended scientific research.", 
    icon: Award, 
    color: "cyan" 
  },
  { 
    title: "Runner Up - PYPT", 
    desc: "2nd Place in Pakistan Young Physicist Tournament (2020). National level research competition.", 
    icon: Award, 
    color: "green" 
  },
  { 
    title: "Full Merit Scholarship", 
    desc: "Awarded 100% Scholarship for A-Levels at LGS based on outstanding O-Level CAIE results.", 
    icon: Zap, 
    color: "orange" 
  },
  { 
    title: "Best Event Head", 
    desc: "Winner Best Event Head at LUMS Psifi XV, organizing one of the largest science olympiads.", 
    icon: Trophy, 
    color: "pink" 
  }
];

export const certifications = [
  {
    title: "Oracle AI Vector Search Certified Professional",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=5D547741F31B4FF9327D6BDBDD978268BF1992C8ECD79C90CEB301BA53F95EF7",
    issuer: "Oracle",
    date: "2025"
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=5FC9D70F00D29495B63E592EE15C1D85477913F46D3CCB7E169D2A1BD6EBF62D",
    issuer: "Oracle",
    date: "2025"
  },
  {
    title: "Oracle Fusion AI Agent Studio Certified Foundations Associate - Rel 1",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=2C804A9DDCCCFD1C04EE3F05430236E92DD28444A987611BD996187D8F5AEE31",
    issuer: "Oracle",
    date: "2025"
  },
  {
    title: "Oracle Analytics Cloud 2025 Certified Professional",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C6F31652CAB712DEFBA062627B837D35F413BA8E8A88E7C12C41776FBFA0A537",
    issuer: "Oracle",
    date: "2025"
  }
];

export const experience = [
  {
    title: "Associate Software Engineer",
    company: "GoSaaS, Inc. | Agentic AI Dept",
    date: "JUL 2025 - PRESENT",
    color: "cyan",
    points: [
      "Leading the Development of AI Agents for Enterprise Solutions within Oracle Infrastructure, managing a team of 3 AI Engineers.",
      "Contributed to the development of \"GoSaaS Financial AI,\" an AI-powered framework that enables financial clients to automatically generate accurate and company-specific financial presentations from uploaded data and MD&A documents, eliminating the need for manual quarterly deck preparation.",
      "Build and deploy AI agents using Oracle’s AI Agent Studio to automate workflows for diverse client needs. Leading integrations and have developed agents for multiple healthcare and logistics departments within Oracle’s infrastructure.",
      "Design AI-powered analytics dashboards in Oracle Analytics Cloud using client-specific KPIs. Responsibilities include constructing semantic models, publishing business unit reports, and creating interactive visualizations to drive actionable business insights."
    ]
  },
  {
    title: "Head Teaching Assistant | CS 437: Deep Learning",
    company: "Lahore University of Management Sciences",
    date: "JAN 2025 - JUN 2025",
    color: "purple",
    points: [
      "Led a team of 5 undergraduate & 2 Graduate TAs, coordinating all course logistics, including Slack communication, LMS updates, and email correspondence for over 170+ students.",
      "Constructed 6 rigorous Pytorch Programming Modules covering core Deep Learning fundamentals such as CNNs, Optimizers, Autoencoders, Segmentation models, PixelCNNs, VAEs, GANs, RNNs, LSTMs, Vision Transformers (ViTs), Stable Diffusion, Graph Neural Networks (GNNs), and Neural Network Compression techniques.",
      "Designed key knowledge testing Quizzes for the course covering extensive deep-learning topics to assess students’ conceptual understanding. Graded exams and quizzes, ensuring fair assessment while providing detailed feedback to students.",
      "Delivered weekly tutorial sessions, breaking down complex deep learning architectures and optimization strategies.",
      "Held office hours twice a week, mentoring students on debugging models, fine-tuning architectures, and improving their PyTorch-based implementations.",
      "Managed research-oriented deep learning projects for 170+ students, guiding them through real-world applications and model evaluation techniques."
    ]
  },
  {
    title: "Teaching Assistant | CS 535: Machine Learning",
    company: "Lahore University of Management Sciences",
    date: "SEP 2024 - DEC 2024",
    color: "blue",
    points: [
      "Designed programming assignments on Naïve Bayes Classifiers, K-Nearest Neighbors (KNN), Recurrent Neural Networks (RNNs), and Neural Networks, ensuring hands-on implementation of core ML models.",
      "Developed and graded quizzes to assess conceptual understanding and problem-solving skills for a class of 130 students.",
      "Managed and provided guidance for a hands-on practical project, helping students apply ML techniques to real-world datasets and evaluate model performance.",
      "Graded assignments and provided detailed feedback, helping students refine their ML implementations and debugging techniques.",
      "Held office hours twice a week, assisting students with conceptual difficulties and debugging their ML models.",
      "Conducted one-on-one mentoring sessions, guiding students on improving their ML model training, optimization, and evaluation strategies."
    ]
  },
  {
    title: "Teaching Assistant | CS 331: Introduction to AI",
    company: "Lahore University of Management Sciences",
    date: "JAN 2024 - AUG 2024",
    color: "green",
    points: [
      "Designed and delivered class tutorials on Linear Regression, Logistic Regression, K-Nearest Neighbors (KNN), Support Vector Machines (SVMs), Decision Trees, and Neural Networks, reinforcing theoretical concepts with practical coding examples.",
      "Developed rigorous programming assignments, ensuring students gained hands-on experience in implementing core AI algorithms efficiently.",
      "Graded quizzes and assignments for a class of 131 students, providing detailed feedback to improve their understanding and implementation of AI models.",
      "Conducted interactive problem-solving sessions, helping students debug their AI implementations and refine their approaches.",
      "Held office hours for one-on-one mentoring, assisting students in overcoming conceptual difficulties and improving their programming logic."
    ]
  },
  {
    title: "Undergraduate Research Assistant",
    company: "Center for Speech and Language Technologies (CSaLT)",
    date: "SEP 2022 - JUN 2025",
    color: "pink",
    points: [
      "Designed and developed a Generative AI-based storytelling framework, integrating Large Language Models (LLMs), Text-to-Speech (TTS), and Text to-Video (TTV) models to generate structured narratives.",
      "Engineered a multi-agent storytelling system, incorporating Propp’s Narrative Functions & Freytag’s Pyramid to create coherent, engaging AI-generated stories.",
      "Built an interactive web-based platform allowing users to co-create stories with AI, featuring LLM guardrails for content safety.",
      "Conducted A/B testing and user studies, refining AI-generated storytelling for improved user engagement and narrative quality.",
      "Partnered with AIHC Lab & SIMS Hospital, analyzing speech markers of 100+ patients to develop AI-driven mental health diagnostics.",
      "Built custom tokenization and corpus development tools to improve Urdu NLP accessibility."
    ]
  },
  {
    title: "Student Partner - Generative AI Workshops",
    company: "LUMS Learning Institute",
    date: "MAY 2024 - SEP 2024",
    color: "orange",
    points: [
      "Assisted in designing, developing, and delivering workshops on Generative AI for industry professionals.",
      "Conducted hands-on training sessions on prompt engineering, Retrieval Augmented Generation (RAG), and AI-powered automation.",
      "Led workshops on Generative AI for Developers, Healthcare AI Applications (CHPE), and AI for the Fashion Industry.",
      "Engaged with corporate professionals, educators, and researchers, ensuring practical understanding of LLM applications and AI workflows."
    ]
  }
];
