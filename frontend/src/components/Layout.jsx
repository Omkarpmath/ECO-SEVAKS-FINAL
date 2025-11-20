import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="bg-zinc-50 text-gray-800">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6 min-h-[calc(1wh-200px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}