import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (accountData) {
      const account = JSON.parse(accountData);
      if (account && account.email) {
        setAccount(account);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    localStorage.removeItem("account");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="/vite.svg" alt="Logo" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-foreground">
                  Home
                </Button>
              </Link>
              {account ? (
                <>
                  {account.role === "student" && (
                    <>
                      <Link to="/home">
                        <Button variant="ghost" className="text-foreground">
                          Menu
                        </Button>
                      </Link>
                      <Link to="/teachers">
                        <Button variant="ghost" className="text-foreground">
                          Teacher
                        </Button>
                      </Link>
                      <Link to="/feedback">
                        <Button variant="ghost" className="text-foreground">
                          Feedback
                        </Button>
                      </Link>
                      <Link to="/classes">
                        <Button variant="ghost" className="text-foreground">
                          Class
                        </Button>
                      </Link>
                    </>
                  )}

                  {account.role === "teacher" && (
                    <>
                      <Link to="/home">
                        <Button variant="ghost" className="text-foreground">
                          Menu
                        </Button>
                      </Link>
                      <Link to="/teacher-feedback">
                        <Button variant="ghost" className="text-foreground">
                          My Feedback
                        </Button>
                      </Link>
                    </>
                  )}

                  {account.role === "admin" && (
                    <>
                      <Link to="/home">
                        <Button variant="ghost" className="text-foreground">
                          Menu
                        </Button>
                      </Link>
                      <Link to="/admin-account">
                        <Button variant="ghost" className="text-foreground">
                          Account
                        </Button>
                      </Link>
                      <Link to="/admin-feedback">
                        <Button variant="ghost" className="text-foreground">
                          Feedback
                        </Button>
                      </Link>
                      <Link to="/admin-class">
                        <Button variant="ghost" className="text-foreground">
                          Class
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* User Authentication and Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>{account.name}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{account.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{account.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </div>
            )}
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* <ModeToggle /> */}
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ml-2"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Feedback
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Service
            </Button>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {isLoggedIn ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatar.jpg" alt="User avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">John Doe</div>
                    <div className="text-sm font-medium text-muted-foreground">john@example.com</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link to="/profile">
                    <Button className="w-full">Profile</Button>
                  </Link>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <Link to="/login">
                  <Button className="w-full">Log in</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
