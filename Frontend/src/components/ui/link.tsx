import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'nav' | 'default';
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, variant = 'default', ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'transition-colors hover:text-foreground/80',
          variant === 'nav' && 'text-sm font-medium text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Link.displayName = 'Link';

export { Link };
