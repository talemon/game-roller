/**
 * Which facet each Steam tag rolls for. Written for this project: Valve publishes the tag
 * list (id + name) but not a grouping, so the classification below is ours, following the
 * vocabulary Valve's Tag Wizard uses to talk about tags — Genres and Sub-Genres, Themes &
 * Moods, Visuals & View Points, Player support (https://partner.steamgames.com/doc/store/tags).
 *
 * Rules the lists follow:
 * - One group per tag. A tag in two facets prints the same idea twice in one sentence
 *   ("a comic-book game ... with a comic book theme"), so `Comic Book` is a look, not a theme.
 * - A sport is what the game *is*, not what it is about: `Golf` and `Tennis` are genres.
 * - A theme is a setting, subject or mood — something the game is *about*. Quality claims
 *   (`Lore-Rich`, `Immersive`), play-style adjectives (`Tactical`) and bare mechanics
 *   (`Loot`, `Logic`) describe how a game plays, not what it is about, and roll for nothing.
 * - Software genres (`Utilities`, `Video Production`), production facts (`Indie`,
 *   `Early Access`), content descriptors (`Gore`, `Nudity`) and marketing tags (`eSports`)
 *   roll for nothing and are simply absent.
 * - Names must match Valve's tag list exactly; `bun run tags:refresh` fails on any that do not.
 */
export type TagGroup = 'genre' | 'theme' | 'viewpoint' | 'players';

/** What kind of game it is. Prefix slot: "A <genre> game". */
const genre = [
  '2D Fighter', '2D Platformer', '3D Fighter', '3D Platformer', '4X', 'Action',
  'Action Roguelike', 'Action RPG', 'Action RTS', 'Action-Adventure', 'Adventure', 'Arcade',
  'Arena Shooter', 'Auto Battler', 'Automobile Sim', 'Baseball', 'Basketball', 'Battle Royale',
  'Beat \'em up', 'Billiards', 'Board Game', 'Boomer Shooter', 'Bowling', 'Boxing',
  'Bullet Heaven', 'Bullet Hell', 'Card Battler', 'Card Game', 'Casual', 'Chess',
  'Choose Your Own Adventure', 'City Builder', 'Collectathon', 'Colony Sim', 'Combat Racing',
  'Creature Collector', 'Cricket', 'CRPG', 'Cycling', 'Dating Sim', 'Deckbuilding', 'Dice',
  'Dungeon Crawler', 'Escape Room', 'Espionage', 'Exploration', 'Extraction Shooter',
  'Falling Blocks', 'Farming Sim', 'Fighting', 'Flight', 'Football (American)',
  'Football (Soccer)', 'FPS', 'God Game', 'Golf', 'Grand Strategy', 'Hack and Slash',
  'Hero Shooter', 'Hidden Object', 'Hobby Sim', 'Hockey', 'Idler', 'Immersive Sim', 'Incremental',
  'Interactive Fiction', 'Job Simulator', 'JRPG', 'Life Sim', 'Looter Shooter', 'Mahjong',
  'Match 3', 'Medical Sim', 'Metroidvania', 'Mini Golf', 'MMORPG', 'MOBA', 'Motocross', 'Musou',
  'Mystery Dungeon', 'On-Rails Shooter', 'Open World Survival Craft', 'Outbreak Sim',
  'Party Game', 'Party-Based RPG', 'Pinball', 'Platformer', 'Point & Click', 'Poker',
  'Political Sim', 'Precision Platformer', 'Puzzle', 'Puzzle Platformer', 'Racing',
  'Real Time Tactics', 'Rhythm', 'Roguelike', 'Roguelike Deckbuilder', 'Roguelite', 'RPG', 'RTS',
  'Rugby', 'Runner', 'Sandbox', 'Shoot \'Em Up', 'Shooter', 'Shop Keeper', 'Simulation',
  'Skateboarding', 'Skating', 'Skiing', 'Snowboarding', 'Social Deduction', 'Sokoban',
  'Solitaire', 'Souls-like', 'Space Sim', 'Spectacle fighter', 'Spelling', 'Sports', 'Strategy',
  'Strategy RPG', 'Tabletop', 'Tactical RPG', 'Tennis', 'Third-Person Shooter', 'Time Management',
  'Top-Down Shooter', 'Tower Defense', 'Trading Card Game', 'Traditional Roguelike', 'Trivia',
  'Turn-Based Strategy', 'Turn-Based Tactics', 'Twin Stick Shooter', 'Typing', 'Visual Novel',
  'Volleyball', 'Walking Simulator', 'Wargame', 'Word Game', 'Wrestling',
] as const;

/** Setting, subject or mood. Trailing slot: "with a <theme> theme". */
const theme = [
  '1980s', '1990\'s', 'Agriculture', 'Aliens', 'Alternate History', 'Animals', 'Archery',
  'Artificial Intelligence', 'Assassins', 'Atmospheric', 'ATV', 'Automation', 'Bikes', 'Birds',
  'BMX', 'Building', 'Capitalism', 'Capybaras', 'Cats', 'Cleaning', 'Cold War', 'Comedy',
  'Conspiracy', 'Cooking', 'Cozy', 'Crafting', 'Crime', 'Cult', 'Cyberpunk', 'Dark',
  'Dark Comedy', 'Dark Fantasy', 'Dark Humor', 'Decorating', 'Demons', 'Destruction', 'Detective',
  'Dinosaurs', 'Diplomacy', 'Dogs', 'Dragons', 'Driving', 'Dwarves', 'Dystopian', 'Economy',
  'Elves', 'Emotional', 'Epic', 'Faith', 'Family Friendly', 'Fantasy', 'Farming', 'Fishing',
  'Foxes', 'Funny', 'Futuristic', 'Gambling', 'Game Development', 'Gothic', 'Hacking', 'Heist',
  'Historical', 'Horror', 'Horses', 'Hunting', 'Investigation', 'Lemmings', 'LGBTQ+',
  'Lovecraftian', 'Magic', 'Management', 'Mars', 'Martial Arts', 'Mechs', 'Medieval', 'Memes',
  'Military', 'Mining', 'Modern', 'Motorbike', 'Mystery', 'Mythology', 'Nature', 'Naval', 'Ninja',
  'Nostalgia', 'Offroad', 'Old School', 'Organizing', 'Otome', 'Parkour', 'Parody',
  'Philosophical', 'Pirates', 'Post-apocalyptic', 'Programming', 'Psychological',
  'Psychological Horror', 'Relaxing', 'Retro', 'Robots', 'Romance', 'Rome', 'Sailing', 'Samurai',
  'Satire', 'Sci-fi', 'Science', 'Sniper', 'Snow', 'Space', 'Spaceships', 'Stealth', 'Steampunk',
  'Submarine', 'Superhero', 'Supernatural', 'Surreal', 'Survival', 'Survival Horror', 'Swordplay',
  'Tanks', 'Thriller', 'Time Travel', 'Trading', 'Trains', 'Transhumanism', 'Transportation',
  'Underground', 'Underwater', 'Vampires', 'Vikings', 'War', 'Werewolves', 'Western', 'Wholesome',
  'Wolves', 'World War I', 'World War II', 'Wuxia', 'Xianxia', 'Zombies', 'Zoo',
] as const;

/** Art style and camera. Prefix slot: "A <viewpoint> game". */
const viewpoint = [
  '2.5D', '2D', '3D', 'Abstract', 'Anime', 'Beautiful', 'Cartoon', 'Cartoony', 'Cinematic',
  'Colorful', 'Comic Book', 'Cute', 'First-Person', 'FMV', 'Hand-drawn', 'Isometric',
  'Minimalist', 'Noir', 'Pixel Graphics', 'Psychedelic', 'Realistic', 'Side Scroller', 'Stylized',
  'Text-Based', 'Third Person', 'Top-Down', 'Voxel', 'VR',
] as const;

/** Who plays, and how. Prefix slot: "A <players> game". */
const players = [
  '4 Player Local', 'Asynchronous Multiplayer', 'Co-op', 'Co-op Campaign', 'Local Co-Op',
  'Local Multiplayer', 'Massively Multiplayer', 'Multiplayer', 'Online Co-Op', 'PvE', 'PvP',
  'Singleplayer', 'Split Screen', 'Team-Based',
] as const;

export const TAG_GROUPS: Record<TagGroup, readonly string[]> = { genre, theme, viewpoint, players };

/** Every classified tag name, in the order the refresh script validates them. */
export const GROUPED_TAG_NAMES: readonly string[] = Object.values(TAG_GROUPS).flat();
