import React from 'react';
import { SchoolIcon } from './icons/SchoolIcon';
import { Page } from '../App';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const currentYear = new Date().getFullYear();

  const handleAdminAccessClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrentPage(Page.AdminLogin);
  };

  return (
    <footer className="bg-primary text-slate-300 mt-20 border-t-4 border-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
             <div className="flex items-center space-x-3 mb-4">
              <SchoolIcon className="h-10 w-10 text-accent" />
              <div>
                <h1 className="text-xl font-bold text-white">Portal Organisasi</h1>
                <p className="text-sm text-slate-400">SMK LPPMRI 2 KEDUNGREJA</p>
              </div>
            </div>
            <p className="max-w-md text-slate-400">
              Platform digital terintegrasi untuk mendukung kegiatan, demokrasi, dan transparansi seluruh organisasi di lingkungan sekolah.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wider uppercase">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); }} className="hover:text-accent transition-colors">Beranda</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Voting); }} className="hover:text-accent transition-colors">E-Voting</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wider uppercase">Kontak</h3>
            <ul className="mt-4 space-y-2 text-slate-400">
              <li>Jl. Tambaksari No. 2, Kedungreja</li>
              <li>Cilacap, Jawa Tengah</li>
              <li className="pt-2"><a href="mailto:info@smk.sch.id" className="hover:text-accent transition-colors">info@smk.sch.id</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-primary-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-slate-500">
            <p onClick={handleAdminAccessClick} className="cursor-pointer">&copy; {currentYear} SMK LPPMRI 2 KEDUNGREJA. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;