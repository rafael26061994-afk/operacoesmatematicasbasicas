# Justificativa Técnica e Planejamento Estratégico — Engajamento e Retenção (V3.4)

## 1. Avaliação Técnica Geral

### **Nota Técnica: 6,8 / 10**

### Resumo Diagnóstico
O projeto possui uma base arquitetural e pedagógica sólida, com boa integração com Supabase, painéis de acompanhamento e uma estrutura de exercícios alinhada ao currículo do 6º ao 9º ano. 

No entanto, do ponto de vista de **psicologia do engajamento, design de jogos educacionais e retenção diária**, o aplicativo opera como um *livro de exercícios digitalizado*, apresentando fricções que resultam em *churn* (abandono de usuários) por fadiga e desmotivação.

---

## 2. Diagnóstico de Gargalos Críticos

1. **Atrito de Entrada e Curva de Cansaço:**
   * Exigência de sessões extensas para validação da meta diária.
   * Estudantes com pouco tempo livre evitam abrir o aplicativo por receio de não concluir o bloco.
2. **Lógica Punitiva de Churn no Streak:**
   * A perda abrupta da sequência de dias gera desapego psicológico no público de 11 a 15 anos.
   * Ausência de mecanismos de proteção (*Streak Freeze*) ou recuperação (*Sessão de Resgate*).
3. **Ausência de Curva de Esquecimento (Spaced Repetition System - SRS):**
   * Questões com alto nível de domínio reaparecem com a mesma frequência que tópicos com fragilidade.
   * Causa tédio em itens fáceis e frustração em itens complexos.
4. **Feedback Reativo em Vez de Diagnóstico Tático:**
   * O erro é tratado apenas como penalidade numérica, sem micro-aprendizagem imediata ou dicas graduais.
5. **Recompensas Previsíveis:**
   * Ganho de XP estático e determinístico, ignorando princípios de reforço intermitente (combos, velocidade e acurácia).

---

## 3. Matriz de Priorização de Melhorias

| Problema Identificado | Melhoria Sugerida | Impacto no Engajamento | Impacto na Aprendizagem | Dificuldade |
| :--- | :--- | :--- | :--- | :--- |
| **Punição severa por dia perdido** | Implementar *Escudo de Ofensiva* e *Sessão de Resgate* | **Extremo** (reduz churn) | **Médio** | **Baixa** |
| **Sessões longas e rígidas** | Algoritmo de *Micro-Sessões Dinâmicas* (3 a 5 acertos) | **Alto** | **Alto** (consistência diária) | **Baixa** |
| **Progressão estática sem espaçamento** | Motor Interno de Repetição Espaçada (*Leitner System*) | **Alto** | **Extremo** (fixação a longo prazo) | **Média** |
| **Análise simplista do erro** | Dicas graduais e classificação por tempo de resposta | **Médio** | **Extremo** | **Média** |
| **Recompensa previsível de XP** | Sistema de *XP Variável + Bônus de Combo e Agilidade* | **Alto** | **Médio** | **Baixa** |

---

## 4. Análise Estratégica: Duolingo + A Arte da Guerra

### Estrutura de Engajamento
```text
                  ┌─────────────────────────────────────────┐
                  │    ESTRUTURA DE ENGAJAMENTO E RETENÇÃO  │
                  └────────────────────┬────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌──────────────────────────────┐                             ┌──────────────────────────────┐
│     ESTRATÉGIAS DUOLINGO     │                             │      A ARTE DA GUERRA        │
├──────────────────────────────┤                             ├──────────────────────────────┤
│ • Sensação diária de progresso│                             │ • "Conheça seu inimigo"      │
│ • Menor fricção inicial      │                             │   (Diagnóstico de erros)     │
│ • Preservação de Streak      │                             │ • "Evite o forte, ataque    │
│ • Feedback instantâneo       │                             │    o fraco" (Adaptação)     │
└──────────────────────────────┘                             └──────────────────────────────┘
