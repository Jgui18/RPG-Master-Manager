import { useState } from 'react';
import { useStore } from '../../store/store';
import { NPC } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Swords } from 'lucide-react';

export default function NPCManager() {
  const { npcs, addNPC, updateNPC, deleteNPC, addParticipant, setCurrentModule } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNPC, setNewNPC] = useState<Partial<NPC>>({
    name: '',
    maxHp: 0,
    currentHp: 0,
    ac: 10,
    initiative: 0,
    attributes: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    skills: [],
    abilities: [],
  });

  const handleAddNPC = () => {
    if (!newNPC.name) return;

    const npc: NPC = {
      id: crypto.randomUUID(),
      name: newNPC.name,
      maxHp: newNPC.maxHp || 0,
      currentHp: newNPC.maxHp || 0,
      ac: newNPC.ac || 10,
      initiative: newNPC.initiative || 0,
      attributes: newNPC.attributes || {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      skills: newNPC.skills || [],
      abilities: newNPC.abilities || [],
    };

    addNPC(npc);
    setNewNPC({
      name: '',
      maxHp: 0,
      currentHp: 0,
      ac: 10,
      initiative: 0,
      attributes: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      skills: [],
      abilities: [],
    });
    setShowAddForm(false);
  };

  const handleAddToCombat = (npc: NPC) => {
    addParticipant({
      id: crypto.randomUUID(),
      name: npc.name,
      initiative: npc.initiative,
      currentHp: npc.currentHp,
      maxHp: npc.maxHp,
      conditions: [],
      type: 'npc',
      ac: npc.ac,
    });
    setCurrentModule('initiative');
  };

  const attributeNames = {
    str: 'FOR',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciador de NPCs</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo NPC
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Novo NPC</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={newNPC.name}
              onChange={(e) => setNewNPC({ ...newNPC, name: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="HP Máximo"
              value={newNPC.maxHp || ''}
              onChange={(e) => setNewNPC({ ...newNPC, maxHp: parseInt(e.target.value) || 0 })}
              className="input"
            />
            <input
              type="number"
              placeholder="CA"
              value={newNPC.ac || ''}
              onChange={(e) => setNewNPC({ ...newNPC, ac: parseInt(e.target.value) || 10 })}
              className="input"
            />
            <input
              type="number"
              placeholder="Iniciativa Base"
              value={newNPC.initiative || ''}
              onChange={(e) => setNewNPC({ ...newNPC, initiative: parseInt(e.target.value) || 0 })}
              className="input"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Atributos</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {Object.entries(attributeNames).map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-gray-400">{label}</label>
                  <input
                    type="number"
                    value={newNPC.attributes?.[key as keyof typeof newNPC.attributes] || 10}
                    onChange={(e) =>
                      setNewNPC({
                        ...newNPC,
                        attributes: {
                          ...newNPC.attributes!,
                          [key]: parseInt(e.target.value) || 10,
                        },
                      })
                    }
                    className="input text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Perícias (separadas por vírgula)</label>
            <input
              type="text"
              placeholder="Ex: Percepção, Furtividade, Atletismo"
              value={newNPC.skills?.join(', ') || ''}
              onChange={(e) =>
                setNewNPC({
                  ...newNPC,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                })
              }
              className="input w-full"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Habilidades (uma por linha)</label>
            <textarea
              placeholder="Ex: Visão no escuro&#10;Resistência a fogo"
              value={newNPC.abilities?.join('\n') || ''}
              onChange={(e) =>
                setNewNPC({
                  ...newNPC,
                  abilities: e.target.value.split('\n').filter(a => a.trim()),
                })
              }
              className="input w-full min-h-[100px]"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddNPC} className="btn-primary">
              Criar NPC
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {npcs.map((npc) => (
          <div key={npc.id} className="card">
            {editingId === npc.id ? (
              <NPCEditForm
                npc={npc}
                onSave={(updates) => {
                  updateNPC(npc.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{npc.name}</h3>
                    <div className="text-sm text-gray-400">
                      HP: {npc.currentHp}/{npc.maxHp} | CA: {npc.ac} | Iniciativa: {npc.initiative}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCombat(npc)}
                      className="p-2 hover:bg-emerald-600 rounded transition-colors"
                      title="Adicionar ao combate"
                    >
                      <Swords className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(npc.id)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNPC(npc.id)}
                      className="p-2 hover:bg-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {npc.attributes && (
                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    {Object.entries(attributeNames).map(([key, label]) => (
                      <div key={key}>
                        <span className="text-gray-400">{label}:</span>{' '}
                        <span className="font-semibold">{npc.attributes![key as keyof typeof npc.attributes]}</span>
                      </div>
                    ))}
                  </div>
                )}
                {npc.skills && npc.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Perícias:</h4>
                    <div className="flex flex-wrap gap-1">
                      {npc.skills.map((skill, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {npc.abilities && npc.abilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Habilidades:</h4>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      {npc.abilities.map((ability, index) => (
                        <li key={index}>{ability}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {npcs.length === 0 && (
        <div className="card text-center text-gray-400">
          Nenhum NPC cadastrado. Clique em "Novo NPC" para começar.
        </div>
      )}
    </div>
  );
}

interface NPCEditFormProps {
  npc: NPC;
  onSave: (updates: Partial<NPC>) => void;
  onCancel: () => void;
}

function NPCEditForm({ npc, onSave, onCancel }: NPCEditFormProps) {
  const [formData, setFormData] = useState<Partial<NPC>>(npc);

  const attributeNames = {
    str: 'FOR',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR',
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
        />
        <input
          type="number"
          placeholder="HP Máximo"
          value={formData.maxHp}
          onChange={(e) => setFormData({ ...formData, maxHp: parseInt(e.target.value) || 0, currentHp: parseInt(e.target.value) || 0 })}
          className="input"
        />
        <input
          type="number"
          placeholder="CA"
          value={formData.ac}
          onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) || 10 })}
          className="input"
        />
        <input
          type="number"
          placeholder="Iniciativa Base"
          value={formData.initiative}
          onChange={(e) => setFormData({ ...formData, initiative: parseInt(e.target.value) || 0 })}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Atributos</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(attributeNames).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-400">{label}</label>
              <input
                type="number"
                value={formData.attributes?.[key as keyof typeof formData.attributes] || 10}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attributes: {
                      ...formData.attributes!,
                      [key]: parseInt(e.target.value) || 10,
                    },
                  })
                }
                className="input text-sm"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Perícias (separadas por vírgula)</label>
        <input
          type="text"
          value={formData.skills?.join(', ') || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value.split(',').map(s => s.trim()).filter(s => s),
            })
          }
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Habilidades (uma por linha)</label>
        <textarea
          value={formData.abilities?.join('\n') || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              abilities: e.target.value.split('\n').filter(a => a.trim()),
            })
          }
          className="input w-full min-h-[100px]"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(formData)} className="btn-primary">
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

