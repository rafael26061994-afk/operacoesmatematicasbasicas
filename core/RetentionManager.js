/**
 * RetentionManager.js
 * Lógica de Mitigação de Churn, Escudo de Ofensiva e Tolerância de Rotina
 */

export class RetentionManager {
  static STREAK_KEY = 'matematica_app_streak_data';

  static getStreakData() {
    const defaultData = {
      currentStreak: 0,
      lastActiveDate: null,
      freezeAvailable: true,
      rescueSessionAvailable: false
    };
    try {
      const data = localStorage.getItem(this.STREAK_KEY);
      return data ? JSON.parse(data) : defaultData;
    } catch (e) {
      return defaultData;
    }
  }

  /**
   * Avalia o acesso diário aplicando a regra de tolerância flexível (36h)
   */
  static processDailyCheckin() {
    const data = this.getStreakData();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (!data.lastActiveDate) {
      data.currentStreak = 1;
      data.lastActiveDate = todayStr;
      this.saveStreakData(data);
      return { status: 'STARTED', streak: 1 };
    }

    const lastActive = new Date(data.lastActiveDate);
    const diffHours = (now - lastActive) / (1000 * 60 * 60);

    // Mesmo dia: apenas mantém
    if (data.lastActiveDate === todayStr) {
      return { status: 'SAME_DAY', streak: data.currentStreak };
    }

    // Acesso dentro da janela de 36 horas (Tolerância de Rotina)
    if (diffHours <= 36) {
      data.currentStreak += 1;
      data.lastActiveDate = todayStr;
      data.rescueSessionAvailable = false;
      this.saveStreakData(data);
      return { status: 'INCREMENTED', streak: data.currentStreak };
    } 
    
    // Perdeu o dia, mas possui Escudo de Ofensiva (Streak Freeze)
    if (data.freezeAvailable) {
      data.freezeAvailable = false; // Consome escudo silenciosamente
      data.lastActiveDate = todayStr;
      data.currentStreak += 1; // Salva a sequência
      this.saveStreakData(data);
      return { status: 'SAVED_BY_FREEZE', streak: data.currentStreak };
    }

    // Perdeu a sequência: Ativa a Micro-Sessão de Resgate (Permite recuperar o streak se fizer 3 acertos)
    data.rescueSessionAvailable = true;
    data.currentStreak = 0;
    data.lastActiveDate = todayStr;
    this.saveStreakData(data);

    return { status: 'RESCUE_NEEDED', streak: 0 };
  }

  static saveStreakData(data) {
    try {
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Não foi possível salvar streak no localStorage');
    }
  }
}
