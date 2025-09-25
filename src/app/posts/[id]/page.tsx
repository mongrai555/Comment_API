// src/app/posts/[id]/page.tsx
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
  website: string;
};

interface PostDetailProps {
  params: { id: string };
}

export default function PostDetail({ params }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Post
        const postResponse = await axios.get<Post>(
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        
        // Fetch User (Author)
        const userResponse = await axios.get<User>(
          `https://jsonplaceholder.typicode.com/users/${postResponse.data.userId}`
        );
        
        // Fetch Comments Count
        const commentsResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
        );

        setPost(postResponse.data);
        setUser(userResponse.data);
        setCommentsCount(commentsResponse.data.length);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <p className="text-lg">กำลังโหลดโพสต์...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>ไม่พบโพสต์ที่ต้องการ หรือ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Post Detail */}
      <article className="bg-white shadow-lg rounded-lg p-8 mb-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          
          {user && (
            <div className="flex items-center text-gray-600 mb-4">
              <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <span className="font-semibold text-blue-600">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </header>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            {post.body}
          </p>
        </div>

        <footer className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>Post ID: {post.id}</span>
              <span className="mx-2">•</span>
              <span>{commentsCount} ความคิดเห็น</span>
            </div>
            
            {user?.website && (
              <a 
                href={`http://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🌐 {user.website}
              </a>
            )}
          </div>
        </footer>
      </article>

      {/* Comments Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            💬 ความคิดเห็น
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {commentsCount} รายการ
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/posts/${postId}/comments`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
          >
            📖 ดูความคิดเห็นทั้งหมด
          </Link>
          
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            ✍️ เขียนความคิดเห็น
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/posts"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          ← กลับไปหน้าโพสต์
        </Link>
        
        <div className="space-x-2">
          {parseInt(postId) > 1 && (
            <Link
              href={`/posts/${parseInt(postId) - 1}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ← โพสต์ก่อนหน้า
            </Link>
          )}
          
          <Link
            href={`/posts/${parseInt(postId) + 1}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            โพสต์ถัดไป →
          </Link>
        </div>
      </div>
    </div>
  );
}