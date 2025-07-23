import { useState, useEffect } from 'react';
import { Menu, X, LogIn, User, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  
  const useDarkText = location.pathname === '/portfolio' || 
                     location.pathname === '/services' || 
                     location.pathname === '/about' || 
                     location.pathname === '/contact' || 
                     location.pathname === '/faq' ||
                     location.pathname === '/quote';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || useDarkText ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/0d4297c4-fe56-4729-9f95-c25c34ca800b.png" 
            alt="Addis Render Logo" 
            className="h-10 md:h-12"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/services" label="Services" useDarkText={useDarkText || isScrolled} />
          <NavLink href="/about" label="About us" useDarkText={useDarkText || isScrolled} />
          <NavLink href="/portfolio" label="Our works" useDarkText={useDarkText || isScrolled} />
          <NavLink href="/contact" label="Contact" useDarkText={useDarkText || isScrolled} />
          <NavLink href="/faq" label="FAQs" useDarkText={useDarkText || isScrolled} />
          <NavLink href="/quote" label="Quote" useDarkText={useDarkText || isScrolled} />
          
          {isAdmin && (
            <NavLink 
              href="/admin" 
              label="Admin" 
              useDarkText={useDarkText || isScrolled}
            />
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer">
                      <ShieldCheck className="h-4 w-4 mr-2" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              asChild
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md ml-2"
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </Button>
          )}
        </nav>

        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-rend-dark" />
          ) : (
            <Menu className="h-6 w-6 text-rend-dark" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white py-4 px-6 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <MobileNavLink href="/services" label="Services" onClick={toggleMobileMenu} />
            <MobileNavLink href="/about" label="About us" onClick={toggleMobileMenu} />
            <MobileNavLink href="/portfolio" label="Our works" onClick={toggleMobileMenu} />
            <MobileNavLink href="/contact" label="Contact" onClick={toggleMobileMenu} />
            <MobileNavLink href="/faq" label="FAQs" onClick={toggleMobileMenu} />
            <MobileNavLink href="/quote" label="Quote" onClick={toggleMobileMenu} />
            
            {isAdmin && (
              <MobileNavLink 
                href="/admin" 
                label="Admin Panel" 
                onClick={toggleMobileMenu} 
              />
            )}
            
            {user ? (
              <>
                <MobileNavLink href="/profile" label="Profile" onClick={toggleMobileMenu} />
                <Button 
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    signOut();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button 
                asChild
                className="bg-blue-500 hover:bg-blue-600 text-white w-full flex items-center justify-center gap-2"
              >
                <Link to="/login" onClick={toggleMobileMenu}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Link>
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  useDarkText?: boolean;
}

const NavLink = ({ href, label, useDarkText = false }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className={`font-medium ${useDarkText ? 'text-rend-dark' : 'text-white'} hover:text-blue-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 hover:after:w-full after:transition-all`}
    >
      {label}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ href, label, onClick }: MobileNavLinkProps) => {
  return (
    <Link
      to={href}
      className="font-medium text-rend-dark p-2 block hover:bg-rend-gray rounded transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;
