/** @type {import('tailwindcss').Config} */

// Opaque semantic colours are stored as RGB channels so opacity modifiers
// (e.g. `bg-danger/10`, `border-accent/30`) resolve correctly.
const channel = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          DEFAULT: 'var(--surface)',
          sunken: 'var(--surface-sunken)',
          strong: 'var(--surface-strong)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        accent: {
          DEFAULT: channel('--accent-rgb'),
          hover: 'var(--accent-hover)',
          fg: 'var(--accent-fg)',
          subtle: 'var(--accent-subtle)',
        },
        success: { DEFAULT: channel('--success-rgb'), subtle: 'var(--success-subtle)' },
        warning: { DEFAULT: channel('--warning-rgb'), subtle: 'var(--warning-subtle)' },
        danger: { DEFAULT: channel('--danger-rgb'), subtle: 'var(--danger-subtle)' },
        info: { DEFAULT: channel('--info-rgb'), subtle: 'var(--info-subtle)' },
        'ai-chip': {
          DEFAULT: 'var(--ai-chip)',
          bg: 'var(--ai-chip-bg)',
        },
        // Legacy palette names, re-pointed at the glass system so any
        // remaining references stay on-theme.
        peach: {
          DEFAULT: 'var(--surface-sunken)',
          strong: 'var(--surface-strong)',
          soft: 'var(--surface-sunken)',
          hover: 'var(--surface-strong)',
        },
        ink: { DEFAULT: 'var(--text)', muted: 'var(--text-muted)' },
        'border-peach': 'var(--border)',
      },
      fontFamily: {
        sans: ['Urbanist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Urbanist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        control: '14px',
        card: '22px',
        dialog: '28px',
        full: '9999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        popover: 'var(--shadow-popover)',
        dialog: 'var(--shadow-dialog)',
        '2xs': '0 1px 2px rgba(0,0,0,0.12)',
        xs: '0 1px 3px rgba(0,0,0,0.16)',
      },
      backdropBlur: {
        xs: '4px',
        glass: '24px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        sheet: '320ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        rise: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.985)', filter: 'blur(6px)' },
          to: { opacity: '1', transform: 'none', filter: 'blur(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
        rise: 'rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      fontSize: {
        '2xs': ['11px', '14px'],
        xs: ['12px', '16px'],
        sm: ['13.5px', '19px'],
        base: ['14px', '20px'],
        lg: ['15px', '21px'],
        xl: ['17px', '23px'],
        '2xl': ['22px', '28px'],
        '3xl': ['34px', '40px'],
      },
    },
  },
  plugins: [],
}
