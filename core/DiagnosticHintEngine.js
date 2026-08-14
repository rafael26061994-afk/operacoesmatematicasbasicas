/**
 * DiagnosticHintEngine.js
 * Analisa o comportamento do erro do estudante e retorna micro-feedback tático.
 * NÃO altera o layout visual existente.
 */

export class DiagnosticHintEngine {
  /**
   * Analisa a tentativa incorreta e classifica o erro
   * @param {number} responseTimeMs - Tempo gasto na questão
   * @param {object} questionData - Dados da questão (pode conter dicas cadastradas)
   * @param {number} attemptCount - Número da tentativa atual nesta questão
   */
  static processError(responseTimeMs, questionData = {}, attemptCount = 1) {
    // 1. Erro por Impulsividade (Chute rápido / Falta de atenção)
    if (responseTimeMs < 3000) {
      return {
        errorType: 'IMPULSIVITY',
        message: '⚡ Vá com calma! Leia o enunciado com atenção antes de responder.',
        allowRetry: true,
        penaltyXP: 0
      };
    }

    // 2. Primeiro Erro Conceitual (Dica Leve)
    if (attemptCount === 1) {
      return {
        errorType: 'CONCEPT_LIGHT',
        message: questionData.hintLight || '💡 Dica: Revise a regra principal desta operação antes de calcular.',
        allowRetry: true,
        penaltyXP: 0.1
      };
    }

    // 3. Segundo Erro Consecutivo (Dica Detalhada / Passo a Passo)
    return {
      errorType: 'CONCEPT_DETAILED',
      message: questionData.hintDetailed || '🧩 Dica de apoio: Tente resolver primeiro a operação do lado esquerdo.',
      allowRetry: false,
      penaltyXP: 0.2
    };
  }
}
