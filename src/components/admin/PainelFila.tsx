"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import type { Coluna } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import type { ColetaConcluida, PacienteNaFila } from "@/data/mock";

const POR_PAGINA = 5;

type IdAba = "fila" | "concluidas";

const abas: { id: IdAba; rotulo: string }[] = [
  { id: "fila", rotulo: "Aguardando triagem" },
  { id: "concluidas", rotulo: "Coletas concluídas" },
];

const colunasFila: Coluna<PacienteNaFila>[] = [
  { titulo: "Nome", largura: "22%", render: (p) => p.nome },
  { titulo: "CPF", largura: "20%", render: (p) => <span className="whitespace-nowrap">{p.cpf}</span> },
  { titulo: "Tipo de doação", largura: "16%", render: (p) => p.tipoDoacao },
  { titulo: "Tipo sanguíneo", largura: "14%", render: (p) => <Badge variante="sangue">{p.tipoSanguineo}</Badge> },
  {
    titulo: "Ações",
    largura: "28%",
    render: () => (
      <span className="flex items-center gap-2">
        <ButtonLink href="/admin/triagem" tamanho="sm">
          Iniciar triagem
        </ButtonLink>
        {/* Só o X para economizar espaço. O aria-label e o title explicam o que ele faz. */}
        <Button variante="cancelar" tamanho="sm" aria-label="Cancelar" title="Cancelar">
          <X size={14} />
        </Button>
      </span>
    ),
  },
];

const colunasConcluidas: Coluna<ColetaConcluida>[] = [
  { titulo: "Nome", largura: "17%", render: (c) => c.nome },
  { titulo: "CPF", largura: "13%", render: (c) => <span className="whitespace-nowrap">{c.cpf}</span> },
  { titulo: "Vol. coletado", largura: "10%", render: (c) => `${c.volumeMl} mL` },
  { titulo: "Tipo sanguíneo", largura: "10%", render: (c) => <Badge variante="sangue">{c.tipoSanguineo}</Badge> },
  { titulo: "Tipo de doação", largura: "12%", render: (c) => c.tipoDoacao },
  { titulo: "Data e hora", largura: "13%", render: (c) => c.dataHora },
  { titulo: "Código da bolsa", largura: "16%", render: (c) => <span className="whitespace-nowrap">{c.codigoBolsa}</span> },
  { titulo: "Status", largura: "9%", render: () => <Badge variante="sucesso">Concluído</Badge> },
];

// Tira acento e maiúscula: "José" e "jose" ficam iguais na busca.
const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const soDigitos = (texto: string) => texto.replace(/\D/g, "");

// A busca vale para o nome (com ou sem acento) e para o CPF (com ou sem pontos).
function combinaComBusca(nome: string, cpf: string, termo: string): boolean {
  const procurado = termo.trim();
  if (!procurado) return true;
  const digitos = soDigitos(procurado);
  return normalizar(nome).includes(normalizar(procurado)) || (digitos.length > 0 && soDigitos(cpf).includes(digitos));
}

// Pega só os itens da página atual. Página 2 com 5 por página = itens 6 a 10.
function fatiar<T>(lista: T[], pagina: number): T[] {
  const inicio = (pagina - 1) * POR_PAGINA;
  return lista.slice(inicio, inicio + POR_PAGINA);
}

interface PainelFilaProps {
  fila: PacienteNaFila[];
  concluidas: ColetaConcluida[];
  className?: string;
}

export function PainelFila({ fila, concluidas, className = "" }: PainelFilaProps) {
  const [aba, setAba] = useState<IdAba>("fila");
  const [pagina, setPagina] = useState(1);
  const [buscando, setBuscando] = useState(false);
  const [termo, setTermo] = useState("");

  // Sempre que muda a aba ou a busca, volta para a página 1.
  function trocarAba(nova: IdAba) {
    setAba(nova);
    setPagina(1);
  }
  function digitarBusca(valor: string) {
    setTermo(valor);
    setPagina(1);
  }
  function alternarBusca() {
    if (buscando) digitarBusca(""); // ao fechar, limpa a busca
    setBuscando(!buscando);
  }

  const filaFiltrada = fila.filter((p) => combinaComBusca(p.nome, p.cpf, termo));
  const concluidasFiltradas = concluidas.filter((c) => combinaComBusca(c.nome, c.cpf, termo));

  const total = aba === "fila" ? filaFiltrada.length : concluidasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const textoVazio = termo.trim()
    ? "Nenhum resultado para a busca."
    : aba === "fila"
      ? "Ninguém aguardando triagem agora."
      : "Nenhuma coleta concluída ainda.";

  return (
    <Card className={`min-w-0 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Tabs abas={abas} ativa={aba} aoMudar={trocarAba} />

        <div className="flex items-center gap-2">
          {buscando && (
            <input
              autoFocus
              aria-label="Pesquisar por nome ou CPF"
              placeholder="Nome ou CPF"
              value={termo}
              onChange={(e) => digitarBusca(e.target.value)}
              className="w-56 rounded-lg border border-preto bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-azul-3"
            />
          )}
          <button
            aria-label={buscando ? "Fechar pesquisa" : "Pesquisar"}
            onClick={alternarBusca}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-azul-3 text-azul-1 transition hover:brightness-95"
          >
            {buscando ? <X size={16} /> : <Search size={16} />}
          </button>
        </div>
      </div>

      {aba === "fila" ? (
        <Table colunas={colunasFila} dados={fatiar(filaFiltrada, pagina)} vazio={textoVazio} />
      ) : (
        <Table
          colunas={colunasConcluidas}
          dados={fatiar(concluidasFiltradas, pagina)}
          vazio={textoVazio}
          larguraMinima="min-w-[1000px]"
        />
      )}

      <Pagination paginaAtual={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
    </Card>
  );
}