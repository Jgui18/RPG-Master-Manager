import { useState, useMemo } from 'react';
import { useStore } from '../../store/store';
import { defaultMonsters } from '../../data/monsters';
import { Monster } from '../../types';
import { Search, Swords, Filter } from 'lucide-react';

export default function Bestiary() {
  const { addParticipant, setCurrentModule } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all');

  const types = useMemo(() => {
    const allTypes = new Set(defaultMonsters.map(m => m.type));
    return Array.from(allTypes).sort();
  }, []);

  const filteredMonsters = useMemo(() => {
    let filtered = defaultMonsters;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(monster =>
        monster.name.toLowerCase().includes(query) ||
        monster.type.toLowerCase().includes(query) ||
        monster.skills.some(skill => skill.toLowerCase().includes(query)) ||
        monster.abilities.some(ability => ability.toLowerCase().includes(query))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(monster => monster.type === selectedType);
    }

    if (selectedChallenge !== 'all') {
      const challenge = parseFloat(selectedChallenge);
      filtered = filtered.filter(monster => monster.challenge === challenge);
    }

    return filtered.sort((a, b) => a.challenge - b.challenge);
  }, [searchQuery, selectedType, selectedChallenge]);

  const handleAddToCombat = (monster: Monster) => {
    addParticipant({
      id: crypto.randomUUID(),
      name: monster.name,
      initiative: 0, // Roll initiative separately
      currentHp: monster.hp,
      maxHp: monster.hp,
      conditions: [],
      type: 'npc',
      ac: monster.ac,
    });
    setCurrentModule('initiative');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bestiário</h2>
        <div className="text-sm text-gray-400">
          {filteredMonsters.length} monstro(s)
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar monstros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input w-full"
            >
              <option value="all">Todos os tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nível de Desafio</label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="input w-full"
            >
              <option value="all">Todos os níveis</option>
              <option value="0.125">1/8</option>
              <option value="0.25">1/4</option>
              <option value="0.5">1/2</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMonsters.map((monster) => (
          <div key={monster.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{monster.name}</h3>
                <div className="text-sm text-gray-400">
                  {monster.type} | ND {monster.challenge} | HP {monster.hp} | CA {monster.ac}
                </div>
              </div>
              <button
                onClick={() => handleAddToCombat(monster)}
                className="p-2 hover:bg-emerald-600 rounded transition-colors"
                title="Adicionar ao combate"
              >
                <Swords className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-300 mb-2">
                <strong>Velocidade:</strong> {monster.speed}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                <div><strong>FOR:</strong> {monster.attributes.str}</div>
                <div><strong>DES:</strong> {monster.attributes.dex}</div>
                <div><strong>CON:</strong> {monster.attributes.con}</div>
                <div><strong>INT:</strong> {monster.attributes.int}</div>
                <div><strong>SAB:</strong> {monster.attributes.wis}</div>
                <div><strong>CAR:</strong> {monster.attributes.cha}</div>
              </div>
            </div>
            {monster.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Perícias:</h4>
                <div className="flex flex-wrap gap-1">
                  {monster.skills.map((skill, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {monster.abilities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Habilidades:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  {monster.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
            {monster.actions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Ações:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  {monster.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMonsters.length === 0 && (
        <div className="card text-center text-gray-400">
          Nenhum monstro encontrado. Tente ajustar os filtros.
        </div>
      )}
    </div>
  );
}

