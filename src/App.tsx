import { useEffect } from 'react';
import Layout from './components/Layout';
import InitiativeTracker from './components/modules/InitiativeTracker';
import NPCManager from './components/modules/NPCManager';
import DiceRoller from './components/modules/DiceRoller';
import EncounterBuilder from './components/modules/EncounterBuilder';
import CampaignNotes from './components/modules/CampaignNotes';
import Bestiary from './components/modules/Bestiary';
import { useStore } from './store/store';

function App() {
  const { currentModule, loadNPCs, loadCombat, loadEncounters, loadNotes } = useStore();

  useEffect(() => {
    loadNPCs();
    loadCombat();
    loadEncounters();
    loadNotes();
  }, [loadNPCs, loadCombat, loadEncounters, loadNotes]);

  const renderModule = () => {
    switch (currentModule) {
      case 'initiative':
        return <InitiativeTracker />;
      case 'npcs':
        return <NPCManager />;
      case 'dice':
        return <DiceRoller />;
      case 'encounters':
        return <EncounterBuilder />;
      case 'notes':
        return <CampaignNotes />;
      case 'bestiary':
        return <Bestiary />;
      default:
        return <InitiativeTracker />;
    }
  };

  return (
    <Layout>
      {renderModule()}
    </Layout>
  );
}

export default App;

