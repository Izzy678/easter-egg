const colors = {
  base: {
    background: '#0B0D10',   // deep cinema black
    surface: '#141821',      // cards, panels
    surfaceAlt: '#1B2030',   // hover / elevated
    border: '#23283A',
  },
  text: {
    primary: '#E6E8EF',
    muted: '#9AA0B2',
  },
  accent: {
    light: '#FCA5A5',       // vibrant light red
    main: '#DC2626',        // vibrant red (Tailwind red-600)
    dark: '#B91C1C',        // rich dark red
  },
  primary: {
    lighter: '#FCA5A5',     // accent.light
    main: '#DC2626',        // accent.main
    darker: '#B91C1C',      // accent.dark
  },
  secondary: {
    lighter: '#9AA0B2',      // text.muted (lighter gray)
    main: '#6B7280',         // neutral gray
    darker: '#4B5563',       // darker gray
  },
};

module.exports = { colors };