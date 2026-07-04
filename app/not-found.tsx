import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-neutral-500">Page not found</p>
        <Link href="/" className="mt-6 inline-block text-black underline hover:text-neutral-600">
          Go back home
        </Link>
      </div>
    </div>
  );
}
