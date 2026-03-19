import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="text-2xl font-bold text-primary-800">ResumeBuilder</div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/templates" className="hover:text-primary-600">Resume Templates</Link>
          <Link href="/pricing" className="hover:text-primary-600">Pricing</Link>
          <Link href="/about" className="hover:text-primary-600">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
          <Link href="/dashboard" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-3xl">
          Build a job-winning resume for free
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Your first resume is 100% free forever. Unlimited downloads. No hidden fees.
        </p>
        <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
          Get started - it's free ✨
        </Link>
        
        {/* Hero Image placeholder */}
        <div className="mt-16 w-full max-w-4xl h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">Resume Preview</span>
        </div>
      </section>

      {/* Social Proof */}
      <section className="flex items-center justify-center gap-4 py-8">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
          ))}
        </div>
        <span className="text-gray-600">Trusted by 1 million+ users</span>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">1st resume, free forever</h3>
              <p className="text-gray-600">Create your first resume at no cost</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Privacy & GDPR compliant</h3>
              <p className="text-gray-600">Your data is secure with us</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-gray-600">Choose from 6+ designed templates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Professional Templates</h2>
        <div className="max-w-6xl mx-auto overflow-x-auto flex gap-6 pb-4">
          {['Atlantic Blue', 'Classic', 'Corporate', 'Creative', 'Minimal', 'Modern'].map((name) => (
            <div key={name} className="flex-shrink-0 w-64 bg-gray-100 rounded-lg p-4">
              <div className="h-40 bg-white rounded border mb-4 flex items-center justify-center">
                <span className="text-gray-400">Preview</span>
              </div>
              <p className="text-center font-medium">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">ResumeBuilder</span>
          </div>
          <div className="flex gap-8 text-gray-600">
            <a href="#" className="hover:text-primary-600">Privacy</a>
            <a href="#" className="hover:text-primary-600">Terms</a>
            <a href="#" className="hover:text-primary-600">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
