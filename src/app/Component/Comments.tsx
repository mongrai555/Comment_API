import React from 'react';
import { Comment } from '@/services/api';

// 💬 Props Interface for Comment Component
interface CommentItemProps {
  comment: Comment;
  showPostId?: boolean;
  className?: string;
}

// 🎨 Individual Comment Component
export const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  showPostId = false,
  className = "" 
}) => {
  return (
    <div className={`border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 truncate">
          {comment.name}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {showPostId && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Post: {comment.postId}
            </span>
          )}
          <span>ID: {comment.id}</span>
        </div>
      </div>
      
      <p className="text-sm text-blue-600 mb-2 truncate">
        📧 {comment.email}
      </p>
      
      <p className="text-gray-700 leading-relaxed">
        {comment.body}
      </p>
    </div>
  );
};

// 📝 Props Interface for Comments List Component
interface CommentsListProps {
  comments: Comment[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showPostId?: boolean;
  className?: string;
}

// 📄 Comments List Component
export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  loading = false,
  error = null,
  emptyMessage = "ยังไม่มีความคิดเห็น",
  showPostId = false,
  className = ""
}) => {
  // Loading State
  if (loading) {
    return (
      <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
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
        <p className="text-center text-gray-500 mt-4">กำลังโหลดความคิดเห็น...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">เกิดข้อผิดพลาด</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        💬 ความคิดเห็น ({comments.length} รายการ)
      </h2>

      {/* Empty State */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💭</div>
          <p className="text-gray-500 italic">{emptyMessage}</p>
        </div>
      ) : (
        /* Comments List */
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              showPostId={showPostId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 📊 Props Interface for Comments Stats Component
interface CommentsStatsProps {
  totalComments: number;
  postId?: number;
  className?: string;
}

// 📈 Comments Statistics Component
export const CommentsStats: React.FC<CommentsStatsProps> = ({
  totalComments,
  postId,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="font-semibold text-gray-800">สถิติความคิดเห็น</h3>
            {postId && (
              <p className="text-sm text-gray-600">สำหรับโพสต์ ID: {postId}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalComments}</div>
          <div className="text-sm text-gray-500">ความคิดเห็น</div>
        </div>
      </div>
    </div>
  );
};

// 🔄 Props Interface for Refresh Button Component
interface RefreshButtonProps {
  onRefresh: () => void;
  loading?: boolean;
  className?: string;
}

// 🔄 Refresh Comments Button Component
export const RefreshCommentsButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  className = ""
}) => {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className={`
        flex items-center space-x-2 px-4 py-2 
        bg-green-500 hover:bg-green-600 disabled:bg-gray-400
        text-white font-medium rounded-lg
        transition-colors duration-200
        ${className}
      `}
    >
      <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>
        🔄
      </span>
      <span>{loading ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
    </button>
  );
};

// 📱 Export all components
export default {
  CommentItem,
  CommentsList,
  CommentsStats,
  RefreshCommentsButton,
};