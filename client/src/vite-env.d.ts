/// <reference types="vite/client" />

/**
 * Environment variables this app actually reads.
 *
 * Declaring them explicitly rather than relying on vite/client's loose
 * `[key: string]: any` index signature means a typo'd variable name fails the
 * typecheck instead of silently resolving to `undefined` at runtime — which is
 * exactly how the sign-up form ended up rendering nothing.
 */
interface ImportMetaEnv {
  /** Clerk publishable key. Public by design: it is inlined into the bundle
   *  and identifies the Clerk instance. Never put `CLERK_SECRET_KEY` behind a
   *  `VITE_` prefix — that would ship your secret to every visitor. */
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
}
