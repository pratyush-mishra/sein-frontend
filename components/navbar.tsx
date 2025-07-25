"use client";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { InstagramIcon } from "@/components/icons";
import { useRouter } from "next/navigation"; // Import useRouter

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    setMounted(true);

    const checkLoginStatus = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
          setIsLoggedIn(false);
          return;
        }
        const res = await fetch("http://localhost:8000/auth/users/me/", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setIsLoggedIn(res.ok);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false);
      }
    };

    // Initial check
    checkLoginStatus();

    // Listen for custom authChange event
    window.addEventListener('authChange', checkLoginStatus);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('authChange', checkLoginStatus);
    };
  }, [router]); // Remove .pathname, just depend on router instance

  // Function to handle sign out
  const handleSignOut = () => {
    // Remove tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    window.dispatchEvent(new Event('authChange'));
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home page after sign out
  };

  if (!mounted) return null;

  return (
    <nav className="w-full bg-[#F44325] text-white py-0 px-0 shadow-md h-56 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-56 px-8">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <NextLink href="/" className="flex items-center gap-3">
            <img src="/SEIN.png" alt="SEIN Logo" className="h-36 w-36 rounded-full bg-white p-2" />
          </NextLink>
        </div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-1 items-center justify-center gap-8 text-2xl font-medium">
          {isLoggedIn ? (
            <>
              <li><NextLink href="/listing/new" className="hover:underline underline-offset-4">+ New Resource</NextLink></li>
              <li><NextLink href="/inventory" className="hover:underline underline-offset-4">Inventory</NextLink></li>
              <li><NextLink href="/messages" className="hover:underline underline-offset-4">Messages</NextLink></li>
              <li><NextLink href="/profile" className="hover:underline underline-offset-4">Profile</NextLink></li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="text-2xl font-medium hover:underline underline-offset-4"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NextLink href="/" className="hover:underline underline-offset-4">Home</NextLink></li>
              <li><NextLink href="/inventory" className="hover:underline underline-offset-4">Inventory</NextLink></li>
              <li><NextLink href="/signin" className="hover:underline underline-offset-4">Sign In</NextLink></li>
              <li><NextLink href="/contact" className="hover:underline underline-offset-4">Contact</NextLink></li>
            </>
          )}
        </ul>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden flex items-center justify-center focus:outline-none"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-gray-700 flex flex-col items-center justify-start pt-8 transition-all">
          {/* Top: Logo and Close */}
          <div className="flex w-full items-center justify-between px-8 mb-8">
            <NextLink href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <img src="/SEIN.png" alt="SEIN Logo" className="h-16 w-16 rounded-full bg-white p-2" />
            </NextLink>
            <button
              className="text-3xl focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          {/* Centered Menu */}
          <ul className="flex flex-col items-center gap-6 text-2xl font-medium flex-1">
            {isLoggedIn ? (
              <>
                <li><NextLink href="/create-resource" onClick={() => setMenuOpen(false)}>+ New Resource</NextLink></li>
                <li><NextLink href="/inventory" onClick={() => setMenuOpen(false)}>Inventory</NextLink></li>
                <li><NextLink href="/messages" onClick={() => setMenuOpen(false)}>Messages</NextLink></li>
                <li><NextLink href="/profile" onClick={() => setMenuOpen(false)}>Profile</NextLink></li>
                <li><button onClick={handleSignOut} className="text-2xl font-medium">Sign Out</button></li>
              </>
            ) : (
              <>
                <li><NextLink href="/" onClick={() => setMenuOpen(false)}>Home</NextLink></li>
                <li><NextLink href="/inventory" onClick={() => setMenuOpen(false)}>Inventory <span className="ml-2">&gt;</span></NextLink></li>
                <li><NextLink href="/signin" onClick={() => setMenuOpen(false)}>Sign In <span className="ml-2">&gt;</span></NextLink></li>
                <li><NextLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</NextLink></li>
              </>
            )}
          </ul>
          {/* Instagram Icon at Bottom */}
          <div className="mb-8 mt-auto flex justify-center w-full">
            <a href="https://www.instagram.com/seinglasgow/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="text-3xl" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};