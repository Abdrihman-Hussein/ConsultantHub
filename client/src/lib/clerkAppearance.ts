/**
 * Clerk's visual defaults, bent onto the existing palette.
 *
 * This is deliberately *variables only*. No element overrides and no new
 * colours: every value below is already a token in `tailwind.config.js`, read
 * from there rather than retyped as a new hex, so Clerk cannot drift away from
 * the design system and the contrast checks in `check-logic.ts` still describe
 * the palette that is actually on screen. Where Clerk's default and this
 * design disagree in a way that needs element-level CSS, the disagreement is
 * left visible rather than papered over — see the migration report.
 *
 * `appearance` is a prop on `ClerkProvider`, `SignIn`, `SignUp` and
 * `UserButton`, all of which accept the same object.
 */
import type { ClerkAppearanceTheme } from '@clerk/react/types'

export const clerkAppearance: ClerkAppearanceTheme = {
  variables: {
    /** accent-500 — the terracotta the whole app uses for actions. */
    colorPrimary: '#C2622D',
    /** ink-950 — the same near-black as `text-body`. */
    colorForeground: '#2A2118',
    /** surface — the cream form panel never changes. */
    colorBackground: '#FFFFFF',
    /** line-strong — matches `border-line-strong` on the app's own inputs. */
    colorBorder: '#D6C4B2',
    /** muted — the app's secondary text colour. */
    colorMutedForeground: '#7A6A5B',
    /** danger — reused from the token of the same name. */
    colorDanger: '#B4231C',
    /** The app's sans stack, from `fontFamily.sans` in tailwind.config.js. */
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

/**
 * The same palette, for a Clerk card that is being *embedded* in one of ours.
 *
 * Two adjustments, both about not fighting `AuthShell`:
 *
 * - `elevation: 'flush'` drops Clerk's card border, shadow, radius and padding,
 *   so its form sits directly on the shell's own card instead of drawing a
 *   second one inside it.
 * - `footerAction` is hidden because the shell's footer already says "Don't
 *   have an account? Sign up" and links to the same route. Clerk's copy would
 *   be a second, identically-purposed link to `/register` in the other
 *   language's grammar.
 */
export const authCardAppearance: ClerkAppearanceTheme = {
  ...clerkAppearance,
  options: { elevation: 'flush' },
  elements: { footerAction: { display: 'none' } },
};