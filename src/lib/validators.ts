import { z } from "zod";

// ---- Opções enumeradas das perguntas 3-7 (devem casar com o que aparece na UI) ----

export const AREA_CONCERN_OPTIONS = [
  "papada_gordura",
  "flacidez_excesso_pele",
  "olhar_cansado",
  "rugas_marcas_expressao",
  "outro",
] as const;

export const PROCEDURE_OPTIONS = [
  "lipo_papada",
  "palpebra",
  "facelift",
  "bioestimulador",
  "nao_sei",
] as const;

export const BUDGET_OPTIONS = [
  "2k_5k",
  "5k_10k",
  "10k_15k",
  "acima_20k",
  "avaliando",
] as const;

export const TIMEFRAME_OPTIONS = [
  "mais_rapido_possivel",
  "proximos_3_meses",
  "apenas_pesquisando",
] as const;

export const AUTHORITY_OPTIONS = [
  "apenas_de_mim",
  "preciso_alinhar",
  "ainda_nao_sei",
] as const;

// ---- Labels visíveis (para UI e CRM) ----

export const AREA_CONCERN_LABELS: Record<(typeof AREA_CONCERN_OPTIONS)[number], string> = {
  papada_gordura: "Papada e acúmulo de gordura",
  flacidez_excesso_pele: "Flacidez / excesso de pele",
  olhar_cansado: "Olhar cansado / envelhecido",
  rugas_marcas_expressao: "Rugas e marcas de expressão",
  outro: "Outro",
};

export const PROCEDURE_LABELS: Record<(typeof PROCEDURE_OPTIONS)[number], string> = {
  lipo_papada: "Lipo de papada",
  palpebra: "Pálpebra",
  facelift: "Facelift / Rejuvenescimento facial",
  bioestimulador: "Bioestimulador / Preenchimento",
  nao_sei: "Ainda não sei qual é o ideal",
};

export const BUDGET_LABELS: Record<(typeof BUDGET_OPTIONS)[number], string> = {
  "2k_5k": "R$ 2.000 a R$ 5.000",
  "5k_10k": "R$ 5.000 a R$ 10.000",
  "10k_15k": "R$ 10.000 a R$ 15.000",
  acima_20k: "Acima de R$ 20.000",
  avaliando: "Estou avaliando",
};

export const TIMEFRAME_LABELS: Record<(typeof TIMEFRAME_OPTIONS)[number], string> = {
  mais_rapido_possivel: "O mais rápido possível",
  proximos_3_meses: "Nos próximos 3 meses",
  apenas_pesquisando: "Apenas pesquisando por enquanto",
};

export const AUTHORITY_LABELS: Record<(typeof AUTHORITY_OPTIONS)[number], string> = {
  apenas_de_mim: "Apenas de mim",
  preciso_alinhar: "Preciso alinhar com outra pessoa",
  ainda_nao_sei: "Ainda não sei",
};

// ---- WhatsApp brasileiro (mobile com 9): (DD) 9 XXXX-XXXX ----

/** Lista de DDDs brasileiros válidos. */
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/**
 * Extrai os 11 dígitos do mobile BR a partir de qualquer entrada.
 * Aceita: "(27) 9 9946-5417", "27999465417", "+55 27 99946-5417".
 * Retorna string com 11 dígitos ou string parcial (pra usar enquanto digita).
 */
export function digitsOnlyBrMobile(raw: string): string {
  let d = raw.replace(/\D/g, "");
  // Remove código do país se vier "55..."
  if (d.length === 13 && d.startsWith("55")) d = d.slice(2);
  return d.slice(0, 11);
}

/** Valida WhatsApp BR mobile estrito: 11 dígitos, DDD válido, terceiro dígito = 9. */
export function isValidBrMobile(raw: string): boolean {
  const d = digitsOnlyBrMobile(raw);
  if (d.length !== 11) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  if (!VALID_DDDS.has(ddd)) return false;
  if (d[2] !== "9") return false;
  // Não pode ser sequência inteira igual (00000000000)
  if (/^(\d)\1+$/.test(d)) return false;
  return true;
}

/** Formata progressivamente como `(DD) 9 XXXX-XXXX`. */
export function formatBrMobile(raw: string): string {
  const d = digitsOnlyBrMobile(raw);
  if (d.length === 0) return "";
  if (d.length === 1) return `(${d}`;
  if (d.length === 2) return `(${d}) `;
  if (d.length === 3) return `(${d.slice(0, 2)}) ${d[2]}`;
  const ddd = d.slice(0, 2);
  const nine = d[2];
  const rest = d.slice(3);
  if (rest.length <= 4) return `(${ddd}) ${nine} ${rest}`;
  return `(${ddd}) ${nine} ${rest.slice(0, 4)}-${rest.slice(4)}`;
}

// ---- Schema zod do formulário público ----

export const LeadFormSchema = z
  .object({
    name: z.string().trim().min(2, "Conte-nos seu nome (mínimo 2 letras)."),
    whatsapp: z
      .string()
      .trim()
      .refine(isValidBrMobile, {
        message: "Informe um WhatsApp brasileiro válido — formato (DD) 9 XXXX-XXXX.",
      }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Informe seu e-mail.")
      .email("E-mail inválido — confira a digitação."),
    area_concern: z.enum(AREA_CONCERN_OPTIONS),
    area_concern_other: z.string().trim().max(160).optional(),
    procedure_interest: z.enum(PROCEDURE_OPTIONS),
    budget_range: z.enum(BUDGET_OPTIONS),
    timeframe: z.enum(TIMEFRAME_OPTIONS),
    decision_authority: z.enum(AUTHORITY_OPTIONS),
  })
  .refine(
    (v) => v.area_concern !== "outro" || (v.area_concern_other && v.area_concern_other.length >= 2),
    {
      message: "Conte um pouco sobre a área que mais te incomoda.",
      path: ["area_concern_other"],
    }
  );

export type LeadFormInput = z.infer<typeof LeadFormSchema>;

// ---- Login do CRM ----
export const LoginSchema = z.object({
  email: z.string().trim().email("E-mail inválido.").toLowerCase(),
  password: z.string().min(1, "Informe a senha."),
});
export type LoginInput = z.infer<typeof LoginSchema>;
