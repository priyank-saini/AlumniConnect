// color design tokens export
export const colorTokens = {
    grey: {
        0: "#FFFFFF",
        10: "#F6F6F6",
        50: "#F0F0F0",
        100: "#E0E0E0",
        200: "#C2C2C2",
        300: "#A3A3A3",
        400: "#858585",
        500: "#666666",
        600: "#4D4D4D",
        700: "#333333",
        800: "#1A1A1A",
        900: "#0A0A0A",
        1000: "#000000",
    },
    primary: {
        50: "#E6FBFF",
        100: "#CCF7FE",
        200: "#99EEFD",
        300: "#66E6FC",
        400: "#33DDFB",
        500: "#000AFF", // Primary color set to #000AFF
        600: "#00A0BC",
        700: "#006B7D",
        800: "#00353F",
        900: "#001519",
    },
};

// mui theme settings
export const themeSettings = (mode) => {
    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    // palette values for dark mode
                    primary: {
                        dark: colorTokens.primary[300], // Lighter version of #000AFF
                        main: colorTokens.primary[500], // Main color #000AFF
                        light: colorTokens.primary[700], // Darker version
                    },
                    neutral: {
                        dark: colorTokens.grey[100], // Contrast text
                        main: colorTokens.grey[300], // Neutral color for elements
                        mediumMain: colorTokens.grey[400],
                        medium: colorTokens.grey[500],
                        light: colorTokens.grey[700], // Softer neutral
                    },
                    background: {
                        default: colorTokens.grey[900], // Dark background
                        alt: colorTokens.grey[800], // Slightly lighter for contrast
                    },
                }
                : {
                    // palette values for light mode
                    primary: {
                        dark: colorTokens.primary[700], // Darker shade
                        main: colorTokens.primary[500], // Main color #000AFF
                        light: colorTokens.primary[50],  // Very light shade
                    },
                    neutral: {
                        dark: colorTokens.grey[700], // Text and elements
                        main: colorTokens.grey[500], // Main neutral color
                        mediumMain: colorTokens.grey[400],
                        medium: colorTokens.grey[300],
                        light: colorTokens.grey[50],  // Soft backgrounds
                    },
                    background: {
                        default: colorTokens.grey[10], // Light background
                        alt: colorTokens.grey[0],   // Pure white
                    },
                }),
        },
        typography: {
            fontFamily: ["Lato", "sans-serif"].join(","), // Improved font handling
            fontSize: 14, // Slightly larger base font for readability
            h1: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 36, // Adjusted to create better hierarchy
                fontWeight: 700,
            },
            h2: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 30,
                fontWeight: 600,
            },
            h3: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 24,
                fontWeight: 600,
            },
            h4: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 20,
                fontWeight: 600,
            },
            h5: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 16,
                fontWeight: 500,
            },
            h6: {
                fontFamily: ["Lato", "sans-serif"].join(","),
                fontSize: 14,
                fontWeight: 500,
            },
        },
    };
};
