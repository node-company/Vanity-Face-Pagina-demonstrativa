import type { LeadFormInput } from "./validators";

/**
 * Calcula o score do lead (0-100) com base nas respostas.
 * Quanto maior, mais quente.
 *
 * Pesos:
 *  - Budget (max 30):      acima_20k=30, 10k_15k=25, 5k_10k=18, 2k_5k=10, avaliando=5
 *  - Timeframe (max 30):   mais_rapido=30, proximos_3=20, pesquisando=8
 *  - Authority (max 25):   apenas_de_mim=25, preciso_alinhar=12, ainda_nao_sei=5
 *  - Procedimento (15):    se escolheu procedimento específico (não "nao_sei"), +15
 *
 *  Total máximo = 100.
 */
export function computeLeadScore(answers: LeadFormInput): number {
  let score = 0;

  switch (answers.budget_range) {
    case "acima_20k":
      score += 30;
      break;
    case "10k_15k":
      score += 25;
      break;
    case "5k_10k":
      score += 18;
      break;
    case "2k_5k":
      score += 10;
      break;
    case "avaliando":
      score += 5;
      break;
  }

  switch (answers.timeframe) {
    case "mais_rapido_possivel":
      score += 30;
      break;
    case "proximos_3_meses":
      score += 20;
      break;
    case "apenas_pesquisando":
      score += 8;
      break;
  }

  switch (answers.decision_authority) {
    case "apenas_de_mim":
      score += 25;
      break;
    case "preciso_alinhar":
      score += 12;
      break;
    case "ainda_nao_sei":
      score += 5;
      break;
  }

  if (answers.procedure_interest !== "nao_sei") {
    score += 15;
  }

  return Math.min(100, score);
}

export type ScoreBand = "hot" | "warm" | "cold";

export function scoreBand(score: number): ScoreBand {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export const SCORE_BAND_LABEL: Record<ScoreBand, string> = {
  hot: "Quente",
  warm: "Morno",
  cold: "Frio",
};
