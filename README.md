<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZrvTV4r84UG6AHWYHSFetRIbTJVr1Nns

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   ## Migration & Troubleshooting Notes

   This project was migrated from a Vite setup to Next.js (Pages Router). Key decisions and fixes applied:

   - Tailwind/PostCSS: `index.css` used Tailwind directives and `@apply`. I installed and configured `tailwindcss`, `postcss`, and `autoprefixer`, moved global styles to `styles/globals.css`, and imported Google Fonts there.
   - macOS artifacts: deleted `._*` and `.__*` files that caused UTF-8 build errors and added `.gitignore` rules to ignore these and `.next/`.
   - Next config: removed unsupported `experimental.appDir` and deleted duplicate `next.config.js`. Kept `next.config.cjs` as the canonical config.
   - Fast Refresh/HMR: cleared the `.next` cache and restarted the dev server to eliminate stale `hot-update.json` 404s.

   Recommended defaults chosen:

   - Keep the Pages Router (`pages/`) for now. Migrating to the App Router (`app/`) is a larger effort and should be planned separately.
   - Use `styles/globals.css` as the single global stylesheet entry for Next and Tailwind.

   If you run into HMR hot-update 404s or full Fast Refresh reloads:

   1. Stop the dev server.
   2. Remove `.next/` and restart the dev server: `rm -rf .next && npm run dev`.
   3. Ensure there are no leftover macOS `._*` files in the repo.

   If you want help migrating to the App Router or auditing pages that use temporary `getServerSideProps`, I can prepare a migration plan and do the work incrementally.
