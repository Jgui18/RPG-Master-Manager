import { useState, useMemo } from 'react';
import { useStore } from '../../store/store';
import { SessionNote } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';

const categories = [
  { value: 'plot' as const, label: 'Plot' },
  { value: 'npc' as const, label: 'NPCs' },
  { value: 'location' as const, label: 'Locais' },
  { value: 'treasure' as const, label: 'Tesouros' },
  { value: 'other' as const, label: 'Outro' },
];

export default function CampaignNotes() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SessionNote['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState<Partial<SessionNote>>({
    title: '',
    content: '',
    category: 'plot',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddNote = () => {
    if (!newNote.title) return;

    const note: SessionNote = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content || '',
      category: newNote.category || 'plot',
      date: newNote.date || new Date().toISOString().split('T')[0],
    };

    addNote(note);
    setNewNote({
      title: '',
      content: '',
      category: 'plot',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notes, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Caderno da Campanha</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nova Nota
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar nas anotações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Nova Nota</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="input w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value as SessionNote['category'] })
                }
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newNote.date}
                onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                className="input"
              />
            </div>
            <textarea
              placeholder="Conteúdo da nota..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="input w-full min-h-[300px] font-mono"
            />
            <div className="flex gap-2">
              <button onClick={handleAddNote} className="btn-primary">
                Criar Nota
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="card">
            {editingId === note.id ? (
              <NoteEditForm
                note={note}
                onSave={(updates) => {
                  updateNote(note.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                        {categories.find((c) => c.value === note.category)?.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(note.id)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 hover:bg-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6">
                  {note.content}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="card text-center text-gray-400">
          {searchQuery
            ? 'Nenhuma nota encontrada para a busca.'
            : selectedCategory === 'all'
            ? 'Nenhuma nota cadastrada. Clique em "Nova Nota" para começar.'
            : `Nenhuma nota na categoria "${categories.find((c) => c.value === selectedCategory)?.label}".`}
        </div>
      )}
    </div>
  );
}

interface NoteEditFormProps {
  note: SessionNote;
  onSave: (updates: Partial<SessionNote>) => void;
  onCancel: () => void;
}

function NoteEditForm({ note, onSave, onCancel }: NoteEditFormProps) {
  const [formData, setFormData] = useState<Partial<SessionNote>>(note);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="input w-full"
        placeholder="Título"
      />
      <div className="grid grid-cols-2 gap-4">
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as SessionNote['category'] })
          }
          className="input"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input"
        />
      </div>
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="input w-full min-h-[300px] font-mono"
        placeholder="Conteúdo da nota..."
      />
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

