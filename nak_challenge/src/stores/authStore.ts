import { z } from 'zod';
import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerSchema = z.object({
  firstName: z.string().min(1, { message: "errors.nameRequired" }),
  lastName: z.string().min(1, { message: "errors.lastName" }),
  userName: z.string().min(1, { message: "errors.userName" }),
  password: z.string().min(8, { message: "errors.passwordTooShort" }),
  confirmPassword: z.string().min(8, { message: "errors.passwordTooShort" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "errors.passwordsDontMatch",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;


export const loginSchema = z.object({
  userName: z.string().min(1, { message: "errors.userName" }),
  password: z.string().min(1, { message: "errors.passwordRequired" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface AuthState {
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterApiData) => Promise<boolean>;
  login: (data: LoginFormData) => Promise<boolean>;
  userName?: string | null;
  logout: () => void;
  isLoggedIn: boolean;
}


export const useAuthStore = create<AuthState>((set) => {
  //localsg
  const storedUserName = localStorage.getItem('userName');
  const isLoggedIn = storedUserName !== null;

  return {
    isLoading: false,
    error: null,
    isLoggedIn,
    userName: storedUserName,
    register: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'errors.registrationFailed');
        }

        set({ isLoading: false });
        return true;

      } catch (err) {
        set({ isLoading: false, error: err.message });
        return false;
      }
    },
    login: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'errors.loginFailed');
        }

        // add to localsg
        localStorage.setItem('userName', data.userName);
        set({ isLoading: false, userName: data.userName, isLoggedIn: true });
        return true;
      } catch (err) {
        set({ isLoading: false, error: err.message });
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem('userName');
      set({ userName: null, isLoggedIn: false });
    },
  };
});
