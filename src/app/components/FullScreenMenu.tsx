"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MenuPreview from './menu/menu-preview';
import { PRIMARY_LINKS, resolveActiveKey } from './menu/menu-data';

interface FullScreenMenuProps {
  isOpen: boolean;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen }) => {
  // The nav item matching the page we're currently on.
  const routeKey = resolveActiveKey(usePathname());

  // Which nav item the preview panel is showing. Once hovered it stays put —
  // it does not revert when the pointer leaves.
  const [activeKey, setActiveKey] = useState(routeKey);

  // Reset to the current page's panel when the menu closes, so it always
  // reopens on the active page. Adjusted during render rather than in an
  // effect, per React's "adjusting state when props change" pattern.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setActiveKey(routeKey);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  /** Hover and keyboard focus both drive the preview. */
  const activate = (key: string) => ({
    onMouseEnter: () => setActiveKey(key),
    onFocus: () => setActiveKey(key),
  });

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-[#9b7762] text-white z-20 overflow-y-auto"
      style={{
        clipPath: isOpen
          ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'  // fully visible
          : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',      // collapsed to left edge
        transition: 'clip-path 2s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isOpen ? 'all' : 'none',
      }}
    >
      {/* Sized to sit inside one viewport: the header clears the top, and the
          two columns are vertically centred in what's left. */}
      <div className="min-h-full w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-[100px] pt-[120px] pb-10 flex items-center">

        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 lg:gap-14 xl:gap-20 items-center">

          {/* Left Column: navigation */}
          <nav>
            <ul className="list-none p-0 m-0 w-full">
              {PRIMARY_LINKS.map((link, index) => (
                <li
                  key={link.key}
                  className="border-b border-white/70"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0px)' : 'translateY(30px)',
                    transition: `opacity 0.5s ease ${0.3 + index * 0.07}s, transform 0.5s ease ${0.3 + index * 0.07}s`,
                  }}
                >
                  <a
                    href={link.href}
                    {...activate(link.key)}
                    className={`flex items-center gap-3 py-3 xl:py-4 text-white no-underline font-serif text-[30px] sm:text-[34px] xl:text-[40px] leading-[1.2] transition-all duration-300 hover:translate-x-2 ${
                      activeKey === link.key ? 'opacity-100' : 'opacity-55'
                    }`}
                  >
                    <span
                      className={`h-[1px] bg-white transition-all duration-300 ${
                        activeKey === link.key ? 'w-[22px]' : 'w-0'
                      }`}
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Column: hover preview. Hidden below lg — it is hover-driven,
              and every destination is already reachable from the list. */}
          <div
            className="hidden lg:block"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0px)' : 'translateY(30px)',
              transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
            }}
          >
            <MenuPreview activeKey={activeKey} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FullScreenMenu;
