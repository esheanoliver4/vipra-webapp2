"use client";
import React, { useState } from "react";
import Link from "next/link";
import { TbHomeHeart } from "react-icons/tb";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <TbHomeHeart className="h-10 w-10 text-primary" />
            <div>
              <span className="text-2xl font-bold text-foreground">
                VipraPariwar
              </span>
              <p className="text-xs text-muted-foreground font-medium">
                Brahmin Matrimonial
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-foreground hover:text-primary font-medium transition-colors">
              Features
            </a>
            <a href="#about" className="text-foreground hover:text-primary font-medium transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary font-medium transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <nav className="flex flex-col items-start space-y-2 px-2">
              <a href="#features" className="text-foreground hover:text-primary font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-foreground hover:text-primary font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary font-medium transition-colors">
                Contact
              </a>
              <Button asChild className="mt-2 w-full">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
