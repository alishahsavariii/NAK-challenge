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

interface AuthState {
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterApiData) => Promise<boolean>; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
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
}));