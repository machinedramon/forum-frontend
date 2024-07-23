/* eslint-disable react/no-unescaped-entities */
// app/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return <MainLayout />;
}
