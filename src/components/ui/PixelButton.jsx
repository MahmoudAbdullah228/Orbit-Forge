'use client';

import React, { useState } from 'react';
import { sounds } from '@/lib/sound';

/**
 * PixelButton - Standard arcade button component with sound feedback and active states.
 * Supports direct `href` navigation for 100% reliable page transitions in static exports.
 *
 * @param {Object} props
 * @param {string} [props.href] - Optional destination URL
 * @param {'primary'|'secondary'|'neutral'|'danger'|'ghost'} [props.variant='primary']
 * @param {boolean} [props.disabled=false]
 * @param {() => void} [props.onClick]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
export default function PixelButton({
  href,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  children,
  size = 'md',
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      sounds.hover();
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (variant === 'danger') {
      sounds.error();
    } else {
      sounds.click();
    }
    if (onClick) onClick(e);
    if (href && !e.defaultPrevented) {
      window.location.href = href;
    }
  };

  let sizeStyles = 'py-2.5 px-4 text-[12px] min-h-[42px]';
  if (size === 'sm') sizeStyles = 'py-1.5 px-3 text-[10px] min-h-[32px]';
  if (size === 'lg') sizeStyles = 'py-3.5 px-6 text-[14px] min-h-[50px]';

  let variantClass = '';
  switch (variant) {
    case 'primary':
      variantClass = 'pixel-btn-primary';
      break;
    case 'secondary':
      variantClass = 'pixel-btn-secondary';
      break;
    case 'neutral':
      variantClass = 'pixel-btn-neutral';
      break;
    case 'danger':
      variantClass = 'pixel-btn-danger';
      break;
    case 'ghost':
      variantClass =
        'bg-transparent text-hud-cream hover:text-hud-amber border-none p-2 font-display text-[14px] uppercase flex items-center gap-2';
      break;
    default:
      variantClass = 'pixel-btn-primary';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`font-display select-none cursor-pointer relative ${sizeStyles} ${variantClass} ${
        disabled ? 'pixel-btn-disabled' : ''
      } ${className}`}
      {...rest}
    >
      {isHovered && !disabled && (
        <span className="text-hud-amber font-display mr-1 animate-pulse">▶</span>
      )}
      {children}
    </button>
  );
}
