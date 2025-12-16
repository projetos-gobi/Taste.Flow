"use client";

import { ReactNode } from "react";
import { useTokenRefresh } from "../hooks/use-auth";


export default function ClientProvider({ children }: { children: ReactNode }) {

  useTokenRefresh();

  return <>{children}</>;
}
