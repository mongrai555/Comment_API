// src/app/posts/[id]/comments/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useComments } from "@/store/comments";
import { usePosts } from "@/store/posts";
import { postsApi, Post } from "@/services/api";
import { 
  CommentsList, 
  CommentsStats, 
  RefreshCommentsButton 
} from "@/app/Component/Comments";

interface CommentsPageProps {
  params: { id: string };
}

export default function CommentsPage({ params }: CommentsPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  
  const {
    commentsByPost,
    loading: commentsLoading,
    error: commentsError,
    fetchCommentsByPostId,
    clearError
  } = useComments();
  
  const postId = parseInt(params.id);
  const comments = commentsByPost[postId] || [];

  // Fetch post details
  const fetchPost = async () => {
    try {
      setPostLoading(true);
      setPostError(null);
      const postData = await postsApi.getById(postId);
      setPost(postData);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "ไม่พบโพสต์");
    } finally {
      setPostLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    clearError();
    await fetchCommentsByPostId(postId);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  // Combined loading state
  const isLoading = postLoading || commentsLoading;
  const hasError = postError || commentsError;

  if (isLoading && !post && comments.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="animate-pulse">
          {/* Post skeleton */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          
          {/* Comments skeleton */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-l-4 border-gray-200 bg-gray-50 p-4 rounded-r-lg">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-4">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header with navigation */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
          <span>›</span>
          <Link href="/posts" className="hover:text-blue-600">โพสต์</Link>
          <span>›</span>
          <span className="text-gray-800">ความคิดเห็น</span>
        </nav>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <h3 className="font-bold">เกิดข้อผิดพลาด</h3>
          <p>{postError || commentsError}</p>
          <button 
            onClick={() => {
              if (postError) fetchPost();
              if (commentsError) fetchComments();
            }}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Post Information */}
      {post && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-1">
              📝 {post.title}
            </h1>
            <div className="ml-4 text-right">
              <div className="text-sm text-gray-500">Post ID</div>
              <div className="text-lg font-bold text-blue-600">{post.id}</div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{post.body}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              👤 User ID: {post.userId}
            </div>
            <Link
              href={`/posts/${post.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              📖 ดูโพสต์เต็ม
            </Link>
          </div>
        </div>
      )}

      {/* Comments Statistics */}
      <CommentsStats
        totalComments={comments.length}
        postId={postId}
        className="mb-6"
      />

      {/* Comments Section with Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            💬 ความคิดเห็นทั้งหมด
          </h2>
          <RefreshCommentsButton
            onRefresh={fetchComments}
            loading={commentsLoading}
          />
        </div>
        
        <CommentsList
          comments={comments}
          loading={commentsLoading && comments.length === 0}
          error={commentsError}
          emptyMessage={`ยังไม่มีความคิดเห็นสำหรับโพสต์นี้`}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            ← กลับ
          </button>
          
          <Link
            href={`/posts/${postId}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            📖 ดูโพสต์
          </Link>
        </div>
        
        <div className="flex gap-2">
          {postId > 1 && (
            <Link
              href={`/posts/${postId - 1}/comments`}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              ← โพสต์ก่อนหน้า
            </Link>
          )}
          
          <Link
            href={`/posts/${postId + 1}/comments`}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            โพสต์ถัดไป →
          </Link>
        </div>
        
        <Link
          href="/posts"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          📚 ดูโพสต์ทั้งหมด
        </Link>
      </div>
    </div>
  );
}