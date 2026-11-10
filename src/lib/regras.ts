// Regra RN01 do MS1: só doa quem tem de 18 a 69 anos.
// O backend valida de novo. Aqui é só para avisar antes de enviar.
export const IDADE_MINIMA = 18;
export const IDADE_MAXIMA = 69;

// Recebe "AAAA-MM-DD" e devolve a idade em anos.
export function calcularIdade(nascimento: string, hoje: Date = new Date()): number {
  const [ano, mes, dia] = nascimento.split("-").map(Number);
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario =
    hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

export function idadePermitida(nascimento: string): boolean {
  const idade = calcularIdade(nascimento);
  return idade >= IDADE_MINIMA && idade <= IDADE_MAXIMA;
}