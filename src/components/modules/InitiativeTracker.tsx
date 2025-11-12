import { useState } from 'react';
import { useStore } from '../../store/store';
import { CombatParticipant } from '../../types';
import { Plus, Trash2, ChevronRight, ChevronLeft, RotateCcw, ArrowUpDown, Heart, Shield, X } from 'lucide-react';

const commonConditions = ['Inconsciente', 'Caído', 'Sangrando', 'Envenenado', 'Queimado', 'Atordoado', 'Agarrado', 'Paralisado'];

export default function InitiativeTracker() {
  const { combat, addParticipant, removeParticipant, updateParticipant, nextTurn, previousTurn, resetCombat, sortByInitiative } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Partial<CombatParticipant>>({
    name: '',
    type: 'player',
    initiative: 0,
    currentHp: 0,
    maxHp: 0,
    conditions: [],
    ac: 10,
  });

  const handleAddParticipant = () => {
    if (!newParticipant.name) return;

    const participant: CombatParticipant = {
      id: crypto.randomUUID(),
      name: newParticipant.name!,
      type: newParticipant.type || 'player',
      initiative: newParticipant.initiative || 0,
      currentHp: newParticipant.maxHp || 0,
      maxHp: newParticipant.maxHp || 0,
      conditions: [],
      ac: newParticipant.ac || 10,
    };

    addParticipant(participant);
    setNewParticipant({
      name: '',
      type: 'player',
      initiative: 0,
      currentHp: 0,
      maxHp: 0,
      conditions: [],
      ac: 10,
    });
    setShowAddForm(false);
  };

  const handleHPChange = (id: string, delta: number) => {
    const participant = combat.participants.find(p => p.id === id);
    if (participant) {
      const newHP = Math.max(0, Math.min(participant.maxHp, participant.currentHp + delta));
      updateParticipant(id, { currentHp: newHP });
    }
  };

  const handleConditionToggle = (id: string, condition: string) => {
    const participant = combat.participants.find(p => p.id === id);
    if (participant) {
      const conditions = participant.conditions || [];
      const newConditions = conditions.includes(condition)
        ? conditions.filter(c => c !== condition)
        : [...conditions, condition];
      updateParticipant(id, { conditions: newConditions });
    }
  };

  const sortedParticipants = [...combat.participants].sort((a, b) => b.initiative - a.initiative);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={previousTurn} className="btn-secondary" disabled={combat.participants.length === 0}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-400">Rodada</div>
            <div className="text-3xl font-bold text-emerald-400">{combat.round}</div>
          </div>
          <button onClick={nextTurn} className="btn-secondary" disabled={combat.participants.length === 0}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={sortByInitiative} className="btn-secondary" title="Ordenar por iniciativa">
            <ArrowUpDown className="w-5 h-5" />
          </button>
          <button onClick={resetCombat} className="btn-secondary" title="Resetar combate">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Adicionar
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Adicionar Participante</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              className="input"
            />
            <select
              value={newParticipant.type}
              onChange={(e) => setNewParticipant({ ...newParticipant, type: e.target.value as 'player' | 'npc' })}
              className="input"
            >
              <option value="player">Jogador</option>
              <option value="npc">NPC</option>
            </select>
            <input
              type="number"
              placeholder="Iniciativa"
              value={newParticipant.initiative || ''}
              onChange={(e) => setNewParticipant({ ...newParticipant, initiative: parseInt(e.target.value) || 0 })}
              className="input"
            />
            <input
              type="number"
              placeholder="HP Máximo"
              value={newParticipant.maxHp || ''}
              onChange={(e) => setNewParticipant({ ...newParticipant, maxHp: parseInt(e.target.value) || 0 })}
              className="input"
            />
            <input
              type="number"
              placeholder="CA"
              value={newParticipant.ac || ''}
              onChange={(e) => setNewParticipant({ ...newParticipant, ac: parseInt(e.target.value) || 10 })}
              className="input"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddParticipant} className="btn-primary">
              Adicionar
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sortedParticipants.length === 0 ? (
          <div className="card text-center text-gray-400">
            Nenhum participante adicionado. Clique em "Adicionar" para começar.
          </div>
        ) : (
          sortedParticipants.map((participant, index) => {
            const isCurrentTurn = index === sortedParticipants.findIndex(p => p.id === combat.participants[combat.currentTurn]?.id);
            const hpPercentage = participant.maxHp > 0 ? (participant.currentHp / participant.maxHp) * 100 : 0;

            return (
              <div
                key={participant.id}
                className={`card transition-all ${
                  isCurrentTurn ? 'ring-2 ring-emerald-500 bg-slate-750' : ''
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`text-2xl font-bold w-12 text-center ${
                      isCurrentTurn ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {participant.initiative}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{participant.name}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                          {participant.type === 'player' ? 'Jogador' : 'NPC'}
                        </span>
                        {isCurrentTurn && (
                          <span className="text-xs px-2 py-1 rounded bg-emerald-500 text-white animate-pulse">
                            Turno Atual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm">
                            {participant.currentHp}/{participant.maxHp}
                          </span>
                          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${hpPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">CA {participant.ac || 10}</span>
                        </div>
                      </div>
                      {participant.conditions && participant.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {participant.conditions.map((condition) => (
                            <span
                              key={condition}
                              className="text-xs px-2 py-1 rounded bg-red-900 text-red-200 flex items-center gap-1"
                            >
                              {condition}
                              <button
                                onClick={() => handleConditionToggle(participant.id, condition)}
                                className="hover:text-red-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleHPChange(participant.id, 1)}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleHPChange(participant.id, -1)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        -1
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleHPChange(participant.id, 5)}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleHPChange(participant.id, -5)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        -5
                      </button>
                    </div>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleConditionToggle(participant.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="input text-sm py-1"
                    >
                      <option value="">Condições...</option>
                      {commonConditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-2 hover:bg-red-600 rounded transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

