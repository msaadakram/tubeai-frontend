import type { MetadataRoute } from "next";

// Canonical robots route is /app/robots.ts. This duplicate exists because the
// locale-prefixed path (e.g. /de/robots.txt) is reachable, but the app router
// only ever serves the canonical /robots.txt from app/robots.ts. To avoid any
// chance of conflicting rules, this file re-exports the canonical version.
export { default } from "../robots";
