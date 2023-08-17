import { create } from "zustand"
import { type Session } from "next-auth"
import { User } from "@prisma/client"


interface StoreProps {
    session: Session | null
    user: User | null
    setSession: (session: Session) => void
    setUser: (user: User) => void
}

export const useStore = create<StoreProps>((set) => ({
    session: null,
    user: null,
    setSession: (session: Session) => set({ session }),
    setUser: (user: User) => set({ user })
}))

export default useStore