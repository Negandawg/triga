import { Cpu, Database, Lock, Zap, Code, BarChart } from "lucide-react"

export function TechnologySection() {
  const technologies = [
    {
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      title: "Advanced AI Models",
      description:
        "Utilizing state-of-the-art large language models fine-tuned specifically for blockchain data and smart contract analysis. Our models are trained on millions of Solana transactions and contracts.",
    },
    {
      icon: <Database className="w-8 h-8 text-blue-400" />,
      title: "Real-time Blockchain Data",
      description:
        "Direct integration with Solana's blockchain for real-time transaction monitoring, smart contract analysis, and market data. Get insights as they happen with microsecond latency.",
    },
    {
      icon: <Lock className="w-8 h-8 text-green-400" />,
      title: "Secure Architecture",
      description:
        "End-to-end encryption and secure wallet integration ensures your data and assets remain protected at all times. Zero-knowledge proofs for privacy-preserving analytics.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "High-Performance Backend",
      description:
        "Built on a distributed computing architecture capable of handling thousands of concurrent requests with minimal latency. Optimized for the high throughput of Solana's blockchain.",
    },
    {
      icon: <Code className="w-8 h-8 text-red-400" />,
      title: "Developer SDK",
      description:
        "Comprehensive SDK allowing developers to integrate Mydian AI capabilities directly into their dApps and services. Available in TypeScript, Python, Rust, and more.",
    },
    {
      icon: <BarChart className="w-8 h-8 text-indigo-400" />,
      title: "Predictive Analytics",
      description:
        "Advanced statistical models for market trend prediction, risk assessment, and opportunity identification. Stay ahead of the market with AI-powered insights.",
    },
  ]

  return (
    <section id="technology" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Cutting-Edge Technology</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Mydian AI combines advanced artificial intelligence with blockchain technology to create a powerful,
            intuitive assistant for the Solana ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 transition-all duration-300 hover:border-purple-500/70 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] group"
            >
              <div className="mb-4 bg-gradient-to-br from-purple-900/50 to-black/50 p-3 rounded-full inline-block">
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 gradient-text">{tech.title}</h3>
              <p className="text-gray-300">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Add default export that points to the named export
export default TechnologySection
