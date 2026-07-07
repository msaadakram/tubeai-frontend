import { defaultLocale } from "@/lib/i18n/config";
import { getLocalePath } from "@/lib/i18n/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-neutral-500">Page not found</p>
        <a href={getLocalePath(defaultLocale, "/")} className="mt-6 inline-block text-black underline hover:text-neutral-600">
          Go back home
        </a>
      </div>
    </div>
  );
}
