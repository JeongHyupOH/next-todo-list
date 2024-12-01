'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/TodoForm.module.css';
import { api } from '@/utils/api';

export default function TodoForm() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      await api.createTodo(name.trim());
      setName('');
      router.refresh();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일 입력하세요"
        className={styles.input}
        maxLength={50}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!name.trim()}
      >
        + 추가하기
      </button>
    </form>
  );
}