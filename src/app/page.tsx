import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Container */}
      <div className="block md:flex min-h-screen">
        {/* Left Side - Conceptual Sketch */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950">
          <div className="relative w-72 h-72 md:w-100 md:h-100">
            {/* Abstract Geometric Representation of Conceptual Alchemy */}
            <Image
              className="hidden dark:block"
              src="/paradigm1.svg"
              alt="Logo"
              fill
              priority
            />
            <Image
              className="dark:hidden"
              src="/paradigm.svg"
              alt="Logo"
              fill
              priority
            />
          </div>
        </div>

        {/* Right Side - Navigation */}
        <div className="flex-1 flex items-center justify-center mt-24 md:mt-0">
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
              <Link href="/blog" className="group block text-center font-serif">
                <div className="text-2xl font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  Write To Think
                </div>
                <div className="w-32 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-48 transition-all duration-300"></div>
              </Link>

              <Link href="/contact" className="group block text-center">
                <div className="text-2xl font-serif font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  Contact
                </div>
                <div className="w-12 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-32 transition-all duration-300"></div>
              </Link>

              {/* <Link href="/about" className="group block text-center">
                <div className="text-2xl font-serif font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                  ME
                </div>
                <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-auto mt-2 group-hover:w-16 transition-all duration-300"></div>
              </Link> */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
