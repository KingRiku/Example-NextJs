import FormsPlugin from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/helpers/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'circle': '50%',
      },
      minHeight: {
        'table': '45rem',
      }
    },
  },
  plugins: [
    FormsPlugin,
    plugin(({ addComponents, addUtilities, theme }) => {
      addComponents({
        '.button-sm': {
          paddingLeft: theme('spacing.2'),
          paddingRight: theme('spacing.2'),
          paddingTop: theme('spacing.1'),
          paddingBottom: theme('spacing.1'),
          borderRadius: theme('borderRadius.DEFAULT'),
          fontSize: theme('fontSize.sm'),
        },
        '.button': {
          paddingLeft: theme('spacing.2'),
          paddingRight: theme('spacing.2'),
          paddingTop: theme('spacing.1'),
          paddingBottom: theme('spacing.1'),
          borderRadius: theme('borderRadius.DEFAULT'),
          fontSize: theme('fontSize.sm'),
        },
        '.button-md': {
          paddingLeft: theme('spacing.3'),
          paddingRight: theme('spacing.3'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
          borderRadius: theme('borderRadius.DEFAULT'),
          fontSize: theme('fontSize.DEFAULT'),
        },
        '.button-lg': {
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          borderRadius: theme('borderRadius.DEFAULT'),
          fontSize: theme('fontSize.lg'),
        },
        '.button-xl': {
          paddingLeft: theme('spacing.5'),
          paddingRight: theme('spacing.5'),
          paddingTop: theme('spacing.4'),
          paddingBottom: theme('spacing.4'),
          borderRadius: theme('borderRadius.DEFAULT'),
          fontSize: theme('fontSize.xl'),
        },
      }),
      addUtilities({
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      })
    }),
  ],
} satisfies Config
