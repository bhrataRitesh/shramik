export interface ShramikData {
  _id: string;
  title: string;
  name: string;
  tradeCategory: string;
  skills: string[];
  phone: string;
  image: { url: string; filename: string }[];
  price: number;
  dailyWageRate: number;
  hourlyRate: number;
  experienceYears: number;
  description: string;
  voiceBioSnippet?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  city: string;
  locality: string;
  address: string;
  distanceKm?: number;
  isAvailableToday: boolean;
  eShramVerified: boolean;
  aadhaarVerified: boolean;
  skillCertified: boolean;
  tier: "basic" | "verified" | "certified" | "master";
  rating: number;
  totalReviews: number;
  completedJobs: number;
  crewSize: number;
}

export const TRADE_CATEGORIES = [
  { id: "all", label: "All Trades", icon: "Sparkles" },
  { id: "mason", label: "Mason & Tile Fitter", icon: "BrickWall", count: 18 },
  { id: "carpenter", label: "Carpenter & Woodwork", icon: "Hammer", count: 14 },
  { id: "electrician", label: "Electrician", icon: "Zap", count: 21 },
  { id: "painter", label: "Painter & Finisher", icon: "Paintbrush", count: 16 },
  { id: "plumber", label: "Plumber & Sanitary", icon: "Wrench", count: 12 },
  { id: "welder", label: "Welder & Fabricator", icon: "Flame", count: 9 },
  { id: "helper", label: "General Labor & Helper", icon: "HardHat", count: 35 },
  { id: "thekedar", label: "Contractor & Crew Lead", icon: "Users", count: 8 },
];

export const MOCK_SHRAMIKS: ShramikData[] = [
  {
    _id: "shramik-001",
    title: "Master Mason & Tile Specialist",
    name: "Rameshwar Prasad",
    tradeCategory: "mason",
    skills: ["Bricklaying", "Marble & Tile Fitting", "Waterproofing", "Plaster"],
    phone: "+91 98765 43210",
    image: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        filename: "mason_rameshwar",
      },
    ],
    price: 850,
    dailyWageRate: 850,
    hourlyRate: 130,
    experienceYears: 14,
    description: "14 years of expert masonry work. Specializes in luxury Italian marble, bathroom slope correction, and seismic brick structure construction. Has managed multi-story residential builds.",
    voiceBioSnippet: "Hello, I am Rameshwar Prasad. I have 14 years of experience as a master mason in marble, granite, and structural brickwork.",
    location: {
      type: "Point",
      coordinates: [77.6387, 12.9121], // HSR Layout, Bengaluru
    },
    city: "Bengaluru",
    locality: "HSR Layout, Sector 2",
    address: "Near 27th Main Road, HSR Layout, Bengaluru",
    distanceKm: 1.8,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "master",
    rating: 4.9,
    totalReviews: 48,
    completedJobs: 92,
    crewSize: 1,
  },
  {
    _id: "shramik-002",
    title: "Licensed Residential & Commercial Electrician",
    name: "Sunil Kumar Verma",
    tradeCategory: "electrician",
    skills: ["Full Home Rewiring", "MCB Box Installation", "Inverter Setup", "Short Circuit Repair"],
    phone: "+91 98450 11223",
    image: [
      {
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        filename: "electrician_sunil",
      },
    ],
    price: 800,
    dailyWageRate: 800,
    hourlyRate: 150,
    experienceYears: 9,
    description: "ITI certified wireman with 9+ years experience. Swift emergency service for home power outages, 3-phase wiring, smart switch installations, and industrial earthing.",
    voiceBioSnippet: "Sunil Verma, certified electrician. Full home wiring and inverter installation. Available on site within 1 hour.",
    location: {
      type: "Point",
      coordinates: [77.6101, 12.9352], // Koramangala, Bengaluru
    },
    city: "Bengaluru",
    locality: "Koramangala, 4th Block",
    address: "80 Feet Road, 4th Block, Koramangala",
    distanceKm: 3.2,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "certified",
    rating: 4.8,
    totalReviews: 36,
    completedJobs: 64,
    crewSize: 1,
  },
  {
    _id: "shramik-003",
    title: "Wood Artisan & Modular Kitchen Specialist",
    name: "Harish Mistri",
    tradeCategory: "carpenter",
    skills: ["Modular Kitchen", "Wardrobes", "Door Fitting", "Antique Wood Restoration"],
    phone: "+91 97112 33445",
    image: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80",
        filename: "carpenter_harish",
      },
    ],
    price: 900,
    dailyWageRate: 900,
    hourlyRate: 140,
    experienceYears: 12,
    description: "Expert furniture maker and interior woodwork specialist. Experience with Century ply, Greenply, laminate pressing, and Blum hydraulic soft-close fittings.",
    voiceBioSnippet: "Harish Mistri, carpenter. Modular kitchens, wardrobes, and high-precision door fittings.",
    location: {
      type: "Point",
      coordinates: [77.6412, 12.9719], // Indiranagar, Bengaluru
    },
    city: "Bengaluru",
    locality: "Indiranagar, 100ft Road",
    address: "Near Metro Pillar 84, Indiranagar",
    distanceKm: 4.5,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "master",
    rating: 4.95,
    totalReviews: 53,
    completedJobs: 110,
    crewSize: 1,
  },
  {
    _id: "shramik-004",
    title: "Interior & Exterior Wall Finish Maestro",
    name: "Deepak Yadav",
    tradeCategory: "painter",
    skills: ["Texture Painting", "Waterproof Primer", "Putty Finish", "Stenciling", "Wood Polish"],
    phone: "+91 99001 88776",
    image: [
      {
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        filename: "painter_deepak",
      },
    ],
    price: 700,
    dailyWageRate: 700,
    hourlyRate: 110,
    experienceYears: 8,
    description: "Equipped with airless sprayers and moisture meters. Clean, mess-free painting with Asian Paints Royale, tractor emulsion, and exterior Apex Ultima waterproofing.",
    voiceBioSnippet: "Deepak Yadav, painter. Clean putty finish and Royale paint application without stains.",
    location: {
      type: "Point",
      coordinates: [77.5855, 12.9254], // Jayanagar, Bengaluru
    },
    city: "Bengaluru",
    locality: "Jayanagar, 4th T Block",
    address: "Opposite Cosmopolitan Club, Jayanagar",
    distanceKm: 5.1,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: false,
    tier: "verified",
    rating: 4.7,
    totalReviews: 29,
    completedJobs: 43,
    crewSize: 1,
  },
  {
    _id: "shramik-005",
    title: "Master Plumber & Sanitaryware Expert",
    name: "Mohammad Aslam",
    tradeCategory: "plumber",
    skills: ["Concealed Pipe Fixing", "Bathroom Sanitaryware", "Motor Fitting", "Leakage Detection"],
    phone: "+91 91234 56780",
    image: [
      {
        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
        filename: "plumber_aslam",
      },
    ],
    price: 750,
    dailyWageRate: 750,
    hourlyRate: 125,
    experienceYears: 11,
    description: "Expert in CPVC, UPVC pipe routing, overhead tank cleaning, and Kohler/Jaquar fixture installation. Fast troubleshooting for wall seepages and low water pressure.",
    voiceBioSnippet: "Mohammad Aslam, plumber. Bathroom fittings, pipeline maintenance, and water motor repairs.",
    location: {
      type: "Point",
      coordinates: [77.6834, 12.9279], // Bellandur, Bengaluru
    },
    city: "Bengaluru",
    locality: "Bellandur Outer Ring Road",
    address: "Near Ecospace Tech Park, Bellandur",
    distanceKm: 6.4,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "certified",
    rating: 4.85,
    totalReviews: 41,
    completedJobs: 78,
    crewSize: 1,
  },
  {
    _id: "shramik-006",
    title: "Construction Crew Lead (6-Person Team)",
    name: "Satish Chauhan Contractor",
    tradeCategory: "thekedar",
    skills: ["Roof Slab Casting", "Foundation Excavation", "Demolition", "Full Structure Labor"],
    phone: "+91 96543 21098",
    image: [
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
        filename: "thekedar_satish",
      },
    ],
    price: 4500,
    dailyWageRate: 4500,
    hourlyRate: 600,
    experienceYears: 16,
    description: "Organized crew of 2 Senior Masons and 4 Skilled Laborers (Beldars). Equipped with concrete vibrator, scaffolding, and mixer machine. Punctual and disciplined.",
    voiceBioSnippet: "Satish Chauhan. 6-person experienced crew for structural casting, foundation work, and full building contracts.",
    location: {
      type: "Point",
      coordinates: [77.6074, 12.9784], // MG Road / Shivajinagar
    },
    city: "Bengaluru",
    locality: "Shivajinagar / Central",
    address: "Near Russell Market, Bengaluru",
    distanceKm: 7.2,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "master",
    rating: 4.9,
    totalReviews: 24,
    completedJobs: 51,
    crewSize: 6,
  },
  {
    _id: "shramik-007",
    title: "Strong & Reliable Site Laborer",
    name: "Mukesh Sahani",
    tradeCategory: "helper",
    skills: ["Material Loading/Unloading", "Concrete Mixing", "Debris Clearance", "House Shifting"],
    phone: "+91 93456 78120",
    image: [
      {
        url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
        filename: "helper_mukesh",
      },
    ],
    price: 600,
    dailyWageRate: 600,
    hourlyRate: 90,
    experienceYears: 5,
    description: "Hardworking, disciplined helper. Experienced in cement handling, gravel carrying, tile loading, and site post-construction cleanup.",
    voiceBioSnippet: "Mukesh Sahani, helper. Material loading, concrete mixing, and residential house shifting assistance.",
    location: {
      type: "Point",
      coordinates: [77.5937, 12.9063], // BTM Layout
    },
    city: "Bengaluru",
    locality: "BTM Layout, 2nd Stage",
    address: "Near Silk Board Junction, BTM",
    distanceKm: 2.1,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: false,
    tier: "verified",
    rating: 4.75,
    totalReviews: 19,
    completedJobs: 37,
    crewSize: 1,
  },
  {
    _id: "shramik-008",
    title: "Arc & Argon Metal Fabricator",
    name: "Gopal Shrestha",
    tradeCategory: "welder",
    skills: ["Gate & Grill Fabrication", "Shed Roofing", "Iron Railing", "Argon Welding"],
    phone: "+91 94123 98765",
    image: [
      {
        url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
        filename: "welder_gopal",
      },
    ],
    price: 850,
    dailyWageRate: 850,
    hourlyRate: 130,
    experienceYears: 10,
    description: "Expert metal fabricator with own portable inverter welding machine. MS safety grills, balcony railings, stainless steel staircases, and tin sheds.",
    voiceBioSnippet: "Gopal Shrestha, welder. Safety grills, metal gates, and structural shed welding.",
    location: {
      type: "Point",
      coordinates: [77.5342, 12.9628], // Vijayanagar
    },
    city: "Bengaluru",
    locality: "Vijayanagar",
    address: "Near RPC Layout, Vijayanagar",
    distanceKm: 8.9,
    isAvailableToday: true,
    eShramVerified: true,
    aadhaarVerified: true,
    skillCertified: true,
    tier: "certified",
    rating: 4.8,
    totalReviews: 22,
    completedJobs: 40,
    crewSize: 1,
  },
];
