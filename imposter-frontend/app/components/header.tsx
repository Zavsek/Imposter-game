'use client'
import React, { useState, useRef, useEffect } from 'react'
import Logo from './Header/HeaderLogo'
import UserBadge from './Header/UserBadge'
import UserDropdown from './Header/UserDropdown'

interface HeaderProps {
  username: string | null
  logout: () => void
}

const Header: React.FC<HeaderProps> = ({ username, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='fixed top-0 left-0 w-full h-20 bg-black border-b-4 border-[rgba(13,0,80,0.8)] z-50 px-4 md:px-8'>
      <div className='grid grid-cols-3 items-center h-full w-full max-w-[1400px] mx-auto'>
        
        <div className='hidden md:block' />

        <Logo />

        <div className='justify-self-end' ref={dropdownRef}>
          {username && (
            <div className='relative'>
              <UserBadge 
                username={username} 
                isOpen={isOpen} 
                onClick={() => setIsOpen(!isOpen)} 
              />
              {isOpen && (
                <UserDropdown 
                  username={username} 
                  onLogout={() => { logout(); setIsOpen(false); }} 
                />
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Header;