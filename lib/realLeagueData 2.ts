// Real Fantasy Flix league data from your spreadsheet
export interface RealPlayerData {
  name: string;
  totalBudget: number;
  totalRevenue: number;
  totalProfit: number;
  penalties?: number;
  bonuses?: number;
  finalScore: number;
  profitPerMovie: number;
  movies: RealMovieData[];
}

export interface RealMovieData {
  title: string;
  budget: number;
  thirtyDayRevenue: number;
  profit: number;
  status: 'profitable' | 'loss' | 'break-even';
}

// Your actual league data
export const realLeagueData: RealPlayerData[] = [
  {
    name: "Grant",
    totalBudget: 690,
    totalRevenue: 1027,
    totalProfit: 337,
    finalScore: 337,
    profitPerMovie: 125.5,
    movies: [
      { title: "Wicked: For Good", budget: 165, thirtyDayRevenue: 0, profit: -165, status: 'loss' },
      { title: "Superman", budget: 225, thirtyDayRevenue: 329, profit: 104, status: 'profitable' },
      { title: "A Minecraft Movie", budget: 150, thirtyDayRevenue: 394, profit: 244, status: 'profitable' },
      { title: "28 Years Later", budget: 60, thirtyDayRevenue: 68, profit: 8, status: 'break-even' },
      { title: "Sinners", budget: 90, thirtyDayRevenue: 236, profit: 146, status: 'profitable' }
    ]
  },
  {
    name: "Josh", 
    totalBudget: 548,
    totalRevenue: 466,
    totalProfit: -82,
    finalScore: -82,
    profitPerMovie: 6,
    movies: [
      { title: "Captain America 4", budget: 180, thirtyDayRevenue: 184, profit: 4, status: 'break-even' },
      { title: "How to Train Your Dragon", budget: 150, thirtyDayRevenue: 237, profit: 87, status: 'profitable' },
      { title: "Mickey 17", budget: 118, thirtyDayRevenue: 45, profit: -73, status: 'loss' },
      { title: "Frankenstein", budget: 0, thirtyDayRevenue: 0, profit: -100, status: 'loss' },
      { title: "The Running Man", budget: 0, thirtyDayRevenue: 0, profit: 0, status: 'break-even' },
      { title: "Thunderbolts", budget: 175, thirtyDayRevenue: 180, profit: 5, status: 'break-even' }
    ]
  },
  {
    name: "Will",
    totalBudget: 705,
    totalRevenue: 895,
    totalProfit: 190,
    penalties: 20,
    finalScore: 170,
    profitPerMovie: 38,
    movies: [
      { title: "Elio", budget: 150, thirtyDayRevenue: 68, profit: -82, status: 'loss' },
      { title: "Dog Man", budget: 40, thirtyDayRevenue: 83, profit: 43, status: 'profitable' },
      { title: "Lilo & Stitch", budget: 100, thirtyDayRevenue: 384, profit: 284, status: 'profitable' },
      { title: "Jurassic World", budget: 265, thirtyDayRevenue: 309, profit: 44, status: 'profitable' },
      { title: "The Karate Kid", budget: 150, thirtyDayRevenue: 51, profit: -99, status: 'loss' },
      { title: "Moana", budget: 0, thirtyDayRevenue: 0, profit: 0, status: 'break-even' }
    ]
  },
  {
    name: "Tyler",
    totalBudget: 650,
    totalRevenue: 256,
    totalProfit: -394,
    bonuses: 100,
    finalScore: -494,
    profitPerMovie: 0, // N/A in spreadsheet
    movies: [
      { title: "Avatar: Fire and Ash", budget: 250, thirtyDayRevenue: 0, profit: -250, status: 'loss' },
      { title: "Zootopia 2", budget: 150, thirtyDayRevenue: 0, profit: -150, status: 'loss' },
      { title: "The Conjuring: Last Rites", budget: 50, thirtyDayRevenue: 0, profit: -50, status: 'loss' },
      { title: "Fantastic 4: First Steps", budget: 200, thirtyDayRevenue: 256, profit: 56, status: 'profitable' },
      { title: "Michael", budget: 0, thirtyDayRevenue: 0, profit: 0, status: 'break-even' },
      { title: "Beyond the Spider-verse", budget: 0, thirtyDayRevenue: 0, profit: 0, status: 'break-even' }
    ]
  }
];

// Opening weekend predictions vs actual
export const openingWeekendData = [
  { movie: "Wicked for Good", prediction: 150, actual: null },
  { movie: "Captain America 4", prediction: 135, actual: 89 },
  { movie: "Elio", prediction: 80, actual: 21 },
  { movie: "Avatar: Fire & Ash", prediction: 155, actual: null }
];

// Generate chart data from real league performance
export const generateRealChartData = () => {
  // Simulated weekly progression based on final scores
  const weeks = 8;
  return realLeagueData.map(player => {
    const finalScore = player.finalScore;
    const weeklyData = [];
    
    for (let week = 1; week <= weeks; week++) {
      // Simulate progressive score building
      const weeklyScore = Math.round((finalScore / weeks) * week + (Math.random() - 0.5) * 50);
      weeklyData.push({
        week: week.toString(),
        score: Math.max(0, weeklyScore),
        player: player.name
      });
    }
    
    return {
      player: player.name,
      data: weeklyData,
      finalScore: player.finalScore,
      profitPerMovie: player.profitPerMovie
    };
  });
};

// League standings based on real data
export const getLeagueStandings = () => {
  return realLeagueData
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      score: player.finalScore,
      profitPerMovie: player.profitPerMovie,
      totalMovies: player.movies.length,
      profitableMovies: player.movies.filter(m => m.status === 'profitable').length
    }));
};