"use client";

import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-[0.65rem] tracking-[0.24em] uppercase text-cream/55 hover:text-gold transition-colors"
      >
        Sair
      </button>
    </form>
  );
}
