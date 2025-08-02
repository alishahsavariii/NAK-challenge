import { z } from 'zod';
import { create } from 'zustand';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'errors.nameRequired' }),
  email: z.string().email({ message: 'errors.invalidEmail' }),
  password: z.string().min(8, { message: 'errors.passwordTooShort' }),
  lastName : z.string().min(1, { message: 'errors.lastName' }),
  
});

// Infer the TypeScript type from the schema
export type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthState {
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterFormData) => Promise<boolean>; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/users/register', { 
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

    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },
}));