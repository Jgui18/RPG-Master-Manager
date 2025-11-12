import { 
  Swords, 
  Users, 
  Dice6, 
  Shield, 
  BookOpen,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../store/store';
import { useState } from 'react';

const menuItems = [
  { id: 'initiative' as const, label: 'Iniciativa', icon: Swords },
  { id: 'npcs' as const, label: 'NPCs', icon: Users },
  { id: 'dice' as const, label: 'Dados', icon: Dice6 },
  { id: 'encounters' as const, label: 'Encontros', icon: Shield },
  { id: 'notes' as const, label: 'Caderno', icon: BookOpen },
  { id: 'bestiary' as const, label: 'Bestiário', icon: Search },
];

export default function Sidebar() {
  const { currentModule, setCurrentModule } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">RPG Master Tools</h1>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentModule(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  currentModule === item.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

