import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-primary shadow-md'>
      <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <Link href='/'>
          <h1 className='text-3xl font-bold text-secondary'>SEA Salon</h1>
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <Link
                href='#services'
                className='text-secondary hover:text-white'
              >
                Services
              </Link>
            </li>
            <li>
              <Link href='#contact' className='text-secondary hover:text-white'>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
