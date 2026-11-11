import { notFound } from "next/navigation";

// O catálogo é uma ferramenta do grupo, não faz parte do sistema.
// No site publicado (produção) ele não existe: quem tentar abrir /catalogo vê "página não encontrada".
export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}