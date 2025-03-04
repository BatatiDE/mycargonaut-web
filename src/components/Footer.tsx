import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-4 w-full text-center md:mb-0 md:w-auto md:text-left">
            <h3 className="text-xl font-bold">MyCargonaut</h3>
            <p className="text-sm text-gray-600">
              &copy; 2025 MyCargonaut. Alle Rechte vorbehalten.
            </p>
          </div>
          <div className="w-full text-center md:w-auto md:text-right">
            <Link
              href="/ueber-uns"
              className="mx-3 text-gray-600 hover:text-orange-500"
            >
              Über uns
            </Link>
            <Link
              href="/kontakt"
              className="mx-3 text-gray-600 hover:text-orange-500"
            >
              Kontakt
            </Link>
            <Link
              href="/datenschutz"
              className="mx-3 text-gray-600 hover:text-orange-500"
            >
              Datenschutz
            </Link>
            <Link
              href="/agb"
              className="mx-3 text-gray-600 hover:text-orange-500"
            >
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
