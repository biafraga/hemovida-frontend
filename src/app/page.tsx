"use client";

import { useState } from "react";
import { InputField } from "@/components/form/InputField";
import { Button } from "@/components/ui/Button";

export default function Teste() {
  const [cpf, setCpf] = useState("");
  const erro = cpf.length > 0 && cpf.length < 11 ? "O CPF precisa ter 11 números." : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 px-4">
      <InputField
        label="CPF"
        inputMode="numeric"
        maxLength={11}
        value={cpf}
        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
        erro={erro}
      />
      <InputField label="Data de nascimento" type="date" />
      <InputField label="Senha (tema admin)" tema="admin" type="password" placeholder="Digite a senha" />
      <Button variante="primario">Entrar</Button>
    </main>
  );
}