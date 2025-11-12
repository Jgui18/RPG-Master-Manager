import { NPC, CombatState, Encounter, CampaignNotes, Monster } from '../types';

const STORAGE_KEYS = {
  NPCs: 'rpg-npcs',
  COMBAT: 'rpg-combat',
  ENCOUNTERS: 'rpg-encounters',
  NOTES: 'rpg-notes',
} as const;

// NPCs
export const saveNPCs = (npcs: NPC[]): void => {
  localStorage.setItem(STORAGE_KEYS.NPCs, JSON.stringify(npcs));
};

export const loadNPCs = (): NPC[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NPCs);
  return data ? JSON.parse(data) : [];
};

// Combat State
export const saveCombatState = (state: CombatState): void => {
  localStorage.setItem(STORAGE_KEYS.COMBAT, JSON.stringify(state));
};

export const loadCombatState = (): CombatState | null => {
  const data = localStorage.getItem(STORAGE_KEYS.COMBAT);
  return data ? JSON.parse(data) : null;
};

// Encounters
export const saveEncounters = (encounters: Encounter[]): void => {
  localStorage.setItem(STORAGE_KEYS.ENCOUNTERS, JSON.stringify(encounters));
};

export const loadEncounters = (): Encounter[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ENCOUNTERS);
  return data ? JSON.parse(data) : [];
};

// Campaign Notes
export const saveNotes = (notes: CampaignNotes): void => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const loadNotes = (): CampaignNotes => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  return data ? JSON.parse(data) : { sessions: [] };
};

// Export/Import
export const exportData = (): string => {
  const data = {
    npcs: loadNPCs(),
    encounters: loadEncounters(),
    notes: loadNotes(),
    combat: loadCombatState(),
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData);
    if (data.npcs) saveNPCs(data.npcs);
    if (data.encounters) saveEncounters(data.encounters);
    if (data.notes) saveNotes(data.notes);
    if (data.combat) saveCombatState(data.combat);
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid data format');
  }
};

