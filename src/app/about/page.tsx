import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-8"
          >
            ← 返回
          </Link>
          <h1 className="text-4xl font-serif text-gray-800 dark:text-gray-200 mb-4">
            About
          </h1>
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
        </header>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                概念炼金术士
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                我致力于将复杂的经验转化为清晰的抽象概念，然后用这些抽象重新构建对世界的理解。
                这个过程如同炼金术一般，将原始的经验材料提炼成纯粹的思想精华。
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                通过格物致知的方式，我探索知识的本质，寻找事物背后的规律与联系，
                并努力将这些洞察转化为可以指导实践的智慧。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                Philosophy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                I believe in the transformative power of abstraction. By distilling experiences 
                into their essential patterns and principles, we can build more robust and 
                elegant mental models of the world.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                This process of conceptual alchemy allows us to see beyond the surface of things, 
                to understand their deeper structures and relationships, and to apply these 
                insights across different domains of knowledge.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-4">
                Interests
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Systems Thinking</li>
                <li>• Knowledge Architecture</li>
                <li>• Cognitive Science</li>
                <li>• Design Philosophy</li>
                <li>• Mathematical Beauty</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-4">
                Currently
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Exploring the intersection of Eastern wisdom and Western analytical thinking, 
                seeking universal patterns that transcend cultural boundaries.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}