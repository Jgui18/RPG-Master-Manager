import { ReactNode, useEffect } from 'react';
import { useStore } from '../store/store';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { loadNPCs, loadCombat, loadEncounters, loadNotes } = useStore();

  useEffect(() => {
    loadNPCs();
    loadCombat();
    loadEncounters();
    loadNotes();
  }, [loadNPCs, loadCombat, loadEncounters, loadNotes]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

