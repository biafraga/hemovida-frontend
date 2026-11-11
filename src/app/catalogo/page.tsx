"use client";

import { CheckCircle2, ClipboardPlus, UserSearch } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { BannerSaudacao } from "@/components/admin/BannerSaudacao";
import { CabecalhoPaciente } from "@/components/admin/CabecalhoPaciente";
import { EditarDoadorModal } from "@/components/admin/EditarDoadorModal";
import { FichaDoador } from "@/components/admin/FichaDoador";
import { PainelFila } from "@/components/admin/PainelFila";
import { InputField } from "@/components/form/InputField";
import { PerguntaSimNao } from "@/components/form/PerguntaSimNao";
import { RadioGroup } from "@/components/form/RadioGroup";
import { SelectField } from "@/components/form/SelectField";
import { Logo } from "@/components/layout/Logo";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CaixaDestaque } from "@/components/ui/CaixaDestaque";
import { Card } from "@/components/ui/Card";
import { CartaoNumero } from "@/components/ui/CartaoNumero";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Rosquinha } from "@/components/ui/Rosquinha";
import { Saudacao } from "@/components/ui/Saudacao";
import { Stepper } from "@/components/ui/Stepper";
import { Table } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { coletasConcluidasMock, doadoresMock, filaTriagemMock } from "@/data/mock";

// CATÁLOGO: página de CONSULTA. Aqui NÃO ficam os componentes (eles ficam em src/components).
// Esta página só mostra cada um funcionando, para o grupo copiar o exemplo.
// Só aparece com "npm run dev". No site publicado, o layout.tsx desta pasta devolve 404.

// ---------- Peças de apresentação do próprio catálogo ----------

function Grupo({ pasta, children }: { pasta: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="border-b-2 border-azul-3 pb-2 pt-6 text-2xl text-azul-1">
        Pasta <code>{pasta}</code>
      </h2>
      {children}
    </div>
  );
}

interface SecaoProps {
  id: string;
  nome: string;
  arquivo: string; // onde o arquivo do componente está
  paraQue: string; // uma frase: quando usar
  children: ReactNode;
}

function Secao({ id, nome, arquivo, paraQue, children }: SecaoProps) {
  return (
    <section id={id} className="rounded-xl bg-card p-6">
      <h3 className="text-xl text-azul-1">{nome}</h3>
      <p className="mt-1">{paraQue}</p>
      <p className="mb-4 mt-1 text-sm text-preto/60">
        Arquivo: <code>{arquivo}</code>
      </p>
      {/* Fundo cinza azulado, igual ao do painel, para os cartões brancos aparecerem direito */}
      <div className="space-y-4 rounded-lg bg-cinza-azulado p-4">{children}</div>
    </section>
  );
}

// ---------- Exemplos que precisam guardar estado ----------

function ExemploTabs() {
  const [aba, setAba] = useState<"a" | "b">("a");
  return (
    <Card>
      <Tabs
        abas={[
          { id: "a", rotulo: "Aguardando triagem" },
          { id: "b", rotulo: "Coletas concluídas" },
        ]}
        ativa={aba}
        aoMudar={setAba}
      />
      <p className="mt-4 text-sm">Aba escolhida: {aba === "a" ? "Aguardando triagem" : "Coletas concluídas"}</p>
    </Card>
  );
}

function ExemploPaginacao() {
  const [pagina, setPagina] = useState(1);
  return (
    <Card>
      <Pagination paginaAtual={pagina} totalPaginas={8} aoMudar={setPagina} />
      <p className="mt-2 text-center text-sm">Página atual: {pagina}</p>
    </Card>
  );
}

function ExemploModal() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Button onClick={() => setAberto(true)}>Abrir o Modal</Button>
      <Modal aberto={aberto} aoFechar={() => setAberto(false)} titulo="Título da janela">
        <p className="mb-6">Aqui dentro vai o conteúdo que você quiser: texto, formulário, tabela.</p>
        <div className="flex justify-end">
          <Button onClick={() => setAberto(false)}>Fechar</Button>
        </div>
      </Modal>
    </>
  );
}

function ExemploConfirmacao() {
  const [aberto, setAberto] = useState(false);
  const [ultimaAcao, setUltimaAcao] = useState("nenhuma");
  return (
    <>
      <Button variante="cancelar" onClick={() => setAberto(true)}>
        Cancelar triagem
      </Button>
      <p className="text-sm">
        Última ação: <strong>{ultimaAcao}</strong>
      </p>
      <ConfirmDialog
        aberto={aberto}
        titulo="Tem certeza que deseja cancelar a triagem?"
        textoConfirmar="Sim, cancelar"
        aoConfirmar={() => {
          setAberto(false);
          setUltimaAcao("confirmou");
        }}
        aoCancelar={() => {
          setAberto(false);
          setUltimaAcao("voltou");
        }}
      />
    </>
  );
}

function ExemploEdicao() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Button variante="voltar" onClick={() => setAberto(true)}>
        Editar dados
      </Button>
      {aberto && (
        <EditarDoadorModal doador={doadoresMock[0].doador} aoSalvar={() => setAberto(false)} aoFechar={() => setAberto(false)} />
      )}
    </>
  );
}

function ExemploRadio() {
  const [genero, setGenero] = useState("Feminino");
  return (
    <Card>
      <RadioGroup label="Gênero" name="genero-catalogo" opcoes={["Feminino", "Masculino", "Outros"]} valor={genero} aoMudar={setGenero} />
    </Card>
  );
}

function ExemploPerguntas() {
  const [respostas, setRespostas] = useState<Record<number, boolean>>({});
  const [verificado, setVerificado] = useState(false);
  const perguntas = [
    "Teve febre, gripe, resfriado ou infecção nos últimos 7 dias?",
    "Fez uso de antibióticos ou anti-inflamatórios nos últimos 15 dias?",
    "Fez tatuagem, maquiagem definitiva ou colocou piercing nos últimos 12 meses?",
  ];
  return (
    <>
      <div className="overflow-hidden rounded-lg">
        {perguntas.map((texto, i) => (
          <PerguntaSimNao
            key={i}
            numero={i + 1}
            texto={texto}
            listrada={i % 2 === 0}
            valor={respostas[i]}
            aoMudar={(resposta) => setRespostas((atuais) => ({ ...atuais, [i]: resposta }))}
            semResposta={verificado && respostas[i] === undefined}
          />
        ))}
      </div>
      <Button tamanho="sm" onClick={() => setVerificado(true)}>
        Verificar respostas
      </Button>
    </>
  );
}

// ---------- A página ----------

export default function Catalogo() {
  const doador = doadoresMock[0].doador;
  const tipoSanguineo = `${doador.doador_tipo_sanguineo}${doador.doador_fator_rh}`;

  return (
    <div className="min-h-screen bg-cinza-azulado px-8 py-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-4xl text-azul-1">Catálogo de componentes</h1>
        <p>
          Esta página é uma <strong>vitrine</strong>: mostra cada componente funcionando. Os componentes de verdade ficam na pasta{" "}
          <code>src/components</code>. Para usar um, copie o exemplo e importe do arquivo indicado.
        </p>

        {/* =============== components/ui =============== */}
        <Grupo pasta="src/components/ui">
          <Secao id="button" nome="Button e ButtonLink" arquivo="src/components/ui/Button.tsx" paraQue="Botões. O Button executa uma ação. O ButtonLink leva para outra página.">
            <div className="flex flex-wrap items-center gap-3">
              <Button variante="primario">primario</Button>
              <Button variante="secundario">secundario</Button>
              <Button variante="cancelar">cancelar</Button>
              <Button variante="voltar">voltar</Button>
              <Button variante="suave">suave</Button>
              <Button disabled>desabilitado</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button tamanho="sm">tamanho sm</Button>
              <Button tamanho="md">tamanho md</Button>
              <Button tamanho="lg">tamanho lg</Button>
              <ButtonLink href="#button">ButtonLink (leva a outra página)</ButtonLink>
            </div>
          </Secao>

          <Secao id="card" nome="Card" arquivo="src/components/ui/Card.tsx" paraQue="A caixa branca de cantos arredondados. É a base de quase tudo (o estilo Bento Box).">
            <Card titulo="Título do card">Conteúdo do card.</Card>
            <Card>Um card sem título.</Card>
          </Secao>

          <Secao id="badge" nome="Badge" arquivo="src/components/ui/Badge.tsx" paraQue="Etiqueta pequena: tipo sanguíneo ou status.">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variante="sangue">A+</Badge>
              <Badge variante="sucesso">Concluído</Badge>
              <Badge variante="erro">Cancelado</Badge>
              <Badge variante="info">Informação</Badge>
            </div>
          </Secao>

          <Secao id="alert" nome="Alert" arquivo="src/components/ui/Alert.tsx" paraQue="Caixa de mensagem de erro ou sucesso. Use no lugar do alert() do navegador.">
            <Alert tipo="erro">O CPF precisa ter 11 números.</Alert>
            <Alert tipo="sucesso">Dados do doador atualizados.</Alert>
          </Secao>

          <Secao id="table" nome="Table" arquivo="src/components/ui/Table.tsx" paraQue="Tabela. Você diz as colunas e os dados, e ela desenha.">
            <Card>
              <Table
                dados={[
                  { nome: "Maria da Silva Santos", tipo: "Sangue total" },
                  { nome: "Eduardo Machado", tipo: "Aférese" },
                ]}
                colunas={[
                  { titulo: "Nome", largura: "60%", render: (linha) => linha.nome },
                  { titulo: "Tipo de doação", largura: "40%", render: (linha) => linha.tipo },
                ]}
              />
            </Card>
          </Secao>

          <Secao id="tabs" nome="Tabs" arquivo="src/components/ui/Tabs.tsx" paraQue="Abas de texto para alternar entre duas listas na mesma tela.">
            <ExemploTabs />
          </Secao>

          <Secao id="pagination" nome="Pagination" arquivo="src/components/ui/Pagination.tsx" paraQue="Os números de página embaixo de uma tabela grande.">
            <ExemploPaginacao />
          </Secao>

          <Secao id="modal" nome="Modal" arquivo="src/components/ui/Modal.tsx" paraQue="Janela por cima da tela, com fundo escurecido. Fecha com o X, a tecla Esc ou clicando fora.">
            <ExemploModal />
          </Secao>

          <Secao id="confirmdialog" nome="ConfirmDialog" arquivo="src/components/ui/ConfirmDialog.tsx" paraQue='Janela de confirmação: "Tem certeza?". Serve para cancelar, excluir, etc.'>
            <ExemploConfirmacao />
          </Secao>

          <Secao id="estadovazio" nome="EstadoVazio" arquivo="src/components/ui/EstadoVazio.tsx" paraQue="Aviso para quando ainda não há nada para mostrar (antes de uma busca, lista vazia).">
            <EstadoVazio
              icone={<UserSearch size={32} />}
              titulo="Nenhum doador selecionado"
              texto="Digite o CPF acima para ver a ficha, o histórico de doações e se o doador já pode doar de novo."
            />
          </Secao>

          <Secao id="stepper" nome="Stepper" arquivo="src/components/ui/Stepper.tsx" paraQue="Os passos de um processo (a triagem). Só mostra, não dá para clicar.">
            <Card>
              <Stepper passos={["Sinais vitais", "Questionário", "Resultado"]} atual={2} />
            </Card>
          </Secao>

          <Secao id="caixadestaque" nome="CaixaDestaque" arquivo="src/components/ui/CaixaDestaque.tsx" paraQue="Caixa colorida que chama atenção para UMA informação importante.">
            <div className="flex flex-wrap items-center gap-4">
              <CaixaDestaque rotulo="Tipo sanguíneo" tom="sangue">
                A+
              </CaixaDestaque>
              <CaixaDestaque rotulo="Estado de aptidão" tom="sucesso" tamanho="medio">
                <CheckCircle2 size={22} /> Apto para coleta
              </CaixaDestaque>
              <CaixaDestaque rotulo="Estado de aptidão" tom="erro" tamanho="medio">
                Inapto
              </CaixaDestaque>
            </div>
          </Secao>

          <Secao id="cartaonumero" nome="CartaoNumero" arquivo="src/components/ui/CartaoNumero.tsx" paraQue="Cartão de indicador: um número grande com o nome do que ele mede.">
            <div className="grid gap-4 sm:grid-cols-2">
              <CartaoNumero rotulo="Doadores registrados hoje" valor={64} icone={<ClipboardPlus size={18} />} />
              <CartaoNumero rotulo="Aguardando triagem" valor={12} icone={<ClipboardPlus size={18} />} />
            </div>
          </Secao>

          <Secao id="rosquinha" nome="Rosquinha" arquivo="src/components/ui/Rosquinha.tsx" paraQue="Gráfico de rosca (pizza com furo). Você passa os valores e as cores.">
            <Card className="max-w-xs">
              <Rosquinha
                fatias={[
                  { nome: "Sangue total", valor: 70, cor: "var(--color-vermelho-2)" },
                  { nome: "Aférese", valor: 20, cor: "var(--color-vermelho-1)" },
                  { nome: "Autóloga", valor: 10, cor: "color-mix(in srgb, var(--color-vermelho-1) 30%, white)" },
                ]}
              />
            </Card>
          </Secao>

          <Secao id="saudacao" nome="Saudacao" arquivo="src/components/ui/Saudacao.tsx" paraQue='"Bom dia, Laura" com a data de hoje. Muda sozinha conforme a hora.'>
            <div className="rounded-xl bg-azul-1 p-6">
              <Saudacao nome="Laura" fundo="escuro" />
            </div>
          </Secao>
        </Grupo>

        {/* =============== components/form =============== */}
        <Grupo pasta="src/components/form">
          <Secao id="inputfield" nome="InputField" arquivo="src/components/form/InputField.tsx" paraQue="Campo de texto com o rótulo em cima e a mensagem de erro embaixo.">
            <Card className="grid gap-4 md:grid-cols-2">
              <InputField label="CPF" placeholder="Somente números" />
              <InputField label="CPF com erro" defaultValue="123" erro="O CPF precisa ter 11 números." />
              <InputField label="Tema do painel (admin)" tema="admin" placeholder="Rótulo em azul" />
              <InputField label="Desabilitado" disabled defaultValue="Não dá para editar" />
            </Card>
          </Secao>

          <Secao id="selectfield" nome="SelectField" arquivo="src/components/form/SelectField.tsx" paraQue="Lista suspensa para escolher uma opção.">
            <Card className="grid gap-4 md:grid-cols-2">
              <SelectField label="Tipo sanguíneo" opcoes={["A", "B", "AB", "O"]} />
              <SelectField label="Tema do painel (admin)" tema="admin" opcoes={["Feminino", "Masculino", "Outros"]} />
            </Card>
          </Secao>

          <Secao id="radiogroup" nome="RadioGroup" arquivo="src/components/form/RadioGroup.tsx" paraQue="Escolher UMA opção entre poucas (gênero, por exemplo).">
            <ExemploRadio />
          </Secao>

          <Secao id="perguntasimnao" nome="PerguntaSimNao" arquivo="src/components/form/PerguntaSimNao.tsx" paraQue="Uma linha do questionário da triagem, com as opções Sim e Não.">
            <ExemploPerguntas />
          </Secao>
        </Grupo>

        {/* =============== components/layout =============== */}
        <Grupo pasta="src/components/layout">
          <Secao id="logo" nome="Logo" arquivo="src/components/layout/Logo.tsx" paraQue="O logotipo do HemoVida. Clicar leva para a página inicial.">
            <Card className="flex flex-wrap items-center gap-8">
              <Logo />
              <Logo className="text-5xl" />
            </Card>
          </Secao>

          <Secao id="sidebar-authsplit" nome="Sidebar e AuthSplit" arquivo="src/components/layout/Sidebar.tsx e AuthSplit.tsx" paraQue="São componentes de página inteira, por isso não aparecem aqui. Veja funcionando nas telas reais.">
            <Card>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Sidebar</strong> (menu lateral): abra <code>/admin</code>
                </li>
                <li>
                  <strong>AuthSplit</strong> (tela dividida de login): abra <code>/doador/login</code> ou <code>/admin/login</code>
                </li>
              </ul>
            </Card>
          </Secao>
        </Grupo>

        {/* =============== components/admin =============== */}
        <Grupo pasta="src/components/admin">
          <Secao id="bannersaudacao" nome="BannerSaudacao" arquivo="src/components/admin/BannerSaudacao.tsx" paraQue="Caixa azul escura do topo da tela de Início, com a saudação e a ilustração.">
            <BannerSaudacao nome="Laura" />
          </Secao>

          <Secao id="fichadoador" nome="FichaDoador" arquivo="src/components/admin/FichaDoador.tsx" paraQue="Todos os dados do doador, na tela de Recepção.">
            <FichaDoador
              doador={doador}
              ultimaDoacao="2026-02-13"
              acoes={
                <>
                  <Button tamanho="sm">Abrir nova doação</Button>
                  <Button variante="voltar" tamanho="sm">
                    Editar dados
                  </Button>
                </>
              }
            />
          </Secao>

          <Secao id="editardoadormodal" nome="EditarDoadorModal" arquivo="src/components/admin/EditarDoadorModal.tsx" paraQue="Janela para a recepção corrigir e-mail, endereço, telefone e gênero do doador.">
            <ExemploEdicao />
          </Secao>

          <Secao id="cabecalhopaciente" nome="CabecalhoPaciente" arquivo="src/components/admin/CabecalhoPaciente.tsx" paraQue="Cartão do topo da Triagem e da Doação: quem é o doador sendo atendido.">
            <CabecalhoPaciente
              doador={doador}
              destaque={
                <CaixaDestaque rotulo="Tipo sanguíneo" tom="sangue">
                  {tipoSanguineo}
                </CaixaDestaque>
              }
            />
            <CabecalhoPaciente
              doador={doador}
              mostrarTipoSanguineo
              destaque={
                <CaixaDestaque rotulo="Estado de aptidão" tom="sucesso" tamanho="medio">
                  <CheckCircle2 size={22} /> Apto para coleta
                </CaixaDestaque>
              }
            />
          </Secao>

          <Secao id="painelfila" nome="PainelFila" arquivo="src/components/admin/PainelFila.tsx" paraQue="Painel com as abas Aguardando triagem e Coletas concluídas, pesquisa e paginação.">
            <PainelFila fila={filaTriagemMock} concluidas={coletasConcluidasMock} />
          </Secao>
        </Grupo>
      </div>
    </div>
  );
}