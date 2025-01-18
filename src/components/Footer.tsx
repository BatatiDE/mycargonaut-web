import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">MyCargonaut</h3>
                        <p className="text-sm text-gray-600">&copy; 2025 MyCargonaut. Alle Rechte vorbehalten.</p>
                    </div>
                    <div className="w-full md:w-auto text-center md:text-right">
                        <Link href="/ueber-uns" className="text-gray-600 hover:text-orange-500 mx-3">Über uns</Link>
                        <Link href="/kontakt" className="text-gray-600 hover:text-orange-500 mx-3">Kontakt</Link>
                        <Link href="/datenschutz" className="text-gray-600 hover:text-orange-500 mx-3">Datenschutz</Link>
                        <Link href="/agb" className="text-gray-600 hover:text-orange-500 mx-3">AGB</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

