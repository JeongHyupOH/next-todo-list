'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/TodoDetail.module.css';
import { api } from '@/utils/api';

// API 응답 타입들
interface TodoItem {
  id: number;
  tenantId: string;
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
}

// PATCH 요청시 사용할 타입
interface UpdateTodoItem {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export default function TodoDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [todo, setTodo] = useState<TodoItem>({
    id: Number(itemId),
    tenantId: "",
    name: "",
    memo: "",
    imageUrl: "",
    isCompleted: false
  });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const data = await api.getTodoById(Number(itemId));
        if (data) {
          setTodo(data);
        }
      } catch {
        router.push('/');
      }
    };

    fetchTodo();
  }, [itemId, router]);

  const handleSave = async () => {
    try {
      const updateData: UpdateTodoItem = {
        name: todo.name,
        memo: todo.memo,
        imageUrl: todo.imageUrl,
        isCompleted: todo.isCompleted
      };
      
      await api.updateTodo(Number(itemId), updateData);
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteTodo(Number(itemId));
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <input
          type="text"
          value={todo.name}
          onChange={(e) => setTodo(prev => ({ ...prev, name: e.target.value }))}
          className={styles.title}
        />
      </div>

      <div className={styles.memoSection}>
        <textarea
          value={todo.memo}
          onChange={(e) => setTodo(prev => ({ ...prev, memo: e.target.value }))}
          className={styles.memoTextarea}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleSave}>수정 완료</button>
        <button onClick={handleDelete}>삭제하기</button>
      </div>
    </div>
  );
}