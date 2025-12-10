// /components/Auth.tsx
"use client";

import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import type { User } from "firebase/auth";

export default function Auth({ user }: { user: User | null }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function emailLogin() {
    try { await signInWithEmailAndPassword(auth,email,pass); }
    catch { await createUserWithEmailAndPassword(auth,email,pass); }
  }

  if (user) return (
    <div className="flex justify-between p-2 border-b mb-3">
      <span>Logged in as <b>{user.email}</b></span>
      <button className="text-red-600" onClick={()=>signOut(auth)}>Sign Out</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 border p-3 rounded mb-4">
      <h3 className="font-semibold">Sign-In</h3>

      <input className="border p-2 rounded"
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)} />

      <input className="border p-2 rounded"
        type="password"
        placeholder="Password"
        onChange={e=>setPass(e.target.value)} />

      <button className="bg-blue-600 text-white py-2 rounded" onClick={emailLogin}>Email Login / Register</button>
      <button className="bg-red-500 text-white py-2 rounded" onClick={()=>signInWithPopup(auth,googleProvider)}>Google Login</button>
    </div>
  );
}
