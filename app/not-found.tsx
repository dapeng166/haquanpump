import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Container } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-bold text-gradient-accent sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-navy-100/60">
        The page you are looking for has moved or no longer exists. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" aria-hidden /> Back to Home
        </Link>
        <Link href="/products" className="btn-outline">
          <Search className="h-4 w-4" aria-hidden /> Browse Products
        </Link>
      </div>
    </Container>
  );
}
