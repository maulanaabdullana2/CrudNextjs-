"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface IChildren {
  children: React.ReactNode;
}

const Provider = ({ children }: IChildren) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
