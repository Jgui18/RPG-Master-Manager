import { useState } from 'react';
import { useStore } from '../../store/store';
import { DiceRoll } from '../../types';
import { Dice6, Trash2, History } from 'lucide-react';

export default function DiceRoller() {
  const { diceHistory, addDiceRoll, clearDiceHistory } = useStore();
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);

  const parseDiceExpression = (expr: string): { dice: number; sides: number; modifier: number } | null => {
    const match = expr.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) return null;

    const dice = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    return { dice, sides, modifier };
  };

  const rollDice = (dice: number, sides: number, modifier: number): { result: number; rolls: number[] } => {
    const rolls: number[] = [];
    for (let i = 0; i < dice; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const result = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    return { result, rolls };
  };

  const handleRoll = (expr?: string) => {
    const exprToUse = expr || expression;
    if (!exprToUse.trim()) return;

    const parsed = parseDiceExpression(exprToUse);
    if (!parsed) {
      alert('Expressão inválida! Use o formato: XdY+Z (ex: 1d20, 2d6+3)');
      return;
    }

    const { result, rolls } = rollDice(parsed.dice, parsed.sides, parsed.modifier);
    
    const diceRoll: DiceRoll = {
      id: crypto.randomUUID(),
      expression: exprToUse,
      result,
      rolls,
      timestamp: Date.now(),
    };

    addDiceRoll(diceRoll);
    setLastResult(result);
    if (!expr) setExpression('');
  };

  const quickRolls = [
    { label: 'd4', expr: '1d4' },
    { label: 'd6', expr: '1d6' },
    { label: 'd8', expr: '1d8' },
    { label: 'd10', expr: '1d10' },
    { label: 'd12', expr: '1d12' },
    { label: 'd20', expr: '1d20' },
    { label: 'd100', expr: '1d100' },
    { label: '2d6', expr: '2d6' },
    { label: '3d6', expr: '3d6' },
    { label: '2d20', expr: '2d20' },
  ];

  const attributeTests = [
    { label: 'Teste de FOR', expr: '1d20' },
    { label: 'Teste de DES', expr: '1d20' },
    { label: 'Teste de CON', expr: '1d20' },
    { label: 'Teste de INT', expr: '1d20' },
    { label: 'Teste de SAB', expr: '1d20' },
    { label: 'Teste de CAR', expr: '1d20' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Roller de Dados</h2>
        {diceHistory.length > 0 && (
          <button onClick={clearDiceHistory} className="btn-secondary">
            <Trash2 className="w-4 h-4" />
            Limpar Histórico
          </button>
        )}
      </div>

      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Expressão de Dados</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: 1d20, 2d6+3, 1d8-1"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRoll();
                }
              }}
              className="input flex-1"
            />
            <button onClick={() => handleRoll()} className="btn-primary">
              <Dice6 className="w-5 h-5" />
              Rolar
            </button>
          </div>
          {lastResult !== null && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-400">Último Resultado</div>
              <div className="text-4xl font-bold text-emerald-400">{lastResult}</div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rolagens Rápidas</label>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quickRolls.map((roll) => (
              <button
                key={roll.expr}
                onClick={() => handleRoll(roll.expr)}
                className="btn-secondary text-sm"
              >
                {roll.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Testes de Atributo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {attributeTests.map((test) => (
            <button
              key={test.label}
              onClick={() => handleRoll(test.expr)}
              className="btn-secondary text-sm"
            >
              {test.label}
            </button>
          ))}
        </div>
      </div>

      {diceHistory.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Histórico de Rolagens</h3>
            <span className="text-sm text-gray-400">({diceHistory.length})</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {diceHistory.map((roll) => (
              <div
                key={roll.id}
                className="bg-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{roll.expression}</div>
                  <div className="text-sm text-gray-400">
                    {roll.rolls.join(' + ')}
                    {roll.rolls.length > 1 && ` = ${roll.result}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(roll.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{roll.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {diceHistory.length === 0 && (
        <div className="card text-center text-gray-400">
          Nenhuma rolagem ainda. Use os botões acima ou digite uma expressão para rolar dados.
        </div>
      )}
    </div>
  );
}

