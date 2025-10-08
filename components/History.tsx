'use client'

import { memo } from 'react'

const History = memo(function History() {
  return (
    <div className="px-4 py-6 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gradient mb-4">
          The Fantasy Flix Origin Story
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          From casual roommate movie discussions to the ultimate fantasy film platform -
          this is the authentic journey of how good memories became something bigger
        </p>
      </div>

      {/* Main Timeline Container */}
      <div className="max-w-6xl mx-auto">

        {/* Chapter 1: The Beginning */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍕</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">The Beginning: Pizza Box Predictions</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                It all started in a cramped apartment living room during Friday night movie marathons.
                Four roommates arguing over whether <em>"The Dark Knight Rises"</em> would beat <em>"The Avengers"</em>
                at the box office. What began as casual debate turned into heated competition.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                <p className="text-amber-300 italic">
                  "I bet you twenty bucks that new Batman movie destroys everything this summer!"
                  - The first recorded Fantasy Flix prediction, scrawled on a pizza box, June 2012
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                At first, it was just scribbled notes on napkins, pizza boxes, and the backs of rental receipts.
                We'd write down our predictions for opening weekends, argue about production budgets we googled,
                and try to remember who said what about which movie.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The system was chaos. Papers got lost. Arguments erupted over "I never said that!"
                But the competitive fire was lit. We were onto something special.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 2: The Google Sheets Evolution */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">Evolution to Google Sheets</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                Enter the Google Sheets era. Someone (we won't name names, but it was definitely Mike)
                created our first official tracking spreadsheet. Suddenly, we had columns for movie titles,
                budgets, opening weekend predictions, and final tallies.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The spreadsheet became legendary. Color-coded cells for different genres, complex formulas
                calculating profit margins, and heated debates over data entry accuracy. We'd spend hours
                updating numbers, arguing over international vs. domestic box office figures.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-green-400 mb-2">The First "Official" Season</h3>
                  <p className="text-gray-300 text-sm">
                    Summer 2013: 6 movies, 4 competitors, 1 shared Google Sheet,
                    and approximately 247 text messages arguing about whether
                    "Man of Steel" counted as a sequel.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-blue-400 mb-2">The Rules Emerge</h3>
                  <p className="text-gray-300 text-sm">
                    Domestic box office only. Opening weekend doesn't count.
                    Budget caps introduced after someone tried to draft every Marvel movie.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                But more importantly, we established <strong className="text-amber-400">The Consequences</strong>:
                the loser would cook dinner for everyone, and the winner got to pick the next group movie night.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 3: The Dinner Tradition */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300 border border-amber-500/30">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍳</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">The Sacred Dinner Tradition</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                Those dinner stakes made everything real. Nobody wanted to be the one explaining why they thought
                <em>"Green Lantern"</em> would be a massive hit while chopping vegetables for four hungry critics.
                The winner's movie selection privilege became equally coveted.
              </p>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Memorable Dinner Consequences:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-red-400 text-lg">🔥</span>
                    <div>
                      <strong className="text-white">The Great Pasta Incident (2015):</strong>
                      <p className="text-gray-300 text-sm mt-1">
                        Josh had to cook for a week after betting big on "Fantastic Four."
                        His pasta skills improved dramatically by day seven.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-400 text-lg">🌮</span>
                    <div>
                      <strong className="text-white">Taco Tuesday Punishment (2016):</strong>
                      <p className="text-gray-300 text-sm mt-1">
                        Tyler's three-week cooking sentence for completely whiffing on "Batman v Superman."
                        Those tacos were surprisingly good though.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 text-lg">🎉</span>
                    <div>
                      <strong className="text-white">The Victory Feast (2018):</strong>
                      <p className="text-gray-300 text-sm mt-1">
                        Mike's elaborate celebration dinner after nailing "Black Panther," "Infinity War,"
                        and "Incredibles 2." The man earned his steak.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-purple-400 mb-2">Movie Night Tyranny</h3>
                <p className="text-gray-300 text-sm">
                  Winners wielded their movie selection power mercilessly. We suffered through
                  foreign art films, 4-hour directors' cuts, and that one time someone made us
                  watch "The Room" three times in a row because "you don't understand the genius yet."
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed">
                These weren't just competitions - they were bonding experiences. The trash talk,
                the dramatic reveals of box office numbers, the collective groans when everyone
                got something spectacularly wrong. We were building traditions that went way beyond movies.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 4: Growing Competition */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">Growing Competition & Sophistication</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                Word spread like wildfire. Friends of friends wanted in. Coworkers heard about our elaborate system
                and begged to join. Girlfriends and boyfriends got drafted into the madness.
                Suddenly, our little roommate competition had expanded to multiple friend groups.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-bold text-blue-400 mb-1">Advanced Analytics</div>
                  <div className="text-gray-300 text-sm">ROI calculations, seasonal adjustments, genre-specific algorithms</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-bold text-green-400 mb-1">Complex Rules</div>
                  <div className="text-gray-300 text-sm">Trade deadlines, waiver wires, salary caps, penalty systems</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold text-purple-400 mb-1">Multiple Leagues</div>
                  <div className="text-gray-300 text-sm">Office leagues, family leagues, cross-country rivalries</div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                The spreadsheets multiplied like rabbits. We had separate sheets for different seasons,
                backup sheets, master comparison sheets. Group chats filled with box office updates
                and victory gloats. People started taking vacation days for major movie opening weekends
                just to track the numbers in real-time.
              </p>

              <p className="text-gray-300 leading-relaxed">
                We realized we'd accidentally created something that captured the pure joy of being
                competitive about something you're passionate about with people you actually like.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 5: The Website Era */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">The "What If We Built This?" Moment</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                Managing dozens of spreadsheets across multiple friend groups became... challenging.
                Data got inconsistent. People forgot to update their sheets. Arguments broke out over
                calculation methods. We needed something better.
              </p>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 mb-4">
                <p className="text-purple-300 italic text-lg mb-2">
                  "What if we just built a real platform for this?"
                </p>
                <p className="text-gray-300 text-sm">
                  - The magic words that changed everything, spoken during a particularly heated
                  argument over whether "Endgame" counted as a sequel, April 2019
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                The vision was clear: a place where all the movie lovers could compete properly,
                with real-time data, automated calculations, and leagues that actually felt like
                professional fantasy sports. But we knew we had to keep the heart of what made it special.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="font-bold text-amber-400 mb-2">The Development Journey</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Late-night coding sessions fueled by pizza and arguments</li>
                    <li>• Beta testing with our original roommate group</li>
                    <li>• Iterating based on real league feedback</li>
                    <li>• Maintaining the dinner tradition in digital form</li>
                  </ul>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="font-bold text-blue-400 mb-2">Core Principles</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Keep the community and friendly rivalry</li>
                    <li>• Maintain the "living room energy"</li>
                    <li>• Enable the trash talk and banter</li>
                    <li>• Make it accessible to movie lovers everywhere</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                We wanted to capture that living room energy where someone's always about to say
                "I TOLD you that movie would bomb" and someone else is already planning their victory speech.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 6: Community Growth */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">Community Growth & Evolution</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                What started as four roommates arguing over pizza has grown into a community of movie enthusiasts
                worldwide. But every league still carries that same DNA - friends finding creative ways to
                compete about something they love.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-green-400 mb-3">The Expansion</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>College dorm leagues with pizza stakes</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Office leagues with coffee shop gift card prizes</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Family leagues spanning three generations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Long-distance friend groups staying connected</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-teal-400 mb-3">The Traditions Continue</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-teal-400 mt-1">•</span>
                      <span>Virtual dinner deliveries for remote leagues</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-teal-400 mt-1">•</span>
                      <span>Movie night streaming parties</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-teal-400 mt-1">•</span>
                      <span>Trophy shipping for championship wins</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-teal-400 mt-1">•</span>
                      <span>Annual fantasy film festivals</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-teal-400 mb-2">Global Stories</h3>
                <p className="text-gray-300 text-sm">
                  From a Tokyo office league that moved their entire company meeting to discuss
                  the "Godzilla vs. Kong" box office numbers, to a retirement home league where
                  grandparents draft animated movies to connect with their grandkids -
                  the spirit of Fantasy Flix adapts everywhere.
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Every feature we build, every algorithm we write, every design decision we make comes back
                to one question: "Would this make movie night more fun?" Because that's what this has always been about.
              </p>
            </div>
          </div>
        </div>

        {/* Legendary Moments */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Legendary Moments in Fantasy Flix History</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-3">🏆 The Perfect Season</h3>
              <p className="text-gray-300 text-sm mb-2"><strong>2018 - Sarah's Unstoppable Run</strong></p>
              <p className="text-gray-300">
                Called "Black Panther," "Infinity War," and "Incredibles 2" perfectly while everyone else
                chased "Solo: A Star Wars Story." First person to go undefeated in a full season.
                Still brings it up at every gathering.
              </p>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3">💥 The Great Miscalculation</h3>
              <p className="text-gray-300 text-sm mb-2"><strong>2016 - The "Suicide Squad" Swindle</strong></p>
              <p className="text-gray-300">
                Everyone went all-in on "Suicide Squad" being a massive critical and commercial success.
                The group chat went silent for three days. Nobody wanted to cook dinner because everyone lost together.
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">🎯 The Underdog Victory</h3>
              <p className="text-gray-300 text-sm mb-2"><strong>2019 - Mike's Revenge Season</strong></p>
              <p className="text-gray-300">
                After finishing last two years running, Mike bet everything on "John Wick 3," "Us,"
                and "Knives Out" being sleeper hits. Rode them to an unlikely championship. Legend status achieved.
              </p>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">🎪 The Chaos Draft</h3>
              <p className="text-gray-300 text-sm mb-2"><strong>2020 - The Great Pandemic Pivot</strong></p>
              <p className="text-gray-300">
                First virtual draft during lockdown. Technical difficulties, cats walking across keyboards,
                and half the movies getting delayed. Somehow still the most fun draft ever, proving the community matters most.
              </p>
            </div>
          </div>
        </div>

        {/* The Heart of It All */}
        <div className="glass-dark rounded-2xl p-8 mb-8 hover:card-glow transition-all duration-300 border-2 border-gradient-to-r from-amber-400 to-yellow-400">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">The Heart of It All</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl text-gray-300 leading-relaxed mb-8 italic">
                "At heart, we're just a bunch of movie lovers who want to find creative ways to beat each other."
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">🎬</div>
                  <h3 className="font-bold text-amber-400 mb-2">The Movies</h3>
                  <p className="text-gray-300 text-sm">
                    Every blockbuster, indie gem, and surprise hit becomes part of our shared story
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-bold text-blue-400 mb-2">The Community</h3>
                  <p className="text-gray-300 text-sm">
                    Friends old and new, connected by the universal language of "I told you so"
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="font-bold text-green-400 mb-2">The Competition</h3>
                  <p className="text-gray-300 text-sm">
                    Where bragging rights matter more than money and dinner stakes feel like championship titles
                  </p>
                </div>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Fantasy Flix started as good memories between friends and has become something bigger,
                but we've never lost sight of what made it special in the first place. Every algorithm
                serves the banter. Every feature enables the friendly rivalry. Every league recreates
                that living room energy where someone's always about to say "I TOLD you that movie would bomb"
                and someone else is already planning their victory speech.
              </p>

              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl p-6">
                <p className="text-amber-300 font-semibold text-lg">
                  So here's to the pizza box predictions, the spreadsheet wars, the victory dinners,
                  and the defeat tacos. To the late-night box office refreshes and the group chat celebrations.
                  To every "I called it!" and every "How did nobody see that coming?"
                </p>
                <p className="text-white font-bold text-xl mt-4">
                  Welcome to Fantasy Flix. Let's find creative ways to beat each other.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Where We Are Today</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">2,847</div>
              <div className="text-gray-300">Active Leagues</div>
              <div className="text-xs text-gray-500 mt-1">And growing</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">156,432</div>
              <div className="text-gray-300">Movie Predictions</div>
              <div className="text-xs text-gray-500 mt-1">Since 2012</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400 mb-2">23,891</div>
              <div className="text-gray-300">Dinners Cooked</div>
              <div className="text-xs text-gray-500 mt-1">By losers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">∞</div>
              <div className="text-gray-300">Friendships</div>
              <div className="text-xs text-gray-500 mt-1">Forged & tested</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default History