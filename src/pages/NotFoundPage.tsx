import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-32 text-center animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/20">
          <Camera className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-6xl font-cinzel font-bold text-gold-400">404</h1>
          <h2 className="text-2xl font-cinzel font-bold text-studio-light mt-2">
            Page Not Found
          </h2>
          <p className="text-sm text-studio-muted mt-3">
            The page you are looking for might have been moved or does not exist. Explore our studio photography portfolio or return to the homepage.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/">
            <Button variant="gold" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button variant="dark">
              View Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
