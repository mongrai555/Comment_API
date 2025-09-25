"use client";

import { usePosts } from "@/store/posts";
import { useEffect } from "react";

export default function Page() {
  const { items, loading, error, fetchData } = usePosts();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>ผิดพลาด: {error}</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {items.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}