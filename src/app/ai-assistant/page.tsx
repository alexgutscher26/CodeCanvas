import { Metadata } from "next"
import { Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Assistant - CodeCanvas",
  description: "Your intelligent coding companion",
}

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
          <Zap className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
          AI Assistant
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Your intelligent coding companion that helps you write better code, faster.
          Get real-time suggestions, code explanations, and best practices as you code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900/80 
            transition-all duration-300 group"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    title: "Code Completion",
    description: "Get intelligent code suggestions as you type, helping you code faster and with fewer errors.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Code Review",
    description: "Receive instant feedback on your code quality, security, and performance.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Documentation",
    description: "Generate comprehensive documentation for your code automatically.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Code Explanation",
    description: "Get detailed explanations of complex code snippets and functions.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Best Practices",
    description: "Learn and apply coding best practices with real-time suggestions.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Error Detection",
    description: "Identify and fix potential errors before they become problems.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
  },
]
