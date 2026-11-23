"use client";

import { createContext, useContext } from "react";

type RegisterContextValue = {
  openRegister: (id?: string) => void;
};

export const RegisterContext = createContext<RegisterContextValue>({
  openRegister: () => {},
});

export function useRegister() {
  return useContext(RegisterContext);
}
