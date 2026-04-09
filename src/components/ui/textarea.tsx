import * as React from 'react';
import { LucideIcon } from "lucide-react"
import {cn} from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: LucideIcon;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, icon: Icon, ...props}, ref) => {
    return (
      <div className="relative w-full group">
        {Icon && (
          <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#3338A0] transition-colors duration-200">
            <Icon size={18} />
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#3338A0] focus-visible:ring-2 focus-visible:ring-[#3338A0]/20 hover:border-gray-300 dark:hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-50",
            Icon ? "pl-11 pr-4" : "px-4",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
