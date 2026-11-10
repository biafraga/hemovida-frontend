import type { ButtonHTMLAttributes } from "react";

// Os nomes dizem o que o botão FAZ, não a cor.
//   primario   = ação principal do portal do doador (vermelho)
//   secundario = ação principal do painel (azul escuro)
//   cancelar   = contorno vermelho (Cancelar, Cancelar triagem)
//   voltar     = contorno azul (Voltar)
//   suave      = azul clarinho (Cadastrar novo doador)
export type VarianteBotao = "primario" | "secundario" | "cancelar" | "voltar" | "suave";

const estiloBase =
  "inline-flex items-center justify-center rounded-md font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const estiloPorVariante: Record<VarianteBotao, string> = {
  primario: "bg-vermelho-1 text-branco hover:bg-vermelho-2",
  secundario: "bg-azul-1 text-branco hover:bg-azul-2",
  cancelar: "border border-vermelho-1 bg-branco text-vermelho-1 hover:bg-vermelho-1 hover:text-branco",
  voltar: "border border-azul-1 bg-branco text-azul-1 hover:bg-azul-1 hover:text-branco",
  suave: "bg-azul-3 text-azul-1 hover:brightness-95",
};

const estiloPorTamanho = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-6 py-3 text-base",
  lg: "px-10 py-5 text-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  tamanho?: keyof typeof estiloPorTamanho;
  larguraTotal?: boolean;
}

export function Button({
  variante = "secundario",
  tamanho = "md",
  larguraTotal = false,
  className = "",
  ...resto
}: ButtonProps) {
  return (
    <button
      className={`${estiloBase} ${estiloPorVariante[variante]} ${estiloPorTamanho[tamanho]} ${
        larguraTotal ? "w-full" : ""
      } ${className}`}
      {...resto}
    />
  );
}