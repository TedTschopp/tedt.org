// Common Traveller Skills and data definitions
const commonSkills = [
  "Admin",
  "Advocate",
  "Animals",
  "Art: Creative",
  "Art: Performing",
  "Art: Presentation",
  "Astrogation",
  "Athletics",
  "Battle Dress",
  "Broker",
  "Carouse",
  "Deception",
  "Diplomat",
  "Drive",
  "Electronics",
  "Engineer",
  "Explosives",
  "Flyer",
  "Gambler",
  "Gun Combat",
  "Gunner",
  "Heavy Weapons",
  "Investigate",
  "Jack of all Trades",
  "Language",
  "Leadership",
  "Mechanic",
  "Medic",
  "Melee",
  "Navigation",
  "Persuade",
  "Pilot",
  "Profession: Colonist",
  "Profession: Freeloader",
  "Profession: Hostile Environment",
  "Profession: Spacer",
  "Profession: Sport",
  "Profession: Worker",
  "Recon",
  "Science: Life",
  "Science: Physical",
  "Science: Robotic",
  "Science: Social",
  "Science: Space",
  "Seafarer",
  "Stealth",
  "Steward",
  "Streetwise",
  "Survival",
  "Tactics",
  "Vacc Suit",
];

// Skills that require adding all specializations when one is learned
const skillsWithMandatorySpecializations = [
  "Art: Creative",
  "Art: Performing",
  "Art: Presentation",
  "Athletics",
  "Drive",
  "Flyer",
  "Gunner",
  "Heavy Weapons",
  "Melee",
  "Pilot",
  "Profession: Colonist",
  "Profession: Freeloader",
  "Profession: Hostile Environment",
  "Profession: Spacer",
  "Profession: Sport",
  "Profession: Worker",
  "Science: Life",
  "Science: Physical",
  "Science: Robotic",
  "Science: Social",
  "Science: Space",
  "Seafarer",
];

// Common specializations for skills
const skillSpecializations = {
  Animals: ["Handling", "Training", "Veterinary"],
  "Art: Creative": ["Exotic Media", "Visual Media"],
  "Art: Performing": ["Instrument", "Performer"],
  "Art: Presentation": ["Holography", "Write"],
  Athletics: ["Dexterity", "Endurance", "Strength"],
  Drive: ["Hovercraft", "Mole", "Tracked", "Walker", "Wheeled"],
  Electronics: ["Comms", "Computers", "Remote Ops", "Sensors"],
  Engineer: ["J-Drive", "Life Support", "M-Drive", "Power"],
  Flyer: ["Airship", "Grav", "Ornithopter", "Rotor", "Wing"],
  "Gun Combat": ["Archaic", "Energy", "Slug"],
  Gunner: ["Capital", "Ortillery", "Screen", "Turret"],
  "Heavy Weapons": ["Artillery", "Man Portable", "Vehicle"],
  Language: [
    "Anglic",
    "Aslan",
    "Oynprith",
    "Other",
    "Vargr",
    "Vilani",
    "Zdetl",
  ],
  Mechanic: ["Aircraft", "Gravitics", "Mole", "Walker", "Wheeled"],
  Melee: [
    "Blade",
    "Bludgeon",
    "Fencing",
    "Grapple",
    "Natural",
    "Striking",
    "Unarmed",
  ],
  Pilot: ["Capital Ships", "Small Craft", "Spacecraft"],
  "Profession: Colonist": ["Farming", "Ranching"],
  "Profession: Freeloader": ["Scrounging", "Security"],
  "Profession: Hostile Environment": [
    "Contaminant",
    "High-G",
    "Low-G",
    "Underwater",
  ],
  "Profession: Spacer": ["Belter", "Crewmember"],
  "Profession: Sport": [
    "Atmosphere Surfing",
    "Golf",
    "Motor Sport",
    "Racquet Sports",
    "Team Ball Sports",
    "Track & Field",
  ],
  "Profession: Worker": [
    "Armourer",
    "Biologicals",
    "Civil Engineering",
    "Construction",
    "Hydroponics",
    "Metalworking",
    "Polymers",
  ],
  "Science: Life": ["Biology", "Genetics", "Psionicology", "Xenology"],
  "Science: Physical": ["Chemistry", "Jumpspace Physics", "Physics"],
  "Science: Robotic": ["Cybernetics", "Robotics"],
  "Science: Social": [
    "Archaeology",
    "Economics",
    "History",
    "Linguistics",
    "Philosophy",
    "Psychology",
    "Sophontology",
  ],
  "Science: Space": ["Astronomy", "Cosmology", "Planetology"],
  Seafarer: ["Ocean Ships", "Personal", "Sail", "Submarine"],
  Tactics: ["Military", "Naval"],
};

// Career data structure with assignment-specific rank structures and discipline level
const careerData = {
  Agent: {
    discipline: 0.5, // Disciplined non-military
    assignments: {
      "Law Enforcement": {
        ranks: [
          { title: "Rookie", level: 0 },
          { title: "Corporal", level: 1 },
          { title: "Sergeant", level: 2 },
          { title: "Detective", level: 3 },
          { title: "Lieutenant", level: 4 },
          { title: "Chief", level: 5 },
          { title: "Commissioner", level: 6 },
        ],
      },
      Intelligence: {
        ranks: [
          { title: " - ", level: 0 },
          { title: "Agent", level: 1 },
          { title: "Field Agent", level: 2 },
          { title: "Field Agent", level: 3 },
          { title: "Special Agent Director", level: 4 },
          { title: "Assistant Director", level: 5 },
          { title: "Director", level: 6 },
        ],
      },
      Corporate: {
        ranks: [
          { title: " - ", level: 0 },
          { title: "Agent", level: 1 },
          { title: "Field Agent", level: 2 },
          { title: "Field Agent", level: 3 },
          { title: "Special Agent Director", level: 4 },
          { title: "Assistant Director", level: 5 },
          { title: "Director", level: 6 },
        ],
      },
    },
  },
  Army: {
    discipline: 1.0, // Military
    assignments: {
      Support: {
        ranks: [
          { title: "Private", level: 0 },
          { title: "Lance Corporal", level: 1 },
          { title: "Corporal", level: 2 },
          { title: "Lance Sergeant", level: 3 },
          { title: "Sergeant", level: 4 },
          { title: "Gunnery Sergeant", level: 5 },
          { title: "Sergeant Major", level: 6 },
        ],
      },
      Infantry: {
        ranks: [
          { title: "Private", level: 0 },
          { title: "Lance Corporal", level: 1 },
          { title: "Corporal", level: 2 },
          { title: "Lance Sergeant", level: 3 },
          { title: "Sergeant", level: 4 },
          { title: "Gunnery Sergeant", level: 5 },
          { title: "Sergeant Major", level: 6 },
        ],
      },
      Cavalry: {
        ranks: [
          { title: "Private", level: 0 },
          { title: "Lance Corporal", level: 1 },
          { title: "Corporal", level: 2 },
          { title: "Lance Sergeant", level: 3 },
          { title: "Sergeant", level: 4 },
          { title: "Gunnery Sergeant", level: 5 },
          { title: "Sergeant Major", level: 6 },
        ],
      },
      "Support Officer": {
        ranks: [
          { title: "Lieutenant", level: 1 },
          { title: "Captain", level: 2 },
          { title: "Major", level: 3 },
          { title: "Lieutenant Colonel", level: 4 },
          { title: "Colonel", level: 5 },
          { title: "General", level: 6 },
        ],
      },
      "Infantry Officer": {
        ranks: [
          { title: "Lieutenant", level: 1 },
          { title: "Captain", level: 2 },
          { title: "Major", level: 3 },
          { title: "Lieutenant Colonel", level: 4 },
          { title: "Colonel", level: 5 },
          { title: "General", level: 6 },
        ],
      },
      "Cavalry Officer": {
        ranks: [
          { title: "Lieutenant", level: 1 },
          { title: "Captain", level: 2 },
          { title: "Major", level: 3 },
          { title: "Lieutenant Colonel", level: 4 },
          { title: "Colonel", level: 5 },
          { title: "General", level: 6 },
        ],
      },
    },
  },
  Citizen: {
    discipline: 0.0, // Other
    assignments: {
      Corporate: {
        ranks: [
          { title: "Intern", level: 0 },
          { title: "Junior Associate", level: 1 },
          { title: "Associate", level: 2 },
          { title: "Manager", level: 3 },
          { title: "Director", level: 4 },
          { title: "Vice President", level: 5 },
          { title: "CEO", level: 6 },
        ],
      },
      Worker: {
        ranks: [
          { title: "Apprentice", level: 0 },
          { title: "Journeyman", level: 1 },
          { title: "Professional", level: 2 },
          { title: "Master", level: 3 },
          { title: "Expert", level: 4 },
          { title: "Union Representative", level: 5 },
          { title: "Union Leader", level: 6 },
        ],
      },
      Colonist: {
        ranks: [
          { title: "Settler", level: 0 },
          { title: "Colonist", level: 1 },
          { title: "Specialist", level: 2 },
          { title: "Colony Coordinator", level: 3 },
          { title: "Colony Leader", level: 4 },
          { title: "Colony Governor", level: 5 },
          { title: "Planetary Governor", level: 6 },
        ],
      },
    },
  },
  Drifter: {
    discipline: 0.0, // Other
    assignments: {
      Barbarian: {
        ranks: [
          { title: "Outcast", level: 0 },
          { title: "Warrior", level: 1 },
          { title: "Weapon Master", level: 2 },
          { title: "Champion", level: 3 },
          { title: "Chieftain", level: 4 },
          { title: "Warlord", level: 5 },
          { title: "Tribal King", level: 6 },
        ],
      },
      Wanderer: {
        ranks: [
          { title: "Drifter", level: 0 },
          { title: "Wanderer", level: 1 },
          { title: "Explorer", level: 2 },
          { title: "Guide", level: 3 },
          { title: "Pathfinder", level: 4 },
          { title: "Nomad Leader", level: 5 },
          { title: "Nomad Chief", level: 6 },
        ],
      },
      Scavenger: {
        ranks: [
          { title: "Scrounger", level: 0 },
          { title: "Scavenger", level: 1 },
          { title: "Salvager", level: 2 },
          { title: "Recovery Expert", level: 3 },
          { title: "Salvage Master", level: 4 },
          { title: "Recovery Operations Chief", level: 5 },
          { title: "Salvage Fleet Commander", level: 6 },
        ],
      },
    },
  },
  Entertainer: {
    discipline: 0.0, // Other
    assignments: {
      Artist: {
        ranks: [
          { title: "Student", level: 0 },
          { title: "Apprentice", level: 1 },
          { title: "Professional", level: 2 },
          { title: "Recognized Artist", level: 3 },
          { title: "Famous Artist", level: 4 },
          { title: "Master Artist", level: 5 },
          { title: "Legendary Artist", level: 6 },
        ],
      },
      Journalist: {
        ranks: [
          { title: "Intern", level: 0 },
          { title: "Junior Reporter", level: 1 },
          { title: "Reporter", level: 2 },
          { title: "Correspondent", level: 3 },
          { title: "Editor", level: 4 },
          { title: "Senior Editor", level: 5 },
          { title: "Editor in Chief", level: 6 },
        ],
      },
      Performer: {
        ranks: [
          { title: "Extra", level: 0 },
          { title: "Featured Performer", level: 1 },
          { title: "Supporting Cast", level: 2 },
          { title: "Lead Performer", level: 3 },
          { title: "Star", level: 4 },
          { title: "Famous Star", level: 5 },
          { title: "Legendary Performer", level: 6 },
        ],
      },
    },
  },
  Marine: {
    discipline: 1.0, // Military
    assignments: {
      Support: {
        ranks: [
          { title: "Marine", level: 0 },
          { title: "Corporal", level: 1 },
          { title: "Sergeant", level: 2 },
          { title: "Gunnery Sergeant", level: 3 },
          { title: "Sergeant Major", level: 4 },
          { title: "Lieutenant", level: 5 },
          { title: "Captain", level: 6 },
        ],
      },
      "Star Marine": {
        ranks: [
          { title: "Star Marine", level: 0 },
          { title: "Lieutenant", level: 1 },
          { title: "Captain", level: 2 },
          { title: "Force Commander", level: 3 },
          { title: "Lt Colonel", level: 4 },
          { title: "Colonel", level: 5 },
          { title: "Brigadier", level: 6 },
        ],
      },
      "Ground Assault": {
        ranks: [
          { title: "Assault Trooper", level: 0 },
          { title: "Assault Leader", level: 1 },
          { title: "Strike Commander", level: 2 },
          { title: "Assault Commander", level: 3 },
          { title: "Strike Colonel", level: 4 },
          { title: "Assault Colonel", level: 5 },
          { title: "Assault General", level: 6 },
        ],
      },
    },
  },
  Merchant: {
    discipline: 0.5, // Disciplined non-military
    assignments: {
      "Merchant Marine": {
        ranks: [
          { title: "Crewman", level: 0 },
          { title: "Fourth Officer", level: 1 },
          { title: "Third Officer", level: 2 },
          { title: "Second Officer", level: 3 },
          { title: "First Officer", level: 4 },
          { title: "Captain", level: 5 },
          { title: "Fleet Captain", level: 6 },
        ],
      },
      "Free Trader": {
        ranks: [
          { title: "Trader", level: 0 },
          { title: "Senior Trader", level: 1 },
          { title: "Independent Merchant", level: 2 },
          { title: "Ship Owner", level: 3 },
          { title: "Fleet Owner", level: 4 },
          { title: "Merchant Prince", level: 5 },
          { title: "Trade Magnate", level: 6 },
        ],
      },
      Broker: {
        ranks: [
          { title: "Apprentice", level: 0 },
          { title: "Broker", level: 1 },
          { title: "Senior Broker", level: 2 },
          { title: "Deal-Maker", level: 3 },
          { title: "Master Broker", level: 4 },
          { title: "Trade Consortium Leader", level: 5 },
          { title: "Merchant Guild Master", level: 6 },
        ],
      },
    },
  },
  Navy: {
    discipline: 1.0, // Military
    assignments: {
      "Line/Crew": {
        ranks: [
          { title: "Crewman", level: 0 },
          { title: "Ensign", level: 1 },
          { title: "Lieutenant", level: 2 },
          { title: "Lt Commander", level: 3 },
          { title: "Commander", level: 4 },
          { title: "Captain", level: 5 },
          { title: "Admiral", level: 6 },
        ],
      },
      Engineering: {
        ranks: [
          { title: "Engineer's Mate", level: 0 },
          { title: "Junior Engineer", level: 1 },
          { title: "Engineer", level: 2 },
          { title: "Senior Engineer", level: 3 },
          { title: "Chief Engineer", level: 4 },
          { title: "Fleet Engineer", level: 5 },
          { title: "Engineering Admiral", level: 6 },
        ],
      },
      Flight: {
        ranks: [
          { title: "Flight Cadet", level: 0 },
          { title: "Flight Ensign", level: 1 },
          { title: "Flight Lieutenant", level: 2 },
          { title: "Flight Commander", level: 3 },
          { title: "Wing Commander", level: 4 },
          { title: "Air Group Commander", level: 5 },
          { title: "Fleet Air Marshal", level: 6 },
        ],
      },
    },
  },
  Scout: {
    discipline: 0.5, // Disciplined non-military
    assignments: {
      Courier: {
        ranks: [
          { title: "Courier", level: 0 },
          { title: "Senior Courier", level: 1 },
          { title: "Relay Operator", level: 2 },
          { title: "Relay Supervisor", level: 3 },
          { title: "Courier Chief", level: 4 },
          { title: "Courier Director", level: 5 },
          { title: "XBoat Network Commander", level: 6 },
        ],
      },
      Surveyor: {
        ranks: [
          { title: "Survey Technician", level: 0 },
          { title: "Surveyor", level: 1 },
          { title: "Senior Surveyor", level: 2 },
          { title: "Survey Leader", level: 3 },
          { title: "Lead Surveyor", level: 4 },
          { title: "Senior Survey Director", level: 5 },
          { title: "Head of Survey Operations", level: 6 },
        ],
      },
      Explorer: {
        ranks: [
          { title: "Scout", level: 0 },
          { title: "Scout Explorer", level: 1 },
          { title: "Senior Scout", level: 2 },
          { title: "Lead Explorer", level: 3 },
          { title: "Exploration Director", level: 4 },
          { title: "Senior Scout Director", level: 5 },
          { title: "Scout Commander", level: 6 },
        ],
      },
    },
  },
  Truther: {
    discipline: 0.0, // Other - not formally disciplined
    assignments: {
      Truther: {
        ranks: [
          { title: "Harmless Crank", level: 0 },
          { title: "Typical minor truther", level: 1 },
          { title: "Notable Figure", level: 2 },
          { title: "Highly Influential Truther", level: 3 },
          { title: "Legend or Public menace", level: 4 },
        ],
      },
    },
  },
  Believer: {
    discipline: 0.5, // Disciplined non-military (religious orders)
    assignments: {
      "Mainstream Believer": {
        ranks: [
          { title: "Lay Person", level: 0 },
          { title: "Initiate ", level: 1 },
          { title: "Lay Preacher", level: 2 },
          { title: "Priest/Priestess", level: 3 },
          { title: "Senior Priest/Priestess", level: 4 },
          { title: "Bishop", level: 5 },
          { title: "Archbishop", level: 6 },
        ],
      },
      "Missionary/Humanitarian": {
        ranks: [
          { title: "Junior Project Worker", level: 0 },
          { title: "Project Worker", level: 1 },
          { title: "Team Leader", level: 2 },
          { title: "Project Leader", level: 3 },
          { title: "Project Coordinator", level: 4 },
          { title: "Department Director", level: 5 },
          { title: "Director", level: 6 },
        ],
      },
      "Holy Warrior": {
        ranks: [
          { title: "Hopeful", level: 0 },
          { title: "Fighter", level: 1 },
          { title: "Combat Leader", level: 2 },
          { title: "Force Commander", level: 3 },
          { title: "Area Commander", level: 4 },
          { title: "Movement Sub-Leader", level: 5 },
          { title: "Movement Leader", level: 6 },
        ],
      },
    },
  },
  Noble: {
    discipline: 0.0, // Other
    assignments: {
      Administrator: {
        ranks: [
          { title: "Courtier", level: 0 },
          { title: "Administrator", level: 1 },
          { title: "Minister", level: 2 },
          { title: "Advisor", level: 3 },
          { title: "High Advisor", level: 4 },
          { title: "Planetary Governor", level: 5 },
          { title: "Sector Governor", level: 6 },
        ],
      },
      Diplomat: {
        ranks: [
          { title: "Attaché", level: 0 },
          { title: "Diplomat", level: 1 },
          { title: "Consul", level: 2 },
          { title: "Ambassador", level: 3 },
          { title: "High Ambassador", level: 4 },
          { title: "Plenipotentiary", level: 5 },
          { title: "Imperial Legate", level: 6 },
        ],
      },
      Dilettante: {
        ranks: [
          { title: "Wastrel", level: 0 },
          { title: "Ingénue", level: 1 },
          { title: "Socialite", level: 2 },
          { title: "Minor Noble", level: 3 },
          { title: "Prominent Noble", level: 4 },
          { title: "High Noble", level: 5 },
          { title: "Imperial Peer", level: 6 },
        ],
      },
    },
  },

  Rogue: {
    discipline: 0.0, // Other
    assignments: {
      Thief: {
        ranks: [
          { title: "Pickpocket", level: 0 },
          { title: "Burglar", level: 1 },
          { title: "Skilled Thief", level: 2 },
          { title: "Master Thief", level: 3 },
          { title: "Heist Planner", level: 4 },
          { title: "Master Planner", level: 5 },
          { title: "Legendary Thief", level: 6 },
        ],
      },
      Enforcer: {
        ranks: [
          { title: "Thug", level: 0 },
          { title: "Bodyguard", level: 1 },
          { title: "Enforcer", level: 2 },
          { title: "Lieutenant", level: 3 },
          { title: "Underboss", level: 4 },
          { title: "Consigliere", level: 5 },
          { title: "Boss", level: 6 },
        ],
      },
      Corsair: {
        ranks: [
          { title: "Pirate", level: 0 },
          { title: "Experienced Pirate", level: 1 },
          { title: "Leading Hand", level: 2 },
          { title: "Ship's Master", level: 3 },
          { title: "Notorious Captain", level: 4 },
          { title: "Pirate Lord", level: 5 },
          { title: "Pirate King", level: 6 },
        ],
      },
    },
  },

  Scholar: {
    discipline: 0.0, // Other
    assignments: {
      Researcher: {
        ranks: [
          { title: "Research Assistant", level: 0 },
          { title: "Junior Researcher", level: 1 },
          { title: "Researcher", level: 2 },
          { title: "Senior Researcher", level: 3 },
          { title: "Assistant Professor", level: 4 },
          { title: "Associate Professor", level: 5 },
          { title: "Professor", level: 6 },
        ],
      },
      "Field Researcher": {
        ranks: [
          { title: "Field Assistant", level: 0 },
          { title: "Field Researcher", level: 1 },
          { title: "Experienced Researcher", level: 2 },
          { title: "Senior Researcher", level: 3 },
          { title: "Lead Researcher", level: 4 },
          { title: "Research Director", level: 5 },
          { title: "World-Renowned Expert", level: 6 },
        ],
      },
    },
  },
  Prisoner: {
    discipline: 0.0, // Other
    assignments: {
      Inmate: {
        ranks: [
          { title: "-", level: 0 },
          { title: "-", level: 1 },
          { title: "-", level: 2 },
          { title: "-", level: 3 },
          { title: "-", level: 4 },
          { title: "-", level: 5 },
          { title: "-", level: 6 },
        ],
      },
      Thug: {
        ranks: [
          { title: "-", level: 0 },
          { title: "-", level: 1 },
          { title: "-", level: 2 },
          { title: "-", level: 3 },
          { title: "-", level: 4 },
          { title: "-", level: 5 },
          { title: "-", level: 6 },
        ],
      },
      Fixer: {
        ranks: [
          { title: "-", level: 0 },
          { title: "-", level: 1 },
          { title: "-", level: 2 },
          { title: "-", level: 3 },
          { title: "-", level: 4 },
          { title: "-", level: 5 },
          { title: "-", level: 6 },
        ],
      },
    },
  },
  Psionic: {
    discipline: 0.0, // Other
    assignments: {
      "Wild Talent": {
        ranks: [
          { title: " - ", level: 0 },
          { title: "Survivor", level: 1 },
          { title: "Survivor", level: 2 },
          { title: "Witch", level: 3 },
          { title: "Witch", level: 4 },
          { title: "Witch", level: 5 },
          { title: "Witch", level: 6 },
        ],
      },
      Adept: {
        ranks: [
          { title: " - ", level: 0 },
          { title: "Initiate", level: 1 },
          { title: "Initiate", level: 2 },
          { title: "Acolyte", level: 3 },
          { title: "Acolyte", level: 4 },
          { title: "Acolyte", level: 5 },
          { title: "Master", level: 6 },
        ],
      },
      "Psi-Warrior": {
        ranks: [
          { title: "Marine", level: 0 },
          { title: "Marine", level: 1 },
          { title: "Captain", level: 2 },
          { title: "Captain", level: 3 },
          { title: "Captain", level: 4 },
          { title: "Force Commander", level: 5 },
          { title: "Force Commander", level: 6 },
        ],
      },
    },
  },
};



// Generic data for supplemental careers
const genericRankStructure = [
  { title: "Novice", level: 0 },
  { title: "Apprentice", level: 1 },
  { title: "Journeyman", level: 2 },
  { title: "Expert", level: 3 },
  { title: "Master", level: 4 },
  { title: "Senior Master", level: 5 },
  { title: "Grandmaster", level: 6 },
];

// MGT2 Careers from the rulebook
const mgt2Careers = [
  "Agent",
  "Army",
  "Citizen",
  "Drifter",
  "Entertainer",
  "Marine",
  "Merchant",
  "Navy",
  "Noble",
  "Rogue",
  "Scholar",
  "Scout",
  "Psionic",
  "Prisoner",
  "Truther",
  "Believer",
];
