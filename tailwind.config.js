/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Material 3 Custom Blue Theme mapped to Tailwind
        primary: "#2196F3",
        onPrimary: "#FFFFFF",
        primaryContainer: "#E3F2FD",
        onPrimaryContainer: "#0D47A1",
        
        secondary: "#90CAF9",
        onSecondary: "#0D47A1",
        secondaryContainer: "#E3F2FD",
        onSecondaryContainer: "#0D47A1",
        
        tertiary: "#1976D2",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#90CAF9",
        onTertiaryContainer: "#0D47A1",
        
        surface: "#FFFFFF",
        onSurface: "#0D47A1",
        surfaceVariant: "#E3F2FD",
        onSurfaceVariant: "#2196F3",
        
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: "#F8FBFF",
        surfaceContainer: "#F0F8FF",
        surfaceContainerHigh: "#E3F2FD",
        surfaceContainerHighest: "#90CAF9",
        
        outline: "#90CAF9",
        outlineVariant: "#E3F2FD",
        
        inverseSurface: "#0D47A1",
        inverseOnSurface: "#E3F2FD",
        inversePrimary: "#90CAF9",
        
        error: "#B3261E",
        onError: "#FFFFFF",
        errorContainer: "#F9DEDC",
        onErrorContainer: "#410E0B",
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // The user requested Roboto
      },
      borderRadius: {
        '28dp': '28px',
        '20dp': '20px',
        '16dp': '16px',
        '10dp': '10px',
        '8dp': '8px',
        '5dp': '5px',
      }
    },
  },
  plugins: [],
}
