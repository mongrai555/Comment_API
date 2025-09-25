"use client";

import { create } from "zustand";
import axios from "axios";

// 📝 Type Definition - กำหนดโครงสร้างข้อมูล Post
type Post = { 
  id: number; 
  title: string; 
  body: string; 
  userId: number;
};

// 🏪 State Interface - กำหนดโครงสร้างของ Store State
type State = {
  // 📊 Data State
  items: Post[];                    // เก็บรายการโพสต์ทั้งหมด
  loading: boolean;                 // สถานะการโหลดข้อมูล
  error: string | null;             // ข้อความ error (ถ้ามี)
  
  // 🎯 Actions - ฟังก์ชันต่างๆ สำหรับจัดการข้อมูล
  fetchData: () => Promise<void>;               // ดึงข้อมูลทั้งหมด
  fetchPostById: (id: number) => Promise<Post | null>;  // ดึงโพสต์ตาม ID
  addPost: (post: Omit<Post, 'id'>) => void;    // เพิ่มโพสต์ใหม่
  updatePost: (id: number, updates: Partial<Post>) => void; // อัพเดทโพสต์
  deletePost: (id: number) => void;             // ลบโพสต์
  clearError: () => void;                       // ล้าง error
  reset: () => void;                            // รีเซ็ต state
};

// 🎨 Zustand Store Creation
export const usePosts = create<State>((set, get) => ({
  // 🎯 Initial State - ค่าเริ่มต้น
  items: [],
  loading: false,
  error: null,

  // 📥 Fetch All Posts - ดึงข้อมูลโพสต์ทั้งหมด
  fetchData: async () => {
    try {
      // เริ่มการโหลด
      set({ loading: true, error: null });
      
      // เรียก API
      const { data } = await axios.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      
      // อัพเดท state เมื่อสำเร็จ
      set({ items: data, loading: false });
      
    } catch (error) {
      // จัดการ error
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการดึงข้อมูล";
      set({ error: errorMessage, loading: false });
    }
  },

  // 🔍 Fetch Single Post - ดึงโพสต์ตาม ID
  fetchPostById: async (id: number) => {
    try {
      set({ loading: true, error: null });
      
      const { data } = await axios.get<Post>(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      
      // อัพเดท items หาก post ยังไม่มีใน state
      const currentItems = get().items;
      const existingPost = currentItems.find(item => item.id === id);
      
      if (!existingPost) {
        set({ items: [...currentItems, data] });
      }
      
      set({ loading: false });
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "ไม่พบโพสต์ที่ต้องการ";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  // ➕ Add New Post - เพิ่มโพสต์ใหม่
  addPost: (newPost) => {
    const currentItems = get().items;
    const newId = Math.max(...currentItems.map(item => item.id), 0) + 1;
    const postWithId = { ...newPost, id: newId };
    
    set({ items: [postWithId, ...currentItems] });
  },

  // ✏️ Update Post - อัพเดทโพสต์
  updatePost: (id, updates) => {
    const currentItems = get().items;
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    
    set({ items: updatedItems });
  },

  // 🗑️ Delete Post - ลบโพสต์
  deletePost: (id) => {
    const currentItems = get().items;
    const filteredItems = currentItems.filter(item => item.id !== id);
    
    set({ items: filteredItems });
  },

  // 🧹 Clear Error - ล้าง error
  clearError: () => {
    set({ error: null });
  },

  // 🔄 Reset State - รีเซ็ต state กลับเป็นค่าเริ่มต้น
  reset: () => {
    set({ items: [], loading: false, error: null });
  },
}));