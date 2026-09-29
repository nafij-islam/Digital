import {
  Inter,
  Manrope,
  Plus_Jakarta_Sans,
  Poppins,
  DM_Sans,
  Outfit,
  Sora,
  Space_Grotesk,
  Montserrat,
  Urbanist,
  Rubik,
  Nunito_Sans,
  Roboto,
  Lato,
  Open_Sans,
  Work_Sans,
  Source_Sans_3,
  Figtree,
  Lexend,
  Geist,
  Bebas_Neue,
  Oswald,
  Archivo,
  Barlow_Condensed,
  Playfair_Display,
  Merriweather,
  Rock_Salt,
} from "next/font/google";

export const fontInter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const fontManrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const fontPlusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans", display: "swap" });
export const fontPoppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
export const fontDmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
export const fontOutfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
export const fontSora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
export const fontSpaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
export const fontMontserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
export const fontUrbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist", display: "swap" });
export const fontRubik = Rubik({ subsets: ["latin"], variable: "--font-rubik", display: "swap" });
export const fontNunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito-sans", display: "swap" });
export const fontRoboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto", display: "swap" });
export const fontLato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
export const fontOpenSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });
export const fontWorkSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });
export const fontSourceSans3 = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans-3", display: "swap" });
export const fontFigtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
export const fontLexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });
export const fontGeist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const fontBebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"], variable: "--font-bebas-neue", display: "swap" });
export const fontOswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
export const fontArchivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
export const fontBarlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow-condensed", display: "swap" });
export const fontPlayfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display", display: "swap" });
export const fontMerriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather", display: "swap" });
export const fontRockSalt = Rock_Salt({ subsets: ["latin"], weight: ["400"], variable: "--font-rock-salt", display: "swap" });

export const allFontVariablesClass = [
  fontInter.variable,
  fontManrope.variable,
  fontPlusJakarta.variable,
  fontPoppins.variable,
  fontDmSans.variable,
  fontOutfit.variable,
  fontSora.variable,
  fontSpaceGrotesk.variable,
  fontMontserrat.variable,
  fontUrbanist.variable,
  fontRubik.variable,
  fontNunitoSans.variable,
  fontRoboto.variable,
  fontLato.variable,
  fontOpenSans.variable,
  fontWorkSans.variable,
  fontSourceSans3.variable,
  fontFigtree.variable,
  fontLexend.variable,
  fontGeist.variable,
  fontBebasNeue.variable,
  fontOswald.variable,
  fontArchivo.variable,
  fontBarlowCondensed.variable,
  fontPlayfairDisplay.variable,
  fontMerriweather.variable,
  fontRockSalt.variable,
].join(" ");

export function getFontFamilyForId(fontId: string): string {
  switch (fontId) {
    case "manrope":
      return "var(--font-manrope), sans-serif";
    case "plus-jakarta-sans":
      return "var(--font-plus-jakarta-sans), sans-serif";
    case "inter":
      return "var(--font-inter), sans-serif";
    case "poppins":
      return "var(--font-poppins), sans-serif";
    case "dm-sans":
      return "var(--font-dm-sans), sans-serif";
    case "outfit":
      return "var(--font-outfit), sans-serif";
    case "sora":
      return "var(--font-sora), sans-serif";
    case "space-grotesk":
      return "var(--font-space-grotesk), sans-serif";
    case "montserrat":
      return "var(--font-montserrat), sans-serif";
    case "urbanist":
      return "var(--font-urbanist), sans-serif";
    case "rubik":
      return "var(--font-rubik), sans-serif";
    case "nunito-sans":
      return "var(--font-nunito-sans), sans-serif";
    case "roboto":
      return "var(--font-roboto), sans-serif";
    case "lato":
      return "var(--font-lato), sans-serif";
    case "open-sans":
      return "var(--font-open-sans), sans-serif";
    case "work-sans":
      return "var(--font-work-sans), sans-serif";
    case "source-sans-3":
      return "var(--font-source-sans-3), sans-serif";
    case "figtree":
      return "var(--font-figtree), sans-serif";
    case "lexend":
      return "var(--font-lexend), sans-serif";
    case "geist":
      return "var(--font-geist), sans-serif";
    case "bebas-neue":
      return "var(--font-bebas-neue), sans-serif";
    case "oswald":
      return "var(--font-oswald), sans-serif";
    case "archivo":
      return "var(--font-archivo), sans-serif";
    case "barlow-condensed":
      return "var(--font-barlow-condensed), sans-serif";
    case "playfair-display":
      return "var(--font-playfair-display), serif";
    case "merriweather":
      return "var(--font-merriweather), serif";
    case "rock-salt":
      return "var(--font-rock-salt), cursive";
    default:
      return "var(--font-inter), sans-serif";
  }
}
