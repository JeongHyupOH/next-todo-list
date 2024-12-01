const BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const TENANT_ID = 'haqu';

interface TodoItem {
 id: string;
 title: string;
 done: boolean;
 memo?: string;
 image?: string;
}

export const api = {
 getTodos: async () => {
   try {
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`);
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to fetch todos');
     }
     return res.json();
   } catch (error) {
     console.error('Error fetching todos:', error);
     throw error;
   }
 },

 getTodoById: async (itemId: string) => {
   try {
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`);
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to fetch todo');
     }
     return res.json() as Promise<TodoItem>;
   } catch (error) {
     console.error('Error fetching todo:', error);
     throw error;
   }
 },

 updateTodo: async (itemId: string, data: Partial<TodoItem>) => {
   try {
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         title: data.title,
         done: data.done,
         memo: data.memo,
         image: data.image
       }),
     });
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to update todo');
     }
     return res.json() as Promise<TodoItem>;
   } catch (error) {
     console.error('Error updating todo:', error);
     throw error;
   }
 },

 deleteTodo: async (itemId: string) => {
   try {
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
       method: 'DELETE',
     });
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to delete todo');
     }
     return res.json();
   } catch (error) {
     console.error('Error deleting todo:', error);
     throw error;
   }
 },

 createTodo: async (data: { title: string }) => {
   try {
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         title: data.title,
       }),
     });
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to create todo');
     }
     return res.json();
   } catch (error) {
     console.error('Error creating todo:', error);
     throw error;
   }
 },

 uploadImage: async (file: File) => {
   try {
     const formData = new FormData();
     formData.append('image', file);
     
     const res = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
       method: 'POST',
       body: formData,
     });
     
     if (!res.ok) {
       const errorData = await res.json();
       throw new Error(errorData.message || 'Failed to upload image');
     }
     
     return res.json() as Promise<{ url: string }>;
   } catch (error) {
     console.error('Error uploading image:', error);
     throw error;
   }
 }
};