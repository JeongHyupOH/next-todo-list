'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/TodoDetail.module.css';
import { api } from '@/utils/api';

interface TodoItem {
  id: number;
  tenantId: string;
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
}

interface UpdateTodoItem {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export default function TodoDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      alert("파일 이름은 영문만 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    try {
      const imageData = await api.uploadImage(file);
      setTodo(prev => ({ ...prev, imageUrl: imageData.url }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(prev => ({ ...prev, name: e.target.value }));
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodo(prev => ({ ...prev, memo: e.target.value }));
  };

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
            onChange={handleNameChange}
            className={styles.title}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection} onClick={handleImageClick}>
          {todo.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={todo.imageUrl}
                alt="Todo image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <div className={styles.memoSection}>
          <span className={styles.memoTitle}>Memo</span>
          <textarea
            value={todo.memo}
            onChange={handleMemoChange}
            className={styles.memoTextarea}
            placeholder="오늘도 힘내세요!"
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