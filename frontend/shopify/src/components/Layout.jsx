// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 px-4">{children}</main>
    </>
  );
}
