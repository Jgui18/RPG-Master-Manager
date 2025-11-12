import { create } from 'zustand';
import { NPC, CombatParticipant, CombatState, Encounter, SessionNote, DiceRoll, Monster } from '../types';
import { saveNPCs, loadNPCs, saveCombatState, loadCombatState, saveEncounters, loadEncounters, saveNotes, loadNotes } from '../services/storage';

interface AppState {
  // NPCs
  npcs: NPC[];
  loadNPCs: () => void;
  addNPC: (npc: NPC) => void;
  updateNPC: (id: string, npc: Partial<NPC>) => void;
  deleteNPC: (id: string) => void;

  // Combat
  combat: CombatState;
  loadCombat: () => void;
  addParticipant: (participant: CombatParticipant) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<CombatParticipant>) => void;
  nextTurn: () => void;
  previousTurn: () => void;
  resetCombat: () => void;
  sortByInitiative: () => void;

  // Encounters
  encounters: Encounter[];
  loadEncounters: () => void;
  addEncounter: (encounter: Encounter) => void;
  updateEncounter: (id: string, encounter: Partial<Encounter>) => void;
  deleteEncounter: (id: string) => void;

  // Notes
  notes: SessionNote[];
  loadNotes: () => void;
  addNote: (note: SessionNote) => void;
  updateNote: (id: string, note: Partial<SessionNote>) => void;
  deleteNote: (id: string) => void;

  // Dice
  diceHistory: DiceRoll[];
  addDiceRoll: (roll: DiceRoll) => void;
  clearDiceHistory: () => void;

  // UI
  currentModule: 'initiative' | 'npcs' | 'dice' | 'encounters' | 'notes' | 'bestiary';
  setCurrentModule: (module: AppState['currentModule']) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // NPCs
  npcs: [],
  loadNPCs: () => {
    const npcs = loadNPCs();
    set({ npcs });
  },
  addNPC: (npc) => {
    const npcs = [...get().npcs, npc];
    set({ npcs });
    saveNPCs(npcs);
  },
  updateNPC: (id, updates) => {
    const npcs = get().npcs.map(npc => npc.id === id ? { ...npc, ...updates } : npc);
    set({ npcs });
    saveNPCs(npcs);
  },
  deleteNPC: (id) => {
    const npcs = get().npcs.filter(npc => npc.id !== id);
    set({ npcs });
    saveNPCs(npcs);
  },

  // Combat
  combat: {
    participants: [],
    currentTurn: 0,
    round: 1,
  },
  loadCombat: () => {
    const combat = loadCombatState() || {
      participants: [],
      currentTurn: 0,
      round: 1,
    };
    set({ combat });
  },
  addParticipant: (participant) => {
    const combat = {
      ...get().combat,
      participants: [...get().combat.participants, participant],
    };
    set({ combat });
    saveCombatState(combat);
    get().sortByInitiative();
  },
  removeParticipant: (id) => {
    const participants = get().combat.participants.filter(p => p.id !== id);
    const currentTurn = get().combat.currentTurn >= participants.length ? 0 : get().combat.currentTurn;
    const combat = {
      ...get().combat,
      participants,
      currentTurn,
    };
    set({ combat });
    saveCombatState(combat);
  },
  updateParticipant: (id, updates) => {
    const combat = {
      ...get().combat,
      participants: get().combat.participants.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ),
    };
    set({ combat });
    saveCombatState(combat);
  },
  nextTurn: () => {
    const combat = get().combat;
    if (combat.participants.length === 0) return;
    const nextTurn = (combat.currentTurn + 1) % combat.participants.length;
    const round = nextTurn === 0 ? combat.round + 1 : combat.round;
    const newCombat = { ...combat, currentTurn: nextTurn, round };
    set({ combat: newCombat });
    saveCombatState(newCombat);
  },
  previousTurn: () => {
    const combat = get().combat;
    if (combat.participants.length === 0) return;
    const prevTurn = combat.currentTurn === 0 ? combat.participants.length - 1 : combat.currentTurn - 1;
    const round = combat.currentTurn === 0 ? Math.max(1, combat.round - 1) : combat.round;
    const newCombat = { ...combat, currentTurn: prevTurn, round };
    set({ combat: newCombat });
    saveCombatState(newCombat);
  },
  resetCombat: () => {
    const combat = {
      participants: [],
      currentTurn: 0,
      round: 1,
    };
    set({ combat });
    saveCombatState(combat);
  },
  sortByInitiative: () => {
    const combat = {
      ...get().combat,
      participants: [...get().combat.participants].sort((a, b) => b.initiative - a.initiative),
    };
    set({ combat });
    saveCombatState(combat);
  },

  // Encounters
  encounters: [],
  loadEncounters: () => {
    const encounters = loadEncounters();
    set({ encounters });
  },
  addEncounter: (encounter) => {
    const encounters = [...get().encounters, encounter];
    set({ encounters });
    saveEncounters(encounters);
  },
  updateEncounter: (id, updates) => {
    const encounters = get().encounters.map(e => e.id === id ? { ...e, ...updates } : e);
    set({ encounters });
    saveEncounters(encounters);
  },
  deleteEncounter: (id) => {
    const encounters = get().encounters.filter(e => e.id !== id);
    set({ encounters });
    saveEncounters(encounters);
  },

  // Notes
  notes: [],
  loadNotes: () => {
    const notesData = loadNotes();
    set({ notes: notesData.sessions });
  },
  addNote: (note) => {
    const notes = [...get().notes, note];
    set({ notes });
    saveNotes({ sessions: notes });
  },
  updateNote: (id, updates) => {
    const notes = get().notes.map(n => n.id === id ? { ...n, ...updates } : n);
    set({ notes });
    saveNotes({ sessions: notes });
  },
  deleteNote: (id) => {
    const notes = get().notes.filter(n => n.id !== id);
    set({ notes });
    saveNotes({ sessions: notes });
  },

  // Dice
  diceHistory: [],
  addDiceRoll: (roll) => {
    const history = [roll, ...get().diceHistory].slice(0, 10);
    set({ diceHistory: history });
  },
  clearDiceHistory: () => {
    set({ diceHistory: [] });
  },

  // UI
  currentModule: 'initiative',
  setCurrentModule: (module) => set({ currentModule: module }),
}));

