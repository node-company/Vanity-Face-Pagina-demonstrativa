#!/usr/bin/env node
// Gera o INSERT SQL para criar a primeira conta + admin no Supabase.
//
// Uso:
//   node scripts/create-admin.mjs "Vanity Face — Vitória" "Admin" "admin@vanityface.com" "senhaForte123"

import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const [, , accountName, adminName, email, password] = process.argv;

if (!accountName || !adminName || !email || !password) {
  console.error(
    'Uso: node scripts/create-admin.mjs "Nome da Clinica" "Nome Admin" "email@dominio" "senha"'
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("Senha precisa ter pelo menos 8 caracteres.");
  process.exit(1);
}

const accountId = randomUUID();
const hash = await bcrypt.hash(password, 12);

const sql = `-- Cole este SQL no Supabase SQL Editor e execute.
insert into public.accounts (id, name) values
  ('${accountId}', ${quote(accountName)});

insert into public.account_members (account_id, email, name, password_hash, role) values
  ('${accountId}',
   ${quote(email.toLowerCase())},
   ${quote(adminName)},
   '${hash}',
   'admin');
`;

console.log(sql);

function quote(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}
