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
      /* z-[9999] is deliberate and sits in a gap: above every page element —
         the tallest is the back-to-top button at 9998 — and below the header
         bar (10000) and its controls (10001), so the button that closes the
         menu stays on top of it. At the old z-20 the curtain was painting
         underneath section wrappers, the side tab and the back-to-top, which
         is why page content showed through the brown. */
      className="fixed inset-0 w-full h-full bg-[#9b7762] text-white z-[9999] overflow-y-auto"
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
      <div className="min-h-full w-full max-w-[1600px] mx-auto px-[clamp(24px,5.55px_+_4.919vw,100px)] pt-[clamp(88px,80.23px_+_2.071vw,120px)] pb-[clamp(20px,15.15px_+_1.294vw,40px)] flex items-center">

        <div className="pmu-inner w-full flex gap-[clamp(48px,40.23px_+_2.071vw,80px)] items-center">

          {/* Left Column: navigation */}
          <nav className='w-[35%] pum-left'>
            <ul className="list-none p-0 m-0 w-full pum-ul">
              {PRIMARY_LINKS.map((link, index) => (
                <li
                  key={link.key}
                  className="pum-li border-b border-white/50 hover:border-white"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0px)' : 'translateY(30px)',
                    // Staggered on the way in only. Fading them out took half
                    // a second against the curtain's two, so the links hung
                    // half-transparent over the page while it closed. On the
                    // way out they simply go, and the curtain does the work.
                    transition: isOpen
                      ? `opacity 0.5s ease ${0.3 + index * 0.07}s, transform 0.5s ease ${0.3 + index * 0.07}s`
                      : 'none',
                  }}
                >
                  <a
                    href={link.href}
                    {...activate(link.key)}
                    className={`pum-an flex items-center gap-[clamp(6px,5.03px_+_0.259vw,10px)] py-[max(6px,min(clamp(12px,11.03px_+_0.259vw,16px),1.3vh))] text-white no-underline font-serif text-[length:max(18px,min(clamp(30px,27.57px_+_0.647vw,40px),4vh))] leading-[1.2] transition-all duration-300 hover:translate-x-2 ${
                      activeKey === link.key ? 'opacity-100' : 'opacity-55'
                    }`}
                  >
                    <span
                      className={`h-[1px] bg-white transition-all duration-300 ${
                        activeKey === link.key ? 'w-[clamp(14px,12.06px_+_0.518vw,22px)]' : 'w-0'
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
            className="hidden lg:block w-[65%] pum-right"
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
