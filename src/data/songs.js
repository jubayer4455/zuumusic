// Curated high quality tracks with real reliable preview audio URLs and rich metadata

export const PLAYLISTS_META = [
  {
    id: "top-hits",
    title: "Today's Top Hits",
    description: "The hottest tracks right now across the globe. Cover: Sabrina Carpenter.",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    color: "from-emerald-800",
    gradient: "linear-gradient(to bottom, #059669, #121212)",
    followers: "34,821,104",
    likes: "3,420,119",
    curator: "Zuu Music Editorial"
  },
  {
    id: "lofi-chill",
    title: "Chilled Lo-Fi Beats",
    description: "Relax, study, or sleep with calm, cozy lofi hip hop vibes.",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    color: "from-purple-900",
    gradient: "linear-gradient(to bottom, #581c87, #121212)",
    followers: "7,492,012",
    likes: "890,410",
    curator: "Zuu Lo-Fi"
  },
  {
    id: "bangla-vibes",
    title: "Bangla Acoustic & Modern",
    description: "Heart-touching Bengali melodies, folk soul, and urban acoustics.",
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    color: "from-amber-900",
    gradient: "linear-gradient(to bottom, #78350f, #121212)",
    followers: "1,248,300",
    likes: "182,540",
    curator: "Zuu India & BD"
  },
  {
    id: "pop-rising",
    title: "Pop Rising 2026",
    description: "Tomorrow's chart toppers today. Fresh pop gems on repeat.",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    color: "from-rose-900",
    gradient: "linear-gradient(to bottom, #881337, #121212)",
    followers: "5,102,400",
    likes: "612,900",
    curator: "Zuu Hits"
  },
  {
    id: "workout-fuel",
    title: "Workout Energy Beast Mode",
    description: "High-octane bass and energetic dance beats to power your sets.",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    color: "from-orange-800",
    gradient: "linear-gradient(to bottom, #9a3412, #121212)",
    followers: "4,320,110",
    likes: "490,120",
    curator: "Zuu Workout"
  },
  {
    id: "midnight-drive",
    title: "Midnight Synthwave & Drive",
    description: "Neon lights, empty highways, and nostalgic retrowave synth pulses.",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    color: "from-indigo-900",
    gradient: "linear-gradient(to bottom, #312e81, #121212)",
    followers: "2,810,400",
    likes: "320,910",
    curator: "Zuu Electro"
  }
];

export const CATEGORIES = [
  { id: "all", name: "Podcasts", color: "bg-emerald-600", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80" },
  { id: "pop", name: "Pop", color: "bg-pink-600", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "hiphop", name: "Hip-Hop", color: "bg-orange-600", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80" },
  { id: "lofi", name: "Lo-Fi & Chill", color: "bg-indigo-600", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80" },
  { id: "rock", name: "Rock & Alternative", color: "bg-red-700", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80" },
  { id: "electronic", name: "Electronic & Dance", color: "bg-blue-600", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" },
  { id: "acoustic", name: "Acoustic & Folk", color: "bg-amber-600", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80" },
  { id: "focus", name: "Deep Focus & Study", color: "bg-teal-700", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80" },
  { id: "latin", name: "Latin & Reggaeton", color: "bg-purple-600", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80" },
  { id: "workout", name: "Workout & Gym", color: "bg-rose-600", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80" }
];

export const ALL_SONGS = [
  {
    id: "song-1",
    title: "Midnight Dreamscape",
    artist: "Nova & Celestial Sound",
    album: "Neon Echoes",
    duration: "2:45",
    durationSec: 165,
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
    playlistId: "lofi-chill",
    genre: "lofi",
    plays: "42,910,230",
    dateAdded: "3 days ago",
    lyrics: [
      "City lights reflect upon the glass",
      "Watching every quiet moment pass",
      "Soft rain falling on the street below",
      "Drifting in a gentle midnight glow",
      "Nothing else matters in this room tonight",
      "Just the soft hum of the neon light",
      "Take a breath and let the rhythm stay",
      "Wash the burdens of the day away..."
    ]
  },
  {
    id: "song-2",
    title: "Espresso Sunrise",
    artist: "Aria Thorne",
    album: "Sweet Caffeine",
    duration: "2:55",
    durationSec: 175,
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/676/676404_5674468-lq.mp3",
    playlistId: "top-hits",
    genre: "pop",
    plays: "118,490,200",
    dateAdded: "Yesterday",
    lyrics: [
      "Now he's thinking 'bout me every night, oh",
      "Is it that sweet? I guess so!",
      "Say you can't sleep, baby I know",
      "That's that me espresso!",
      "Move it up, down, left, right, oh",
      "Switch it up like Nintendo",
      "Say you can't sleep, baby I know",
      "That's that me espresso!"
    ]
  },
  {
    id: "song-3",
    title: "Tomar Shonghe (Acoustic)",
    artist: "Anupam & Shreya Sen",
    album: "Bhalobashar Canvas",
    duration: "3:30",
    durationSec: 210,
    cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/567/567223_11861866-lq.mp3",
    playlistId: "bangla-vibes",
    genre: "acoustic",
    plays: "14,302,890",
    dateAdded: "1 week ago",
    lyrics: [
      "মেঘের দেশে চিঠি পাঠাই তোমার ঠিকানায়",
      "একলা বিকেলে মন ভেসে যায় অচিন মোহনায়",
      "তুমি আছো সুরের মাঝে, আছো অনুভবে",
      "এমন মিষ্টি সকাল বলো আর কবে হবে?",
      "তোমার চোখে হারিয়ে যেতে ইচ্ছে করে রোজ",
      "হৃদয় মাঝে লুকিয়ে রাখা সব প্রেমের খোঁজ...",
      "একটু হাসো, হাতটা ধরো, চলনা হেঁটে যাই",
      "এই জীবনে তোমায় ছাড়া আর কিছু না চাই।"
    ]
  },
  {
    id: "song-4",
    title: "Levitating Through Starlight",
    artist: "Zara Luna",
    album: "Cosmic Disco",
    duration: "3:23",
    durationSec: 203,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/614/614214_11861866-lq.mp3",
    playlistId: "top-hits",
    genre: "pop",
    plays: "89,112,044",
    dateAdded: "5 days ago",
    lyrics: [
      "If you wanna run away with me, I know a galaxy",
      "And I can take you for a ride",
      "I had a premonition that we fell into a rhythm",
      "Where the music don't stop for life",
      "Glitter in the sky, glitter in my eyes",
      "Shining just the way I like",
      "If you're feeling like you need a little bit of company",
      "You met me at the perfect time!"
    ]
  },
  {
    id: "song-5",
    title: "Cyberpunk Overdrive",
    artist: "Hyperion Drive",
    album: "Velocity 2099",
    duration: "3:10",
    durationSec: 190,
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/515/515823_11861866-lq.mp3",
    playlistId: "midnight-drive",
    genre: "electronic",
    plays: "31,894,100",
    dateAdded: "2 weeks ago",
    lyrics: [
      "Rev the engine, break the line",
      "Catching stars and chasing time",
      "Streets of neon, digital haze",
      "Lost inside the cyber maze",
      "Push the pedal to the floor",
      "Hear the bass begin to roar",
      "Synthesizers light the sky",
      "We will never say goodbye!"
    ]
  },
  {
    id: "song-6",
    title: "Heavy Iron Bass",
    artist: "Titan Pulse",
    album: "No Excuses Workout",
    duration: "2:50",
    durationSec: 170,
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/476/476646_11861866-lq.mp3",
    playlistId: "workout-fuel",
    genre: "workout",
    plays: "22,541,000",
    dateAdded: "4 days ago",
    lyrics: [
      "One more rep, feel the heat",
      "Drop the bass and move your feet",
      "Sweat and iron, unbroken will",
      "Climbing higher up the hill",
      "No limits, break the cage",
      "Channel all the inner rage",
      "Champions are made tonight",
      "Underneath the stadium light!"
    ]
  },
  {
    id: "song-7",
    title: "Autumn Breeze in Gulshan",
    artist: "The Bengal Collective",
    album: "Dhaka Rain & Nostalgia",
    duration: "3:42",
    durationSec: 222,
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/538/538600_11861866-lq.mp3",
    playlistId: "bangla-vibes",
    genre: "acoustic",
    plays: "9,820,400",
    dateAdded: "3 weeks ago",
    lyrics: [
      "গুলশানের লেকপাড়ে শান্ত বিকেল",
      "চায়ের কাপে ধোঁয়া ওড়ে আনমনে",
      "পুরোনো বন্ধুদের হাসিমুখের স্মৃতি",
      "আজও দোলা দিয়ে যায় এ মনে",
      "বৃষ্টি ভেজা কাঁচের ওপারে শহর",
      "চলছে সবাই যেন আপন ঘোরে",
      "একটি গান, কিছু সুরের বাঁধন",
      "রেখে যায় ভালোবাসা অন্তরে।"
    ]
  },
  {
    id: "song-8",
    title: "Sunset Golden Hour",
    artist: "Kavinsky & Isla",
    album: "Horizon Horizons",
    duration: "3:15",
    durationSec: 195,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/567/567223_11861866-lq.mp3",
    playlistId: "pop-rising",
    genre: "pop",
    plays: "65,291,100",
    dateAdded: "Just now",
    lyrics: [
      "Golden rays upon the shore",
      "Never felt this warmth before",
      "Hold my hand, don't let it fade",
      "In the memories we made",
      "Sky turns violet, then to blue",
      "Every color leads to you",
      "Stay right here until tomorrow",
      "Far away from any sorrow."
    ]
  },
  {
    id: "song-9",
    title: "Study Sessions (Deep Focus)",
    artist: "MindFlow Lo-Fi",
    album: "Library After Hours",
    duration: "2:38",
    durationSec: 158,
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
    playlistId: "lofi-chill",
    genre: "lofi",
    plays: "58,110,400",
    dateAdded: "Yesterday",
    lyrics: [
      "[Instrumental Lo-Fi Chill Beats]",
      "Raindrops tapping rhythm on the window pane",
      "Pages turning gently in the silent room",
      "Warm coffee steam rising peacefully",
      "Pure deep focus, clarity of mind."
    ]
  },
  {
    id: "song-10",
    title: "Neon Highway Cruising",
    artist: "SynthWave Syndicate",
    album: "Retro 80s Dreams",
    duration: "3:35",
    durationSec: 215,
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.freesound.org/previews/515/515823_11861866-lq.mp3",
    playlistId: "midnight-drive",
    genre: "electronic",
    plays: "19,400,200",
    dateAdded: "4 days ago",
    lyrics: [
      "Driving into the electric night",
      "Dashboard dials gleaming bright",
      "Analog dreams and 80s sound",
      "Leaving this forgotten town",
      "Faster, faster, through the dark",
      "Ignite the synth, create the spark!"
    ]
  }
];

export const USER_PROFILE = {
  name: "Tanvir Ahmed",
  handle: "@tanvir_music",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  plan: "Zuu Music VIP Individual",
  playlistsCount: 8,
  followingCount: 142
};

export const PODCASTS_DATA = [
  {
    id: "pod-1",
    title: "Bangla Ghost FM & Paranormal Stories",
    host: "RJ Russell & Team",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    description: "Midnight true horror stories, real supernatural encounters, and paranormal investigations from across Bengal.",
    episodesCount: 48,
    category: "Horror & Mystery",
    latestEpisode: {
      id: "pod-ep-1",
      title: "Episode 104: Sundarbans Deep Night Enigma",
      artist: "RJ Russell",
      duration: "42:15",
      date: "Oct 2026",
      cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      audioUrl: "https://cdn.freesound.org/previews/515/515823_11861866-lq.mp3"
    }
  },
  {
    id: "pod-2",
    title: "Huberman Lab: Master Focus & Deep Sleep",
    host: "Dr. Andrew Huberman",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    description: "Neuroscience-backed tools and protocols to boost dopamine, optimize sleep rhythm, and enhance cognitive flow daily.",
    episodesCount: 120,
    category: "Health & Science",
    latestEpisode: {
      id: "pod-ep-2",
      title: "Mastering Your Morning Sunlight & Deep Sleep Cycle",
      artist: "Andrew Huberman",
      duration: "58:30",
      date: "Oct 2026",
      cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
      audioUrl: "https://cdn.freesound.org/previews/274/274178_5121236-lq.mp3"
    }
  },
  {
    id: "pod-3",
    title: "Tech Trends & AI Revolution 2026",
    host: "Zuu Tech Studio",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    description: "Deep dive into next-generation spatial computing, autonomous AI agents, and cutting-edge software architecture.",
    episodesCount: 35,
    category: "Technology",
    latestEpisode: {
      id: "pod-ep-3",
      title: "The Architecture of Ambient Audio & Agentic OS",
      artist: "Zuu Tech Studio",
      duration: "31:40",
      date: "Oct 2026",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
      audioUrl: "https://cdn.freesound.org/previews/530/530415_1648170-lq.mp3"
    }
  },
  {
    id: "pod-4",
    title: "TED Talks Daily: Creative Minds",
    host: "TED Audio Collective",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    description: "Inspiring thought experiments, global perspectives, and creative breakthroughs from leading researchers.",
    episodesCount: 250,
    category: "Education & Society",
    latestEpisode: {
      id: "pod-ep-4",
      title: "How Music Rewires Your Emotional Brain",
      artist: "TED Talks",
      duration: "24:12",
      date: "Oct 2026",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      audioUrl: "https://cdn.freesound.org/previews/384/384784_71257-lq.mp3"
    }
  }
];

