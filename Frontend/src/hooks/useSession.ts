import { customEncryptedStorage } from "@/src/app/utils/storageUtils"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type SessionStore = {
  isLogged: boolean;
  userId: string;
  email: string;
  role: string;
  name: string;
  token: string;
  refreshToken: string;   // ← novo
  changePassword: boolean;
  currentPassword: string;
  session?: string;
  enterpriseId?: string;
  refresh: boolean;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  setName: (name: string) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void; // ← novo
  setChangePassword: (changePassword: boolean) => void;
  setCurrentPassword: (currentPassword: string) => void;
  setSession: (session: string) => void;
  setEnterpriseId: (enterpriseId: string) => void;
  setRefresh: (refresh: boolean) => void;
  onLogin: () => void;
  onLogout: () => void;
}

const useSession = create(
  persist<SessionStore>(
    (set) => ({
      isLogged: false,
      userId: "",
      email: "",
      role: "",
      name: "",
      token: "",
      refreshToken: "",   // ← novo
      changePassword: false,
      refresh: false,
      currentPassword: "",
      session: "",
      enterpriseId: "",

      setUserId: (userId) => set({ userId }),
      setEmail: (email) => set({ email }),
      setRole: (role) => set({ role }),
      setName: (name) => set({ name }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }), // ← novo
      setChangePassword: (changePassword) => set({ changePassword }),
      setCurrentPassword: (currentPassword) => set({ currentPassword }),
      setSession: (session) => set({ session }),
      setEnterpriseId: (enterpriseId) => set({ enterpriseId }),
      setRefresh: (refresh) => set({ refresh }),

      onLogin: () => set({ isLogged: true }),
      onLogout: () =>
        set({
          isLogged: false,
          userId: "",
          email: "",
          role: "",
          name: "",
          token: "",
          refreshToken: "",  // ← limpar também
          changePassword: false,
          refresh: false,
          currentPassword: "",
          enterpriseId: "",
          session: ""
        }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => customEncryptedStorage),
    }
  )
)

export default useSession
