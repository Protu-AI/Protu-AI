// Theme configuration
export const theme = {
  transition: {
    duration: '200ms',
    timing: 'ease-in-out'
  },
  light: {
    colors: {
      background: '#FFFFFF',
      backgroundGradient: ['#FFFFFF', '#EFE9FC'],
      primary: '#5F24E0',
      secondary: '#EFE9FC',
      text: {
        primary: '#0E1117',
        secondary: '#808080',
        muted: '#ABABAB'
      },
      icon: {
        primary: '#A6B5BB',
        hover: '#5F24E0'
      },
      border: '#A6B5BB',
      sidebar: {
        background: '#F7F7F7',
        hover: '#EBEBEB'
      },
      chat: {
        userBg: '#EFE9FC',
        userText: '#1C0B43',
        botText: '#1C0B43'
      }
    }
  },
  dark: {
    colors: {
      background: '#1C0B43',
      backgroundGradient: ['#1C0B43', '#1C0B43'],
      primary: '#BFA7F3',
      secondary: '#FFBF00',
      text: {
        primary: '#EFE9FC',
        secondary: '#EFE9FC',
        muted: '#EFE9FC'
      },
      icon: {
        primary: '#FFBF00',
        hover: '#E6AC00'
      },
      border: '#BFA7F3',
      sidebar: {
        background: 'rgba(191, 167, 243, 0.8)',
        hover: '#EBEBEB'
      },
      chat: {
        userBg: 'rgba(191, 167, 243, 0.8)',
        userText: '#EFE9FC',
        botText: '#EFE9FC'
      }
    }
  }
} as const;
