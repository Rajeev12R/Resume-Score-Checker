import Link from 'next/link';
import { Compass, Home, Zap} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-white to-primary/10 px-4 py-12 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-lg opacity-50"></div> 
      </div>
      
      <div className="mb-6">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-purple-600 text-white text-9xl font-bold px-8 py-4 rounded-2xl shadow-lg mb-6">
          4
          <Zap className="w-16 h-16 mx-2 text-yellow-300 animate-pulse" />
          4
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The resume you're looking for has either been moved or doesn't exist. 
          Let's get you back on track to career success.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
        <Link 
          href="/" 
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </Link>
        
        <Link 
          href="/resume-analysis" 
          className="bg-gradient-to-r from-foreground/5 via-background to-foreground/5 border border-border hover:border-primary/30 text-foreground font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <Compass className="w-5 h-5 text-primary" />
          Resume Analyzer
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-border/20 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          Need help? Contact our support team at 
          <a href="mailto:support@resume-analyzer.com" className="text-primary hover:underline ml-1">
            support@resume-analyzer.com
          </a>
        </p>
      </div>
    </div>
  );
}