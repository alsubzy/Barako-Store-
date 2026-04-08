"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  clickable?: boolean;
}

export function Logo({ className, size = 'md', showText = true, clickable = true }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const Content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex items-center justify-center p-1",
        sizes[size]
      )}>
        {/* We use a placeholder path that the user can replace with their actual local image */}
        <Image 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-GjZ2vPj.png" 
          alt="Barako Store Logo" 
          fill 
          className="object-contain p-1"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase",
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-lg' : 'text-2xl'
          )}>
            Barako <span className="text-[#FCC61D]">Store</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Burao, Somaliland
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href="/dashboard" className="transition-transform active:scale-95 hover:opacity-90">
        {Content}
      </Link>
    );
  }

  return Content;
}
