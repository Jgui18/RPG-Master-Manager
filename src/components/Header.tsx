import { Download, Upload, RotateCcw } from 'lucide-react';
import { useStore } from '../store/store';
import { exportData, importData } from '../services/storage';
import { useEffect } from 'react';

const moduleTitles: Record<string, string> = {
  initiative: 'Painel de Iniciativa',
  npcs: 'Gerenciador de NPCs',
  dice: 'Roller de Dados',
  encounters: 'Gerenciador de Encontros',
  notes: 'Caderno da Campanha',
  bestiary: 'Bestiário',
};

export default function Header() {
  const { currentModule, combat } = useStore();

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rpg-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          importData(text);
          // Reload data
          window.location.reload();
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Erro ao importar dados');
        }
      }
    };
    input.click();
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white">
          {moduleTitles[currentModule] || 'RPG Master Tools'}
        </h2>
        {currentModule === 'initiative' && combat.participants.length > 0 && (
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
            <span>
              Rodada: <strong className="text-emerald-400">{combat.round}</strong>
            </span>
            <span>
              Turno: <strong className="text-emerald-400">
                {combat.currentTurn + 1}/{combat.participants.length}
              </strong>
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-300"
          title="Exportar dados"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={handleImport}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-300"
          title="Importar dados"
        >
          <Upload className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

