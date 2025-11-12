export interface NPC {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  ac: number;
  initiative: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills: string[];
  abilities: string[];
}

export interface CombatParticipant {
  id: string;
  name: string;
  initiative: number;
  currentHp: number;
  maxHp: number;
  conditions: string[];
  type: 'player' | 'npc';
  ac?: number;
}

export interface CombatState {
  participants: CombatParticipant[];
  currentTurn: number;
  round: number;
}

export interface Encounter {
  id: string;
  name: string;
  description: string;
  npcs: Array<{
    npcId: string;
    count: number;
  }>;
  xp: number;
  createdAt: string;
}

export interface SessionNote {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'plot' | 'npc' | 'location' | 'treasure' | 'other';
}

export interface CampaignNotes {
  sessions: SessionNote[];
}

export interface Monster {
  id: string;
  name: string;
  type: string;
  challenge: number;
  hp: number;
  ac: number;
  speed: string;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills: string[];
  abilities: string[];
  actions: string[];
}

export interface DiceRoll {
  id: string;
  expression: string;
  result: number;
  rolls: number[];
  timestamp: number;
}

