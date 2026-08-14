/**
 * AdaptiveEngine.js
 * Gerenciador Interno de Dificuldade, Diagnóstico de Erros e Repetição Espaçada (Leitner System)
 * NÃO ALTERA NENHUM ELEMENTO VISUAL.
 */

const ADAPTIVE_CONFIG = {
  BOX_INTERVALS: [0, 1, 3, 7, 14], // Dias até reapresentar por caixa Leitner
  TIME_THRESHOLD_FAST_MS: 5000,    // Menos de 5s = domínio pleno
  TIME_THRESHOLD_SLOW_MS: 15000   // Mais de 15s = hesitação/dificuldade
};

export class AdaptiveEngine {
  constructor(studentState = {}) {
    // Carrega histórico de itens ou inicializa
    this.history = studentState.history || {}; // { questionId: { box: 1, lastSeen: timestamp, errorCount: 0 } }
  }

  /**
   * Processa a resposta do aluno e ajusta a caixa de memória e pontuação adaptativa
   */
  processAnswer(questionId, isCorrect, responseTimeMs) {
    const now = Date.now();
    let record = this.history[questionId] || { box: 1, lastSeen: now, errorCount: 0, streakCount: 0 };

    record.lastSeen = now;

    if (isCorrect) {
      record.streakCount += 1;
      // Se respondeu rápido e correto, avança de caixa
      if (responseTimeMs < ADAPTIVE_CONFIG.TIME_THRESHOLD_FAST_MS) {
        record.box = Math.min(record.box + 2, 5);
      } else if (responseTimeMs < ADAPTIVE_CONFIG.TIME_THRESHOLD_SLOW_MS) {
        record.box = Math.min(record.box + 1, 5);
      } else {
        // Correto, mas hesitou: mantém na caixa atual para fixar
        record.box = Math.max(record.box, 1);
      }
    } else {
      record.errorCount += 1;
      record.streakCount = 0;
      // Recuo tático: errou, volta para a caixa 1 (necessita revisão imediata)
      record.box = 1;
    }

    this.history[questionId] = record;
    return {
      updatedRecord: record,
      xpMultiplier: this.calculateXpMultiplier(isCorrect, responseTimeMs, record.streakCount)
    };
  }

  /**
   * Recompensa variável baseada na velocidade e precisão (Reforço Intermitente)
   */
  calculateXpMultiplier(isCorrect, responseTimeMs, streakCount) {
    if (!isCorrect) return 1.0;
    
    let multiplier = 1.0;
    if (responseTimeMs < ADAPTIVE_CONFIG.TIME_THRESHOLD_FAST_MS) multiplier += 0.5; // Bônus Agilidade
    if (streakCount >= 3) multiplier += 0.3; // Bônus Combo
    if (streakCount >= 5) multiplier += 0.5; // Bônus Foco Total

    return multiplier;
  }

  /**
   * Filtra e reordena as questões recebidas priorizando as que precisam de revisão espaçada
   */
  prioritizeQuestions(questionList) {
    const now = Date.now();
    const DAY_IN_MS = 86400000;

    return [...questionList].sort((a, b) => {
      const recA = this.history[a.id] || { box: 0, lastSeen: 0 };
      const recB = this.history[b.id] || { box: 0, lastSeen: 0 };

      const intervalA = ADAPTIVE_CONFIG.BOX_INTERVALS[Math.max(0, recA.box - 1)] * DAY_IN_MS;
      const intervalB = ADAPTIVE_CONFIG.BOX_INTERVALS[Math.max(0, recB.box - 1)] * DAY_IN_MS;

      const dueA = (now - recA.lastSeen) >= intervalA;
      const dueB = (now - recB.lastSeen) >= intervalB;

      // Questões vencidas na repetição espaçada têm prioridade total
      if (dueA && !dueB) return -1;
      if (!dueA && dueB) return 1;

      // Se ambas estiverem pendentes, prioriza a de menor caixa (maior fraqueza)
      return recA.box - recB.box;
    });
  }
}
