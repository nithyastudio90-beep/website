import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTodos() {
      try {
        const { data: todos, error } = await supabase.from('todos').select();
        if (error) {
          setError(error.message);
        } else if (todos) {
          setTodos(todos);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getTodos();
  }, []);

  return (
    <div className="min-h-[60vh] py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-studio-card/80 border border-gold-500/30 rounded-3xl p-8 backdrop-blur-md">
        <h1 className="font-cinzel text-2xl font-bold text-studio-light mb-4">
          Supabase Test: Todos Query
        </h1>
        <p className="text-sm text-studio-muted mb-6">
          Querying <code className="text-gold-400 bg-studio-charcoal px-2 py-1 rounded">todos</code> from <code className="text-gold-400 bg-studio-charcoal px-2 py-1 rounded">https://bbdfewknrwiurrioojll.supabase.co</code>
        </p>

        {loading && <p className="text-gold-400 text-sm">Loading from Supabase...</p>}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-sm">
            Notice: {error} (Table 'todos' will show data once created in Supabase)
          </div>
        )}

        <ul className="space-y-2 mt-4">
          {todos.map((todo) => (
            <li key={todo.id} className="p-3 bg-studio-charcoal/60 rounded-xl border border-white/5 text-studio-light">
              {todo.name || todo.title || JSON.stringify(todo)}
            </li>
          ))}
          {!loading && todos.length === 0 && !error && (
            <p className="text-studio-muted text-sm italic">No todos found in table.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodosPage;
