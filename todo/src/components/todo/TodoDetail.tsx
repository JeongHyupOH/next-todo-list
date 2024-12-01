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
        const data = await api.getTodoById(itemId);
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
      <div className={styles.titleSection}>
        <div className={styles.titleWrapper}>
          <div 
            className={styles.checkbox}
            onClick={() => setTodo(prev => ({ ...prev, isCompleted: !prev.isCompleted }))}
            role="checkbox"
            aria-checked={todo.isCompleted}
          />
          <input
            type="text"
            value={todo.name}
            onChange={(e) => setTodo(prev => ({ ...prev, name: e.target.value }))}
            className={styles.title}
            placeholder="필수로 작성해 주세요"
          />
        </div>
      </div>
  
      <div className={styles.content}>
        <div className={styles.imageSection}>
          {todo.imageUrl ? (
            <img 
              src={todo.imageUrl} 
              alt="Todo image"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.plusIcon}>+</span>
            </div>
          )}
        </div>
  
        <div className={styles.memoSection}>
          <span className={styles.memoTitle}>Memo</span>
          <textarea
            value={todo.memo}
            onChange={(e) => setTodo(prev => ({ ...prev, memo: e.target.value }))}
            className={styles.memoTextarea}
            placeholder="오늘기록을 기록해주세요"
          />
        </div>
      </div>
  
      <div className={styles.buttonContainer}>
        <button 
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
        >
          수정 완료
        </button>
        <button 
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}