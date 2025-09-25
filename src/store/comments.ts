"use client";

import { create } from "zustand";
import axios from "axios";

// 💬 Type Definition - กำหนดโครงสร้างข้อมูล Comment
type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
};

// 🏪 State Interface - กำหนดโครงสร้างของ Comments Store State
type CommentsState = {
  // 📊 Data State
  comments: Comment[];              // เก็บรายการคอมเมนต์ทั้งหมด
  commentsByPost: Record<number, Comment[]>; // เก็บคอมเมนต์แยกตาม Post ID
  loading: boolean;                 // สถานะการโหลดข้อมูล
  error: string | null;             // ข้อความ error (ถ้ามี)
  
  // 🎯 Actions - ฟังก์ชันต่างๆ สำหรับจัดการข้อมูล
  fetchCommentsByPostId: (postId: number) => Promise<Comment[]>; // ดึงคอมเมนต์ตาม Post ID
  fetchAllComments: () => Promise<void>;                        // ดึงคอมเมนต์ทั้งหมด
  getCommentsByPostId: (postId: number) => Comment[];           // ดึงคอมเมนต์จาก state ตาม Post ID
  addComment: (comment: Omit<Comment, 'id'>) => void;          // เพิ่มคอมเมนต์ใหม่
  clearError: () => void;                                       // ล้าง error
  reset: () => void;                                            // รีเซ็ต state
};

// 🎨 Zustand Comments Store Creation
export const useComments = create<CommentsState>((set, get) => ({
  // 🎯 Initial State - ค่าเริ่มต้น
  comments: [],
  commentsByPost: {},
  loading: false,
  error: null,

  // 📥 Fetch Comments by Post ID - ดึงคอมเมนต์ตาม Post ID
  fetchCommentsByPostId: async (postId: number) => {
    try {
      // เริ่มการโหลด
      set({ loading: true, error: null });
      
      // ตรวจสอบว่ามีคอมเมนต์ของ post นี้ใน cache แล้วหรือไม่
      const currentCommentsByPost = get().commentsByPost;
      if (currentCommentsByPost[postId]) {
        set({ loading: false });
        return currentCommentsByPost[postId];
      }
      
      // เรียก API
      const { data } = await axios.get<Comment[]>(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      
      // อัพเดท state เมื่อสำเร็จ
      const updatedCommentsByPost = {
        ...currentCommentsByPost,
        [postId]: data
      };
      
      const updatedAllComments = [...get().comments];
      
      // เพิ่มคอมเมนต์ใหม่ที่ยังไม่มีใน state
      data.forEach(comment => {
        if (!updatedAllComments.find(c => c.id === comment.id)) {
          updatedAllComments.push(comment);
        }
      });
      
      set({ 
        commentsByPost: updatedCommentsByPost,
        comments: updatedAllComments,
        loading: false 
      });
      
      return data;
      
    } catch (error) {
      // จัดการ error
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการดึงคอมเมนต์";
      set({ error: errorMessage, loading: false });
      return [];
    }
  },

  // 📥 Fetch All Comments - ดึงคอมเมนต์ทั้งหมด
  fetchAllComments: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data } = await axios.get<Comment[]>(
        "https://jsonplaceholder.typicode.com/comments"
      );
      
      // จัดกลุ่มคอมเมนต์ตาม Post ID
      const groupedComments: Record<number, Comment[]> = {};
      data.forEach(comment => {
        if (!groupedComments[comment.postId]) {
          groupedComments[comment.postId] = [];
        }
        groupedComments[comment.postId].push(comment);
      });
      
      set({ 
        comments: data, 
        commentsByPost: groupedComments,
        loading: false 
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการดึงข้อมูลคอมเมนต์";
      set({ error: errorMessage, loading: false });
    }
  },

  // 🔍 Get Comments by Post ID from State - ดึงคอมเมนต์จาก state ตาม Post ID
  getCommentsByPostId: (postId: number) => {
    const commentsByPost = get().commentsByPost;
    return commentsByPost[postId] || [];
  },

  // ➕ Add New Comment - เพิ่มคอมเมนต์ใหม่
  addComment: (newComment) => {
    const currentComments = get().comments;
    const newId = Math.max(...currentComments.map(comment => comment.id), 0) + 1;
    const commentWithId = { ...newComment, id: newId };
    
    const updatedComments = [commentWithId, ...currentComments];
    
    // อัพเดท commentsByPost
    const currentCommentsByPost = get().commentsByPost;
    const postComments = currentCommentsByPost[newComment.postId] || [];
    const updatedCommentsByPost = {
      ...currentCommentsByPost,
      [newComment.postId]: [commentWithId, ...postComments]
    };
    
    set({ 
      comments: updatedComments,
      commentsByPost: updatedCommentsByPost
    });
  },

  // 🧹 Clear Error - ล้าง error
  clearError: () => {
    set({ error: null });
  },

  // 🔄 Reset State - รีเซ็ต state กลับเป็นค่าเริ่มต้น
  reset: () => {
    set({ 
      comments: [], 
      commentsByPost: {},
      loading: false, 
      error: null 
    });
  },
}));