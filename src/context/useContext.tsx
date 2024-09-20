"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "@/@types";
import { LocalStorage } from "@/infra";

type UserContextProviderProps = {
  children: ReactNode | ReactNode[];
};

type UserContextProps = {
  user: User;
  setUser: (newUser: User) => void;
};

const emptyUser: User = {
  id: "",
  email: "",
  name: "",
  openAccessToken: "",
  role: "",
};

export const UserContext = createContext<UserContextProps>({
  user: emptyUser,
  setUser: () => {},
});

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User>(emptyUser);
  const localStorage = new LocalStorage();

  useEffect(() => {
    const handleStorage = async () => {
      const userProfile = (await localStorage.get("userProfile") as User);
      setUser(userProfile);
    };

    handleStorage()
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
