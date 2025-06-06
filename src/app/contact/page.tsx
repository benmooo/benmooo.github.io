import Link from "next/link";

export default function Contact() {
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
            Contact
          </h1>
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-600"></div>
        </header>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-6">
                Connect
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:benmo0802@gmail.com"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline"
                  >
                    白堕
                  </a>
                </div>

                <div className="group">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Social
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/benmooo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      benmooo
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Philosophy & Approach */}
          <div className="space-y-8">
            <section>
              {/* <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                Communication Philosophy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p className="leading-relaxed">
                  我相信最好的对话发生在不同观点的碰撞中。我喜欢那些能够挑战现有思维模式、
                  探索新可能性的交流。
                </p>
                <p className="leading-relaxed">
                  Whether you want to discuss an idea, share a different
                  perspective, or explore potential collaborations, I&apos;m
                  always open to thoughtful conversations.
                </p>
              </div> */}
            </section>

            {/* <section className="pt-8">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-3">
                  Current Focus
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Exploring the mathematical beauty in everyday patterns,
                  developing frameworks for cross-cultural knowledge synthesis,
                  and writing about the intersection of Eastern and Western
                  thought.
                </p>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  );
}
