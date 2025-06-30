import { MainNav } from './MainNav';
import { UserNav } from './UserNav';
import { AuthButtons } from '../auth/AuthButtons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_3px_8px_rgba(0,0,0,0.05)]">
      <div className="flex h-[4.5rem] items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/Brand/Logo - Light Mode.svg" 
            alt="PROTU Logo" 
            className="w-[160px] h-[60px] object-fill"
          />
        </Link>
        <MainNav className="flex-1 px-16" />
        <div className="flex items-center space-x-4">
          {user ? (
            <UserNav 
              user={{
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                avatar: user.avatar
              }} 
            />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}
