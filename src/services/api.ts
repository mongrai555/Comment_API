import axios from "axios";

// 🌐 Base API Configuration
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// 📝 Type Definitions
export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

// 🔧 API Service Class
export class ApiService {
  private static instance: ApiService;
  
  // Singleton pattern
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private constructor() {
    // Configure axios defaults
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = 10000; // 10 seconds timeout
  }

  // 📚 Posts API Methods
  
  /**
   * ดึงโพสต์ทั้งหมด
   * GET /posts
   */
  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await axios.get<Post[]>("/posts");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch posts");
    }
  }

  /**
   * ดึงโพสต์ตาม ID
   * GET /posts/{id}
   */
  async getPostById(id: number): Promise<Post> {
    try {
      const response = await axios.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch post with ID: ${id}`);
    }
  }

  /**
   * สร้างโพสต์ใหม่
   * POST /posts
   */
  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const response = await axios.post<Post>("/posts", post);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create post");
    }
  }

  // 💬 Comments API Methods
  
  /**
   * ดึงคอมเมนต์ทั้งหมด
   * GET /comments
   */
  async getAllComments(): Promise<Comment[]> {
    try {
      const response = await axios.get<Comment[]>("/comments");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch comments");
    }
  }

  /**
   * ดึงคอมเมนต์ตาม Post ID
   * GET /posts/{postId}/comments
   */
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    try {
      const response = await axios.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch comments for post ID: ${postId}`);
    }
  }

  /**
   * สร้างคอมเมนต์ใหม่
   * POST /comments
   */
  async createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    try {
      const response = await axios.post<Comment>("/comments", comment);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create comment");
    }
  }

  // 👥 Users API Methods
  
  /**
   * ดึงผู้ใช้ทั้งหมด
   * GET /users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get<User[]>("/users");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch users");
    }
  }

  /**
   * ดึงผู้ใช้ตาม ID
   * GET /users/{id}
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch user with ID: ${id}`);
    }
  }

  // 🛠️ Utility Methods
  
  /**
   * จัดการ Error และแปลงเป็น readable message
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        return new Error(`HTTP ${status}: ${message}`);
      } else if (error.request) {
        // Request was made but no response received
        return new Error("Network error: No response from server");
      }
    }
    
    // Other errors
    return new Error(
      error instanceof Error ? error.message : defaultMessage
    );
  }

  /**
   * ตรวจสอบการเชื่อมต่อ API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await axios.get("/posts/1");
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 🎯 Export singleton instance
export const apiService = ApiService.getInstance();

// 📦 Export convenience functions for common operations
export const postsApi = {
  getAll: () => apiService.getAllPosts(),
  getById: (id: number) => apiService.getPostById(id),
  create: (post: Omit<Post, 'id'>) => apiService.createPost(post),
};

export const commentsApi = {
  getAll: () => apiService.getAllComments(),
  getByPostId: (postId: number) => apiService.getCommentsByPostId(postId),
  create: (comment: Omit<Comment, 'id'>) => apiService.createComment(comment),
};

export const usersApi = {
  getAll: () => apiService.getAllUsers(),
  getById: (id: number) => apiService.getUserById(id),
};