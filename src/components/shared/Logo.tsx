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
  const imgSizes = {
    sm:  { px: 32,  rounded: 'rounded-xl' },    // approx h-8
    md:  { px: 40,  rounded: 'rounded-xl' },    // approx h-10
    lg:  { px: 48,  rounded: 'rounded-2xl' },   // approx h-12
    xl:  { px: 96,  rounded: 'rounded-[32px]' }, // approx h-24
  };

  const textSizes = {
    sm:  'text-sm',
    md:  'text-lg',
    lg:  'text-xl',
    xl:  'text-4xl',
  };

  const { px, rounded } = imgSizes[size];

  const Content = (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo image — uses local public asset, no external hostname needed */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 bg-white",
          rounded
        )}
        style={{ width: px, height: px }}
      >
        <Image
          src="/images/logo.png"
          alt="Barako Store Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-black tracking-tight text-slate-900 dark:text-white uppercase",
              textSizes[size]
            )}
          >
            Barako <span className="text-[#FCC61D]">Store</span>
          </span>
          {size === 'xl' && (
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Burao · Somaliland
            </span>
          )}
          {(size === 'lg' || size === 'md') && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Burao · Somaliland
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href="/dashboard" className="outline-none hover:opacity-90 active:scale-95 transition-all">
        {Content}
      </Link>
    );
  }

  return Content;
}
