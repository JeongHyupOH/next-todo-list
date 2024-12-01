'use client';
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
       title: title.trim()
     });
     
     setTitle('');
     router.refresh(); 
   } catch (error) {
     console.error('Failed to add todo:', error);
     alert('할 일 추가에 실패했습니다.');
   }
 };

 const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === 'Enter') {
     e.preventDefault(); 
     if (!title.trim()) return;
     
     try {
       await api.createTodo({
         title: title.trim()
       });
       
       setTitle('');
       router.refresh();
     } catch (error) {
       console.error('Failed to add todo:', error);
       alert('할 일 추가에 실패했습니다.');
     }
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
       maxLength={50} // 입력 길이 제한 추가
     />
     <button
       type="submit"
       className={styles.button}
       disabled={!title.trim()} 
     >
       + 추가하기
     </button>
   </form>
 );
}