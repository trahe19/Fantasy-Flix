// Live scoring system for Fantasy Flix
export interface MoviePerformance {
  movieId: number;
  title: string;
  releaseDate: string;
  currentBoxOffice: number;
  weeklyBoxOffice: number[];
  criticsScore: number;
  audienceScore: number;
  lastUpdated: string;
}

export interface WeeklyScore {
  week: number;
  startDate: string;
  endDate: string;
  boxOfficePoints: number;
  bonusPoints: number;
  totalPoints: number;
  rank: number;
  percentileRank: number;
}

export interface PlayerScore {
  userId: string;
  username: string;
  leagueId: string;
  currentWeek: number;
  totalScore: number;
  weeklyScores: WeeklyScore[];
  roster: {
    movieId: number;
    movieTitle: string;
    position: string;
    acquisitionCost: number;
    currentValue: number;
    weeklyPerformance: number[];
  }[];
  stats: {
    bestWeek: number;
    worstWeek: number;
    avgWeeklyScore: number;
    totalBoxOffice: number;
    rosterValue: number;
    roi: number; // Return on investment
  };
}

export interface LeagueStandings {
  leagueId: string;
  leagueName: string;
  currentWeek: number;
  season: string;
  standings: {
    rank: number;
    userId: string;
    username: string;
    totalPoints: number;
    weeklyAvg: number;
    lastWeekRank: number;
    trend: 'up' | 'down' | 'same';
    gamesBack: number;
  }[];
  weeklyWinners: {
    week: number;
    userId: string;
    username: string;
    points: number;
  }[];
}

// Scoring calculation functions
export class ScoringEngine {
  // Calculate box office points based on league rules
  static calculateBoxOfficePoints(
    boxOfficeEarnings: number,
    acquisitionCost: number,
    leagueSettings: {
      baseMultiplier: number;
      profitBonus: number;
      popularityThreshold: number;
    }
  ): number {
    const profit = Math.max(0, boxOfficeEarnings - acquisitionCost);
    const basePoints = boxOfficeEarnings * leagueSettings.baseMultiplier;
    const profitPoints = profit * leagueSettings.profitBonus;
    
    // Bonus for blockbuster performance
    const blockbusterBonus = boxOfficeEarnings > leagueSettings.popularityThreshold ? 
      boxOfficeEarnings * 0.1 : 0;
    
    return Math.round(basePoints + profitPoints + blockbusterBonus);
  }

  // Calculate weekly performance score
  static calculateWeeklyScore(
    roster: PlayerScore['roster'],
    moviePerformances: MoviePerformance[],
    week: number
  ): WeeklyScore {
    let totalBoxOfficePoints = 0;
    let bonusPoints = 0;

    roster.forEach(movie => {
      const performance = moviePerformances.find(p => p.movieId === movie.movieId);
      if (performance && performance.weeklyBoxOffice[week - 1]) {
        const weeklyEarnings = performance.weeklyBoxOffice[week - 1];
        const points = this.calculateBoxOfficePoints(
          weeklyEarnings,
          movie.acquisitionCost,
          {
            baseMultiplier: 0.001, // $1M = 1000 points
            profitBonus: 0.002,
            popularityThreshold: 50000000 // $50M threshold
          }
        );
        totalBoxOfficePoints += points;

        // Bonus points for critics/audience scores
        if (performance.criticsScore >= 80) bonusPoints += 500;
        if (performance.audienceScore >= 85) bonusPoints += 300;
      }
    });

    return {
      week,
      startDate: '', // Would be calculated based on week
      endDate: '',
      boxOfficePoints: totalBoxOfficePoints,
      bonusPoints,
      totalPoints: totalBoxOfficePoints + bonusPoints,
      rank: 0, // Calculated after all players
      percentileRank: 0
    };
  }

  // Update league standings
  static calculateStandings(playerScores: PlayerScore[]): LeagueStandings['standings'] {
    return playerScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({
        rank: index + 1,
        userId: player.userId,
        username: player.username,
        totalPoints: player.totalScore,
        weeklyAvg: player.stats.avgWeeklyScore,
        lastWeekRank: 0, // Would need historical data
        trend: 'same' as const, // Would be calculated
        gamesBack: index === 0 ? 0 : playerScores[0].totalScore - player.totalScore
      }));
  }
}

// Mock data generators for development
export const generateMockMoviePerformance = (): MoviePerformance[] => [
  {
    movieId: 900001,
    title: "Avatar: Fire and Ash",
    releaseDate: "2025-12-19",
    currentBoxOffice: 287000000,
    weeklyBoxOffice: [89000000, 67000000, 45000000, 32000000, 25000000, 18000000, 11000000],
    criticsScore: 85,
    audienceScore: 92,
    lastUpdated: new Date().toISOString()
  },
  {
    movieId: 900002,
    title: "Fantastic Four: First Steps",
    releaseDate: "2025-05-02",
    currentBoxOffice: 156000000,
    weeklyBoxOffice: [52000000, 34000000, 28000000, 21000000, 14000000, 7000000],
    criticsScore: 78,
    audienceScore: 88,
    lastUpdated: new Date().toISOString()
  }
];

export const generateMockPlayerScore = (userId: string, username: string): PlayerScore => ({
  userId,
  username,
  leagueId: 'league1',
  currentWeek: 8,
  totalScore: 298000,
  weeklyScores: [
    { week: 1, startDate: '2025-01-01', endDate: '2025-01-07', boxOfficePoints: 25000, bonusPoints: 0, totalPoints: 25000, rank: 3, percentileRank: 70 },
    { week: 2, startDate: '2025-01-08', endDate: '2025-01-14', boxOfficePoints: 35000, bonusPoints: 800, totalPoints: 35800, rank: 2, percentileRank: 85 },
    // ... more weeks
  ],
  roster: [
    {
      movieId: 900001,
      movieTitle: "Avatar: Fire and Ash",
      position: "Blockbuster",
      acquisitionCost: 250000,
      currentValue: 287000,
      weeklyPerformance: [89000, 67000, 45000, 32000, 25000, 18000, 11000, 8000]
    }
  ],
  stats: {
    bestWeek: 67000,
    worstWeek: 18000,
    avgWeeklyScore: 37250,
    totalBoxOffice: 287000000,
    rosterValue: 1250000,
    roi: 23.6
  }
});

// API integration hooks (for when live data is available)
export class LiveDataIntegration {
  static async fetchBoxOfficeData(movieIds: number[]): Promise<MoviePerformance[]> {
    // This would integrate with real box office APIs like:
    // - The Numbers API
    // - Box Office Mojo
    // - TMDB (limited box office data)
    // For now, return mock data
    return generateMockMoviePerformance();
  }

  static async updatePlayerScores(leagueId: string): Promise<PlayerScore[]> {
    // This would:
    // 1. Fetch current box office data for all movies in league
    // 2. Calculate weekly scores for each player
    // 3. Update database with new scores
    // 4. Return updated player scores
    
    // Mock implementation
    return [
      generateMockPlayerScore('user1', 'grantgeyer'),
      generateMockPlayerScore('user2', 'MovieMaster99')
    ];
  }

  static async getLeagueStandings(leagueId: string): Promise<LeagueStandings> {
    const playerScores = await this.updatePlayerScores(leagueId);
    
    return {
      leagueId,
      leagueName: 'Friends League 2025',
      currentWeek: 8,
      season: '2025-Fall',
      standings: ScoringEngine.calculateStandings(playerScores),
      weeklyWinners: [
        { week: 8, userId: 'user1', username: 'grantgeyer', points: 67000 },
        { week: 7, userId: 'user2', username: 'MovieMaster99', points: 58000 }
      ]
    };
  }
}