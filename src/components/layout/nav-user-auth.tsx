"use client"

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User, Settings, LogOut, CreditCard, Loader2 } from 'lucide-react';

export function NavUserAuth() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);

    // INSTANT LOGOUT: Redirect immediately, logout in background
    // This provides the fastest possible user experience

    // Start background logout immediately
    const logoutPromise = signOut({ redirect: false });

    // Navigate to login page instantly (under 50ms)
    router.push('/login');

    // Perform the actual server logout in background without blocking UI
    logoutPromise.catch(error => {
      console.error('Background logout error:', error);
    });

    // Minimal loading state since we redirect instantly
    setTimeout(() => setIsLoggingOut(false), 100);
  };

  // Add keyboard shortcut for logout (Ctrl/Cmd + Shift + L)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        if (session && !isLoggingOut) {
          handleLogout();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [session, isLoggingOut]);

  if (!session) {
    return (
      <div className="p-3 space-y-2">
        <Button asChild className="w-full" variant="outline">
          <a href="/login">Sign In</a>
        </Button>
        <Button asChild className="w-full">
          <a href="/register">Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src="/avatars/user.jpg" alt={session.user?.name || 'User'} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {session.user?.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="top">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={isLoggingOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>⚡ Instant logout • Ctrl/Cmd + Shift + L</p>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}