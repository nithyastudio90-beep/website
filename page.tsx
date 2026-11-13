import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bbdfewknrwiurrioojll.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_n5uBFZjz2WvEu-B0DOcisg_FoioK1jL";

export default function Page() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    supabase.from('todos').select().then(({ data }) => {
      if (data) setTodos(data);
    });
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}
