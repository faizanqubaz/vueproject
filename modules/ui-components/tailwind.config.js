module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3856F6',
        red: '#FF0000',
        fontPrimary: '#1A202C',
        fontSecondary: '#2D3748',
        stroke: '#CBD5E0',
        lightGray: '#EDF2F7',
        darkGray: '#A0AEC0',
        pink: {
          50: '#F7E5EE'
        },
        green: {
          50: '#E6F8EF'
        },
        yellow: {
          50: '#FAF2C7'
        },
        gray: {
          50: '#E8EFF9'
        }
      },
      fontSize: {
        xl: '32px',
        lg: '24px',
        md: '16px',
        sm: '14px'
      },
      borderRadius: {
        DEFAULT: '8px'
      },
      padding: {
        sm: '14px',
        md: '16px',
        lg: '18px'
      },
      margin: {
        sm: '12px'
      },
      spacing: {
        48.5: '12.5rem',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '8/8': '100%'
      }
    }
  },
  variants: {
    extend: {
      borderStyle: ['last'],
      backgroundColor: ['checked', 'active'],
      borderColor: ['checked'],
      brightness: ['hover', 'active']
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
