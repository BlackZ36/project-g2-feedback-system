import { Link } from "react-router-dom";

export default function ErrorPage() {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-950 dark:bg-gray-950 text-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <img src="https://cdn.svgator.com/images/2022/01/404-svg-animation.svg" width={320} height={240} alt="404 Illustration" className="mx-auto aspect-video rounded-lg object-cover" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Oops! Page not found.</h1>
          <p className="text-gray-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-50 px-6 text-sm font-medium text-gray-950 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
          prefetch={false}
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
