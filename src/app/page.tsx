import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Left Side - Conceptual Sketch */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="relative w-80 h-80">
            {/* Abstract Geometric Representation of Conceptual Alchemy */}
            <svg viewBox="0 0 320 320" className="w-full h-full">
              {/* Background Circle - Experience */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Inner Triangular Structure - Abstraction Process */}
              <polygon
                points="160,50 250,200 70,200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.6"
              />

              {/* Central Hexagon - Refined Concepts */}
              <polygon
                points="160,120 190,140 190,180 160,200 130,180 130,140"
                fill="currentColor"
                opacity="0.1"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              {/* Connecting Lines - Knowledge Flow */}
              <line
                x1="160"
                y1="50"
                x2="160"
                y2="120"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
              <line
                x1="70"
                y1="200"
                x2="130"
                y2="180"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
              <line
                x1="250"
                y1="200"
                x2="190"
                y2="180"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />

              {/* Orbital Elements - Reconstructed World View */}
              <circle
                cx="160"
                cy="80"
                r="3"
                fill="currentColor"
                opacity="0.7"
              />
              <circle
                cx="100"
                cy="180"
                r="3"
                fill="currentColor"
                opacity="0.7"
              />
              <circle
                cx="220"
                cy="180"
                r="3"
                fill="currentColor"
                opacity="0.7"
              />

              {/* Dynamic Curves - Transformation Process */}
              <path
                d="M80 160 Q160 100 240 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
              <path
                d="M80 160 Q160 220 240 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>

            {/* Floating Text Elements */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-light opacity-60">
              感知
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-light opacity-60">
              抽象重组
            </div>
          </div>
        </div>

        {/* Right Side - Navigation */}
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-12">
            {/* Main Title */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-serif text-gray-800 dark:text-gray-200 mb-4">
                格物致知
              </h1>
              <p className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wide">
                概念炼金术士
              </p>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-8">
              <Link href="/about" className="group block text-center">
                <div className="text-2xl font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  我
                </div>
                <div className="w-12 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-16 transition-all duration-300"></div>
              </Link>

              <Link href="/blog" className="group block text-center">
                <div className="text-2xl font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  文章
                </div>
                <div className="w-12 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-16 transition-all duration-300"></div>
              </Link>

              <Link href="/contact" className="group block text-center">
                <div className="text-2xl font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  联系
                </div>
                <div className="w-12 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-16 transition-all duration-300"></div>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
