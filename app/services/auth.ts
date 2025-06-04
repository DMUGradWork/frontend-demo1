// API 서비스 - 스프링 백엔드 엔드포인트에 맞춰 수정
const API_BASE_URL = 'http://localhost:8080';

export const apiService = {
  // 회원가입 - UserController의 createUser 엔드포인트
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  },
  
  // 사용자 조회 - UserController의 retrieveUser 엔드포인트
  getUserById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/users/${id}`);
      if (!response.ok) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('사용자 정보를 가져오는 중 오류가 발생했습니다.');
    }
  },
  
  // 모든 사용자 조회 - UserController의 retrieveAllUsers 엔드포인트
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/users`);
      if (!response.ok) {
        throw new Error('사용자 목록을 가져오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('사용자 목록을 가져오는 중 오류가 발생했습니다.');
    }
  },
  
  // 로그인 (추후 인증 컨트롤러에서 구현될 예정)
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  },

  findUserByEmail: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/find-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이메일 찾기에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('이메일 찾기 중 오류가 발생했습니다.');
    }
  },
}; 