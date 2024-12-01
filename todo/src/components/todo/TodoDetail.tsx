'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/TodoDetail.module.css';
import { api } from '@/utils/api';

interface TodoDetailProps {
  itemId: string;
}

interface TodoItem {
  id: string;
  title: string;
  done: boolean;  
  memo?: string;  
  image?: string | null;
}

export default function TodoDetail({ itemId }: TodoDetailProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [todo, setTodo] = useState<TodoItem>({
    id: itemId,
    title: "",
    done: false, 
    memo: "",
    image: null,
  });

  useEffect(() => {
    const fetchTodo = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTodoById(itemId);
        if (data) {
          setTodo({
            id: data.id,
            title: data.title || "",
            done: data.done, 
            memo: data.memo || "",
            image: data.image || null,
          });
        } else {
          setError('Todo item not found');
          router.push('/');
        }
      } catch (error) {
        console.error("Failed to fetch todo:", error);
        setError('Failed to load todo item');
      } finally {
        setIsLoading(false);
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
      setTodo(prev => ({ ...prev, image: imageData.url }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(prev => ({ ...prev, title: e.target.value }));
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodo(prev => ({ ...prev, memo: e.target.value }));
  };

  const handleToggleDone = () => {
    setTodo(prev => ({ ...prev, done: !prev.done }));  
  };

  const handleSave = async () => {
    try {
      await api.updateTodo(itemId, {
        title: todo.title,
        done: todo.done,
        memo: todo.memo,
        image: todo.image || undefined,  
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to update todo:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;  
    
    try {
      await api.deleteTodo(itemId);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <div className={styles.titleWrapper}>
          <div 
            className={styles.checkbox} 
            onClick={handleToggleDone}
            role="checkbox"
            aria-checked={todo.done}
          />
          <input
            type="text"
            value={todo.title}
            onChange={handleTitleChange}
            className={styles.title}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection} onClick={handleImageClick}>
          {todo.image ? (
            <div className={styles.imageWrapper}>
              <Image
                src={todo.image}
                alt="Todo image"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : (
            <div className={styles.imageUploadPlaceholder}>
              클릭하여 이미지 업로드
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
          <span className={styles.memoTitle}>메모</span>
          <textarea
            value={todo.memo}
            onChange={handleMemoChange}
            className={styles.memoTextarea}
            placeholder="메모를 입력하세요"
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