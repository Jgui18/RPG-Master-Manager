import { useState } from 'react';
import { useStore } from '../../store/store';
import { Encounter, NPC } from '../../types';
import { Plus, Trash2, Edit2, Play, Save, X } from 'lucide-react';

export default function EncounterBuilder() {
  const { encounters, npcs, addEncounter, updateEncounter, deleteEncounter, addParticipant, setCurrentModule } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEncounter, setNewEncounter] = useState<Partial<Encounter>>({
    name: '',
    description: '',
    npcs: [],
    xp: 0,
  });

  const handleAddEncounter = () => {
    if (!newEncounter.name) return;

    const xp = calculateXP(newEncounter.npcs || []);

    const encounter: Encounter = {
      id: crypto.randomUUID(),
      name: newEncounter.name,
      description: newEncounter.description || '',
      npcs: newEncounter.npcs || [],
      xp: xp,
      createdAt: new Date().toISOString(),
    };

    addEncounter(encounter);
    setNewEncounter({
      name: '',
      description: '',
      npcs: [],
      xp: 0,
    });
    setShowAddForm(false);
  };

  const handleStartEncounter = (encounter: Encounter) => {
    encounter.npcs.forEach(({ npcId, count }) => {
      const npc = npcs.find(n => n.id === npcId);
      if (npc) {
        for (let i = 0; i < count; i++) {
          addParticipant({
            id: crypto.randomUUID(),
            name: `${npc.name} ${count > 1 ? `#${i + 1}` : ''}`,
            initiative: npc.initiative,
            currentHp: npc.currentHp,
            maxHp: npc.maxHp,
            conditions: [],
            type: 'npc',
            ac: npc.ac,
          });
        }
      }
    });
    setCurrentModule('initiative');
  };

  const calculateXP = (encounterNPCs: Array<{ npcId: string; count: number }>) => {
    let totalXP = 0;
    encounterNPCs.forEach(({ npcId, count }) => {
      const npc = npcs.find(n => n.id === npcId);
      if (npc) {
        // Simple XP calculation based on CR (challenge rating)
        // This is a simplified version - adjust as needed
        const baseXP = 50; // Base XP per NPC
        totalXP += baseXP * count;
      }
    });
    return totalXP;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciador de Encontros</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Encontro
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Novo Encontro</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Encontro"
              value={newEncounter.name}
              onChange={(e) => setNewEncounter({ ...newEncounter, name: e.target.value })}
              className="input w-full"
            />
            <textarea
              placeholder="Descrição"
              value={newEncounter.description}
              onChange={(e) => setNewEncounter({ ...newEncounter, description: e.target.value })}
              className="input w-full min-h-[100px]"
            />
            <div>
              <label className="block text-sm font-medium mb-2">Adicionar NPC</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const npcId = e.target.value;
                    const existing = newEncounter.npcs?.find(n => n.npcId === npcId);
                    if (existing) {
                      setNewEncounter({
                        ...newEncounter,
                        npcs: newEncounter.npcs?.map(n =>
                          n.npcId === npcId ? { ...n, count: n.count + 1 } : n
                        ),
                      });
                    } else {
                      setNewEncounter({
                        ...newEncounter,
                        npcs: [...(newEncounter.npcs || []), { npcId, count: 1 }],
                      });
                    }
                    e.target.value = '';
                  }
                }}
                className="input w-full"
              >
                <option value="">Selecione um NPC...</option>
                {npcs.map((npc) => (
                  <option key={npc.id} value={npc.id}>
                    {npc.name}
                  </option>
                ))}
              </select>
            </div>
            {newEncounter.npcs && newEncounter.npcs.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">NPCs no Encontro</label>
                <div className="space-y-2">
                  {newEncounter.npcs.map(({ npcId, count }, index) => {
                    const npc = npcs.find(n => n.id === npcId);
                    return (
                      <div key={index} className="bg-slate-700 rounded-lg p-2 flex items-center justify-between">
                        <span>{npc?.name || npcId} x{count}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setNewEncounter({
                                ...newEncounter,
                                npcs: newEncounter.npcs?.map((n, i) =>
                                  i === index ? { ...n, count: Math.max(1, n.count - 1) } : n
                                ),
                              })
                            }
                            className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              setNewEncounter({
                                ...newEncounter,
                                npcs: newEncounter.npcs?.map((n, i) =>
                                  i === index ? { ...n, count: n.count + 1 } : n
                                ),
                              })
                            }
                            className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              setNewEncounter({
                                ...newEncounter,
                                npcs: newEncounter.npcs?.filter((_, i) => i !== index),
                              })
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  XP Total: {calculateXP(newEncounter.npcs)}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleAddEncounter} className="btn-primary">
                Criar Encontro
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {encounters.map((encounter) => (
          <div key={encounter.id} className="card">
            {editingId === encounter.id ? (
              <EncounterEditForm
                encounter={encounter}
                npcs={npcs}
                onSave={(updates) => {
                  updateEncounter(encounter.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{encounter.name}</h3>
                    <div className="text-sm text-gray-400">
                      {encounter.npcs.reduce((sum, n) => sum + n.count, 0)} NPC(s) | {encounter.xp || calculateXP(encounter.npcs)} XP
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEncounter(encounter)}
                      className="p-2 hover:bg-emerald-600 rounded transition-colors"
                      title="Iniciar encontro"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(encounter.id)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEncounter(encounter.id)}
                      className="p-2 hover:bg-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {encounter.description && (
                  <p className="text-sm text-gray-300 mb-4">{encounter.description}</p>
                )}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">NPCs:</h4>
                  <div className="space-y-1">
                    {encounter.npcs.map(({ npcId, count }, index) => {
                      const npc = npcs.find(n => n.id === npcId);
                      return (
                        <div key={index} className="text-sm text-gray-300">
                          • {npc?.name || npcId} x{count}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Criado em: {new Date(encounter.createdAt).toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {encounters.length === 0 && (
        <div className="card text-center text-gray-400">
          Nenhum encontro cadastrado. Clique em "Novo Encontro" para começar.
        </div>
      )}
    </div>
  );
}

interface EncounterEditFormProps {
  encounter: Encounter;
  npcs: NPC[];
  onSave: (updates: Partial<Encounter>) => void;
  onCancel: () => void;
}

function EncounterEditForm({ encounter, npcs, onSave, onCancel }: EncounterEditFormProps) {
  const [formData, setFormData] = useState<Partial<Encounter>>(encounter);

  const calculateXP = (encounterNPCs: Array<{ npcId: string; count: number }>) => {
    let totalXP = 0;
    encounterNPCs.forEach(({ npcId, count }) => {
      const npc = npcs.find(n => n.id === npcId);
      if (npc) {
        const baseXP = 50;
        totalXP += baseXP * count;
      }
    });
    return totalXP;
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input w-full"
        placeholder="Nome do Encontro"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="input w-full min-h-[100px]"
        placeholder="Descrição"
      />
      <div>
        <label className="block text-sm font-medium mb-2">Adicionar NPC</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              const npcId = e.target.value;
              const existing = formData.npcs?.find(n => n.npcId === npcId);
              if (existing) {
                setFormData({
                  ...formData,
                  npcs: formData.npcs?.map(n =>
                    n.npcId === npcId ? { ...n, count: n.count + 1 } : n
                  ),
                });
              } else {
                setFormData({
                  ...formData,
                  npcs: [...(formData.npcs || []), { npcId, count: 1 }],
                });
              }
              e.target.value = '';
            }
          }}
          className="input w-full"
        >
          <option value="">Selecione um NPC...</option>
          {npcs.map((npc) => (
            <option key={npc.id} value={npc.id}>
              {npc.name}
            </option>
          ))}
        </select>
      </div>
      {formData.npcs && formData.npcs.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">NPCs no Encontro</label>
          <div className="space-y-2">
            {formData.npcs.map(({ npcId, count }, index) => {
              const npc = npcs.find(n => n.id === npcId);
              return (
                <div key={index} className="bg-slate-700 rounded-lg p-2 flex items-center justify-between">
                  <span>{npc?.name || npcId} x{count}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          npcs: formData.npcs?.map((n, i) =>
                            i === index ? { ...n, count: Math.max(1, n.count - 1) } : n
                          ),
                        })
                      }
                      className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          npcs: formData.npcs?.map((n, i) =>
                            i === index ? { ...n, count: n.count + 1 } : n
                          ),
                        })
                      }
                      className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          npcs: formData.npcs?.filter((_, i) => i !== index),
                        })
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            XP Total: {calculateXP(formData.npcs || [])}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button 
          onClick={() => {
            const xp = calculateXP(formData.npcs || []);
            onSave({ ...formData, xp });
          }} 
          className="btn-primary"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
        <button onClick={onCancel} className="btn-secondary">
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </div>
  );
}

