import { ClipboardPlus, Hourglass, Stethoscope } from "lucide-react";
import { BannerSaudacao } from "@/components/admin/BannerSaudacao";
import { PainelFila } from "@/components/admin/PainelFila";
import { Card } from "@/components/ui/Card";
import { CartaoNumero } from "@/components/ui/CartaoNumero";
import { Rosquinha } from "@/components/ui/Rosquinha";
import { coletasConcluidasMock, doacoesPorTipoMock, filaTriagemMock } from "@/data/mock";

// Cores das fatias: escura, média e clara, todas do vermelho da guia.
const coresDasFatias = [
  "var(--color-vermelho-2)",
  "var(--color-vermelho-1)",
  "color-mix(in srgb, var(--color-vermelho-1) 30%, white)",
];

export default function InicioAdmin() {
  // TODO: trocar os mocks pelas chamadas à API.
  const fila = filaTriagemMock;
  const fatias = doacoesPorTipoMock.map((tipo, i) => ({ ...tipo, cor: coresDasFatias[i] }));

  return (
    // Uma grade de 3 colunas para a página toda: tudo fica alinhado.
    // Banner = 3 colunas. Cartões = 1 coluna cada. Gráfico = 1 coluna. Fila = 2 colunas.
    // Em telas menores (abaixo de xl) o gráfico e a fila ocupam a linha inteira, um embaixo do outro.
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="md:col-span-3">
        <BannerSaudacao nome="Laura" />
      </div>

      <CartaoNumero rotulo="Doadores registrados hoje" valor={64} icone={<ClipboardPlus size={18} />} />
      <CartaoNumero rotulo="Aguardando triagem" valor={fila.length} icone={<Hourglass size={18} />} />
      <CartaoNumero rotulo="Coletas concluídas hoje" valor={35} icone={<Stethoscope size={18} />} />

      {/* flex-col + flex-1: o gráfico fica centralizado na altura do card, mesmo quando ele estica */}
      <Card titulo="Doações da semana" className="flex flex-col md:col-span-3 xl:col-span-1">
        <div className="flex flex-1 items-center justify-center">
          <Rosquinha fatias={fatias} />
        </div>
      </Card>

      <PainelFila fila={fila} concluidas={coletasConcluidasMock} className="md:col-span-3 xl:col-span-2" />
    </div>
  );
}