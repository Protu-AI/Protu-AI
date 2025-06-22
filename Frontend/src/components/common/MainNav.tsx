import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();
  
  const routes = [
    { href: '/', label: 'Home' },
    { href: '/chatbot', label: 'Chatbot' },
    { href: '/learn', label: 'Learn' }, // Updated label and href
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/resources', label: 'Resources' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <nav className={cn('flex h-full items-center justify-center space-x-[4.375rem]', className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            'nav-link text-[#0E1117] hover:text-[#5F24E0] dark:text-[#EFE9FC] dark:hover:text-[#BFA7F3] transition-colors duration-1000',
            location.pathname === route.href && 'text-[#5F24E0] dark:text-[#BFA7F3]'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
