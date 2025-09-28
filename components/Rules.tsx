'use client'

import { memo } from 'react'

const Rules = memo(function Rules() {
  return (
    <div className="px-4 py-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gradient mb-3">
          Fantasy Flix League Rules
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Everything you need to know to dominate your league and claim box office supremacy
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* League Format */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">🏆</span>
            League Format
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-3">Roster Structure</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-blue-400">5 Active Movies</div>
                  <div className="text-gray-300 text-sm">These are your primary earners that count toward weekly scoring</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-green-400">1 Sixth Man</div>
                  <div className="text-gray-300 text-sm">Backup movie that can be swapped into your active lineup</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-purple-400">Unlimited Reserves</div>
                  <div className="text-gray-300 text-sm">Movies on your bench for future activation</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-3">League Options</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-amber-400">League Size: 4-12 Players</div>
                  <div className="text-gray-300 text-sm">Optimal competition with friends and rivals</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-red-400">Budget Cap: $1.5 Billion</div>
                  <div className="text-gray-300 text-sm">Total production budget limit for all active movies</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-cyan-400">Season Length: 365 Days</div>
                  <div className="text-gray-300 text-sm">Full calendar year of box office competition</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">💰</span>
            Scoring System
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-white mb-2">Profit Calculation</h3>
              <div className="text-green-400 font-bold text-lg mb-2">Revenue - Budget = Profit</div>
              <p className="text-gray-300 text-sm">30-day domestic box office minus production budget</p>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🇺🇸</div>
              <h3 className="font-bold text-white mb-2">Domestic Focus</h3>
              <div className="text-blue-400 font-bold text-lg mb-2">US Box Office Only</div>
              <p className="text-gray-300 text-sm">International earnings not counted for scoring</p>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-bold text-white mb-2">Scoring Window</h3>
              <div className="text-purple-400 font-bold text-lg mb-2">30 Days Max</div>
              <p className="text-gray-300 text-sm">Movies score for first 30 days after release</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <h3 className="font-bold text-amber-400 mb-3">💡 Scoring Examples</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-bold text-green-400">Profitable Movie</div>
                <div className="text-gray-300 text-sm">
                  <strong>Top Gun: Maverick</strong><br/>
                  Budget: $170M | 30-Day Revenue: $402M<br/>
                  <span className="text-green-400 font-bold">Profit: +$232M</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-red-400">Loss Movie</div>
                <div className="text-gray-300 text-sm">
                  <strong>The Flash</strong><br/>
                  Budget: $300M | 30-Day Revenue: $108M<br/>
                  <span className="text-red-400 font-bold">Loss: -$192M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roster Management */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">⚙️</span>
            Roster Management
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Draft & Trades</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-amber-400 mb-1">Snake Draft Order</div>
                  <div className="text-gray-300 text-sm">Round 1: 1-2-3-4, Round 2: 4-3-2-1, etc.</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-green-400 mb-1">Trading Allowed</div>
                  <div className="text-gray-300 text-sm">Trade movies anytime before they're released</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-blue-400 mb-1">Trade Deadline</div>
                  <div className="text-gray-300 text-sm">No trades 48 hours before movie release</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Lineup Changes</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-purple-400 mb-1">Daily Swaps</div>
                  <div className="text-gray-300 text-sm">Move movies between active/bench until release</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-cyan-400 mb-1">Sixth Man Usage</div>
                  <div className="text-gray-300 text-sm">Can replace any active movie before release</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-red-400 mb-1">Release Lock</div>
                  <div className="text-gray-300 text-sm">Movies lock in active lineup when released</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="font-bold text-blue-400 mb-3">🎯 Waiver Wire System</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="font-bold text-white mb-1">Priority Order</div>
                <div className="text-gray-300 text-sm">Worst record gets first pick</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white mb-1">Wednesday Waivers</div>
                <div className="text-gray-300 text-sm">Process every Wednesday at midnight</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white mb-1">Budget Rules Apply</div>
                <div className="text-gray-300 text-sm">Must stay under $1.5B cap</div>
              </div>
            </div>
          </div>
        </div>

        {/* Season Structure */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-purple-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">📅</span>
            Season Structure
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">Period 1: Planning Phase</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white font-bold">January - June</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Focus:</span>
                  <span className="text-white font-bold">Draft & Strategy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scoring:</span>
                  <span className="text-white font-bold">Predictions Only</span>
                </div>
                <hr className="border-gray-600 my-3"/>
                <p className="text-gray-300 text-sm">
                  Build your roster, make trades, and strategize for the big blockbuster season.
                  Points awarded for accuracy of box office predictions.
                </p>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Period 2: Results Phase</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white font-bold">July - December</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Focus:</span>
                  <span className="text-white font-bold">Live Performance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scoring:</span>
                  <span className="text-white font-bold">Actual Profits</span>
                </div>
                <hr className="border-gray-600 my-3"/>
                <p className="text-gray-300 text-sm">
                  Summer blockbuster season! Your movies release and earn real box office profits.
                  Pure performance-based scoring.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="font-bold text-purple-400 mb-3">🏆 Championship Scoring</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">Period 1 (40%) + Period 2 (60%) = Final Score</div>
              <p className="text-gray-300">Strategic planning combined with actual performance determines your champion</p>
            </div>
          </div>
        </div>

        {/* Draft Rules */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">🎯</span>
            Draft Rules
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <div className="font-bold text-white mb-1">90 Second Timer</div>
              <div className="text-gray-300 text-sm">Per draft pick</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💸</div>
              <div className="font-bold text-white mb-1">$1.5B Budget Cap</div>
              <div className="text-gray-300 text-sm">Total roster limit</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-bold text-white mb-1">Snake Draft</div>
              <div className="text-gray-300 text-sm">Alternating order</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📽️</div>
              <div className="font-bold text-white mb-1">6 Total Picks</div>
              <div className="text-gray-300 text-sm">5 active + 1 sixth man</div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="font-bold text-red-400 mb-3">⚡ Draft Strategy Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Balance big budget blockbusters with sleeper hits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Consider release date distribution across the year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Research director/actor track records</span>
                </li>
              </ul>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Don't ignore production budget constraints</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Avoid putting all movies in same month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Don't draft movies already released</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Winning Conditions */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">👑</span>
            Winning Conditions
          </h2>

          <div className="text-center mb-8">
            <div className="text-6xl font-black text-gradient mb-4">
              Highest Total Profit = League Champion
            </div>
            <p className="text-xl text-gray-300">
              Sum of all your active movies' profits over the entire season
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🥇</div>
              <h3 className="font-bold text-yellow-400 mb-2">Champion</h3>
              <div className="text-gray-300 text-sm mb-2">Highest profit total</div>
              <div className="text-yellow-400 font-bold">Bragging rights + Crown trophy</div>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🥈</div>
              <h3 className="font-bold text-gray-400 mb-2">Runner-Up</h3>
              <div className="text-gray-300 text-sm mb-2">Second highest profit</div>
              <div className="text-gray-400 font-bold">Respect + Silver trophy</div>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💀</div>
              <h3 className="font-bold text-red-400 mb-2">Last Place</h3>
              <div className="text-gray-300 text-sm mb-2">Lowest profit total</div>
              <div className="text-red-400 font-bold">Toilet trophy + Shame</div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h3 className="font-bold text-yellow-400 mb-3">🔗 Tiebreaker Rules</h3>
            <div className="space-y-2 text-gray-300">
              <div><strong>1st Tiebreaker:</strong> Head-to-head record (if applicable)</div>
              <div><strong>2nd Tiebreaker:</strong> Highest single movie profit</div>
              <div><strong>3rd Tiebreaker:</strong> Lowest total budget spent</div>
              <div><strong>4th Tiebreaker:</strong> Most accurate opening weekend predictions</div>
              <div><strong>Final Tiebreaker:</strong> League commissioner decision (coin flip)</div>
            </div>
          </div>
        </div>

        {/* Special Rules */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">⚡</span>
            Special Rules & Variations
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">League Customizations</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-purple-400 mb-1">Dinner Leagues</div>
                  <div className="text-gray-300 text-sm">Last place cooks dinner for the league</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-green-400 mb-1">High Stakes</div>
                  <div className="text-gray-300 text-sm">Winner picks next group movie night</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-blue-400 mb-1">Themed Leagues</div>
                  <div className="text-gray-300 text-sm">Horror only, Marvel only, indie films, etc.</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Advanced Options</h3>
              <div className="space-y-3">
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-amber-400 mb-1">Injury Reserve</div>
                  <div className="text-gray-300 text-sm">Replace movies delayed or cancelled</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-red-400 mb-1">Keeper Leagues</div>
                  <div className="text-gray-300 text-sm">Keep 2 movies from previous season</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="font-bold text-cyan-400 mb-1">Dynasty Mode</div>
                  <div className="text-gray-300 text-sm">Multi-year franchise building</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-orange-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">📆</span>
            Season Timeline
          </h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">1</div>
              <div className="flex-1">
                <div className="font-bold text-white">January: League Setup & Draft</div>
                <div className="text-gray-300 text-sm">Create leagues, invite friends, conduct snake draft</div>
              </div>
              <div className="text-green-400 font-bold">Jan 1-31</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">2</div>
              <div className="flex-1">
                <div className="font-bold text-white">February-May: Planning Phase</div>
                <div className="text-gray-300 text-sm">Trades, waiver wire, roster optimization, predictions</div>
              </div>
              <div className="text-blue-400 font-bold">Feb-May</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">3</div>
              <div className="flex-1">
                <div className="font-bold text-white">June: Pre-Season Preparation</div>
                <div className="text-gray-300 text-sm">Final roster locks, summer blockbuster preview</div>
              </div>
              <div className="text-purple-400 font-bold">June</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">4</div>
              <div className="flex-1">
                <div className="font-bold text-white">July-November: Competition Season</div>
                <div className="text-gray-300 text-sm">Movies release, box office tracking, live scoring</div>
              </div>
              <div className="text-red-400 font-bold">Jul-Nov</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">5</div>
              <div className="flex-1">
                <div className="font-bold text-white">December: Championship & Awards</div>
                <div className="text-gray-300 text-sm">Final standings, champion crowned, trophy ceremony</div>
              </div>
              <div className="text-yellow-400 font-bold">December</div>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-pink-400 mb-6 flex items-center">
            <span className="text-4xl mr-3">🎭</span>
            The Fantasy Flix Philosophy
          </h2>

          <div className="text-center">
            <p className="text-2xl text-gray-300 leading-relaxed mb-6 italic">
              "Fantasy Flix combines the thrill of prediction with the excitement of actual performance,
              balancing strategy, luck, and movie industry knowledge into the ultimate entertainment experience."
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="font-bold text-blue-400 mb-2">Strategy</h3>
                <p className="text-gray-300 text-sm">
                  Research directors, analyze budgets, study market trends, and build the perfect portfolio
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="text-3xl mb-3">🎲</div>
                <h3 className="font-bold text-green-400 mb-2">Unpredictability</h3>
                <p className="text-gray-300 text-sm">
                  Even the experts get surprised - sometimes sleeper hits beat massive blockbusters
                </p>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold text-purple-400 mb-2">Community</h3>
                <p className="text-gray-300 text-sm">
                  Trash talk, victory celebrations, and friendly rivalries that last all year long
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
})

export default Rules