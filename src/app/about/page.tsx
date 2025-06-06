import Link from "next/link";

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
              <h3 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-4">
                Interests
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Game</li>
                <li>• Rendering</li>
                <li>• Sketch</li>
                <li>• Programming</li>
              </ul>
            </section>
            {/* <section>
              <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                经历
              </h2>
            </section> */}
          </div>

          {/* Sidebar */}

        </div>
      </div>
    </div>
  );
}
