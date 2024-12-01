const BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const TENANT_ID = 'haqu'; 

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  memo: string;
  image?: string | null;
}

export const api = {
  getTodos: async () => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`);
      if (!res.ok) throw new Error('Failed to fetch todos');
      return res.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  getTodoById: async (itemId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`);
      if (!res.ok) throw new Error('Failed to fetch todo');
      return res.json() as Promise<TodoItem>;
    } catch (error) {
      console.error('Error fetching todo:', error);
      return null;
    }
  },

  updateTodo: async (itemId: string, data: Partial<TodoItem>) => {
    const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<TodoItem>;
  },

  deleteTodo: async (itemId: string) => {
    await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  createTodo: async (data: { title: string; completed: boolean; memo: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      return res.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json() as Promise<{ url: string }>;
  }
};

