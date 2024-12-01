import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/TodoForm.module.css';
import { api } from '@/utils/api';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await api.createTodo({ 
        title: title.trim(),
        completed: false,
        memo: '',
      });
      setTitle('');
      // 새로운 todo가 추가된 후 목록을 새로고침
      window.location.reload();
    } catch (error) {
      console.error('Failed to add todo:', error);
      alert('할 일 추가에 실패했습니다.');
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일 입력하세요"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        + 추가하기
      </button>
    </form>
  );
}