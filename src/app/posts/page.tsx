// src/app/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Posts and Users simultaneously
        const [postsResponse, usersResponse] = await Promise.all([
          axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts"),
          axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
        ]);

        setPosts(postsResponse.data.slice(0, 20)); // Show first 20 posts
        setUsers(usersResponse.data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <p className="text-lg">กำลังโหลดโพสต์...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>ข้อผิดพลาด: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 บทความทั้งหมด
        </h1>
        <p className="text-gray-600">
          มีบทความทั้งหมด {posts.length} บทความ
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <header className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <div className="text-sm text-gray-500">
                  โดย: {getUserName(post.userId)} • ID: {post.id}
                </div>
              </header>

              <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.body}
                </p>
              </div>

              <footer className="flex justify-between items-center">
                <Link
                  href={`/posts/${post.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                >
                  📖 อ่านเต็ม
                </Link>
                
                <Link
                  href={`/posts/${post.id}/comments`}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                >
                  💬 ความคิดเห็น
                </Link>
              </footer>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
          โหลดโพสต์เพิ่มเติม
        </button>
      </div>
    </div>
  );
}