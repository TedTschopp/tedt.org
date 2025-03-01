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

// Helper function to get discipline level for any career
function getCareerDiscipline(careerName) {
  if (
    careerData[careerName] &&
    typeof careerData[careerName].discipline !== "undefined"
  ) {
    return careerData[careerName].discipline;
  } else if (typeof careerDiscipline[careerName] !== "undefined") {
    return careerDiscipline[careerName];
  } else {
    // Default value for unknown careers
    return 0.0;
  }
}

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

// Remove supplemental careers array - we're only using core rulebook careers

// Define core functions before they are used

// Update the DM (Dice Modifier) based on characteristic value
function updateDM(stat) {
  const currentValue = parseInt(
    document.getElementById(`${stat}-current`).value
  );
  const baselineValue = parseInt(
    document.getElementById(`${stat}-baseline`).value
  );

  let currentDM = calculateDM(currentValue);
  let baselineDM = calculateDM(baselineValue);

  document.getElementById(`${stat}-dm-current`).textContent =
    formatDM(currentDM);
  document.getElementById(`${stat}-dm-baseline`).textContent =
    formatDM(baselineDM);

  if (stat === "wlt") {
    updateWealthDisplay();
  }
}

// Helper function to calculate DM based on characteristic value
function calculateDM(value) {
  // Use a simple lookup table for DM values
  const dmTable = [
    { max: 0, dm: -3 },
    { max: 2, dm: -2 },
    { max: 5, dm: -1 },
    { max: 8, dm: 0 },
    { max: 11, dm: 1 },
    { max: 14, dm: 2 },
  ];

  // Find the first range where value <= max
  for (const entry of dmTable) {
    if (value <= entry.max) {
      return entry.dm;
    }
  }

  // If we get here, value is greater than all ranges (15+)
  return 3;
}

// Helper function to format DM with plus sign
function formatDM(dm) {
  return dm >= 0 ? `+${dm}` : `${dm}`;
}

// Calculate total years across education and careers
function updateTotalYears() {
  // First get education years
  const educationRows = document.querySelectorAll("#education-container tr");
  let totalEducationYears = 0;

  educationRows.forEach((row) => {
    const yearsCell = row.querySelector("td[data-years]");
    if (yearsCell) {
      totalEducationYears +=
        parseInt(yearsCell.getAttribute("data-years")) || 0;
    }
  });

  // Then get career terms
  const careerRows = document.querySelectorAll("#careers-container tr");
  let totalCareerTerms = 0;

  careerRows.forEach((row) => {
    const termsCell = row.querySelector("td[data-terms]");
    if (termsCell) {
      totalCareerTerms += parseInt(termsCell.getAttribute("data-terms")) || 0;
    }
  });

  // Calculate biological age: base + education years + (career terms * 4)
  if (document.getElementById("age")) {
    // Base age at character creation is 18
    const biologicalAge = 18 + totalEducationYears + totalCareerTerms * 4;
    document.getElementById("age").value = biologicalAge;
  }
}

// Calculate total terms across all careers
function updateTotalTerms() {
  const careerRows = document.querySelectorAll("#careers-container tr");
  let totalTerms = 0;

  careerRows.forEach((row) => {
    const termsCell = row.querySelector("td[data-terms]");
    if (termsCell) {
      totalTerms += parseInt(termsCell.getAttribute("data-terms")) || 0;
    }
  });

  // Update display of total terms somewhere if needed
  if (document.getElementById("totalTerms")) {
    document.getElementById("totalTerms").textContent = totalTerms;
  }

  // Update age including education years
  updateTotalYears();
}

// Update specialization options based on selected skill
function updateSpecializationOptions(sourceId = "skillSearch") {
  // Get the skill name from the appropriate input field
  const skillName = document.getElementById(sourceId).value;
  if (!skillName) return;
  
  const specList = document.getElementById("specialization-list");
  if (!specList) {
    console.error("Specialization datalist not found");
    return;
  }
  
  // Clear existing options
  specList.innerHTML = "";
  
  // Add specializations if they exist for this skill
  if (skillSpecializations[skillName]?.length > 0) {
    const sortedSpecs = [...skillSpecializations[skillName]].sort();
    console.log(`Adding ${sortedSpecs.length} specializations for ${skillName}`);
    
    sortedSpecs.forEach(spec => {
      const option = document.createElement("option");
      option.value = spec;
      specList.appendChild(option);
    });
  }
}

// Update assignments dropdown when career is selected
function updateAssignments() {
  const careerName = document.getElementById("careerName").value;
  const assignmentSelect = document.getElementById("careerAssignment");

  console.log("Selected career:", careerName); // Debug line

  // Clear current options
  assignmentSelect.innerHTML = '<option value="">Select Assignment...</option>';

  // First try exact match
  if (careerData[careerName] && careerData[careerName].assignments) {
    populateAssignments(careerName, assignmentSelect);
  }
  // Try matching without the parenthesized number
  else {
    // Try to find a matching career name with numbering
    const careerKeys = Object.keys(careerData);
    const matchingCareer = careerKeys.find(
      (key) => key.startsWith(careerName + " (") || key === careerName
    );

    console.log("Matching career found:", matchingCareer); // Debug line

    if (matchingCareer && careerData[matchingCareer].assignments) {
      populateAssignments(matchingCareer, assignmentSelect);
    }
  }

  // Clear and update rank field
  document.getElementById("careerRank").value = "";
  suggestRank();
}

// Helper function to populate assignments dropdown
function populateAssignments(careerKey, selectElement) {
  const assignments = Object.keys(careerData[careerKey].assignments);

  // Sort assignments alphabetically
  const sortedAssignments = assignments.sort();

  sortedAssignments.forEach((assignment) => {
    const option = document.createElement("option");
    option.value = assignment;
    option.textContent = assignment;
    selectElement.appendChild(option);
  });

  console.log(`Added ${assignments.length} assignments for ${careerKey}`); // Debug line
}

// Suggest rank based on career and terms
function suggestRank() {
  const careerName = document.getElementById("careerName").value;
  const assignment = document.getElementById("careerAssignment").value;
  const careerTerms =
    parseInt(document.getElementById("careerTerms").value) || 1;
  const rankField = document.getElementById("careerRank");

  // Calculate recommended rank based on terms
  // Each term potentially allows you to advance one rank level
  let rankLevel = Math.min(careerTerms - 1, 6);
  if (rankLevel < 0) rankLevel = 0;

  // First try exact career name match
  let careerFound = careerData[careerName];

  // If not found, try to match without the parenthesized number
  if (!careerFound) {
    const careerKeys = Object.keys(careerData);
    const matchingCareer = careerKeys.find(
      (key) => key.startsWith(careerName + " (") || key === careerName
    );

    if (matchingCareer) {
      careerFound = careerData[matchingCareer];
    }
  }

  // Get proper rank title if available
  if (
    careerFound &&
    careerFound.assignments &&
    assignment &&
    careerFound.assignments[assignment] &&
    careerFound.assignments[assignment].ranks &&
    careerFound.assignments[assignment].ranks[rankLevel]
  ) {
    rankField.value =
      careerFound.assignments[assignment].ranks[rankLevel].title;
  } else {
    // Use generic rank structure
    rankField.value = genericRankStructure[rankLevel].title;
  }
}

// Helper functions for skill management
function getExistingSpecializations(skillName) {
  const existingSkills = document.querySelectorAll(".skill-name");
  const existingSpecs = [];

  for (let i = 0; i < existingSkills.length; i++) {
    if (existingSkills[i].getAttribute("data-skill") === skillName) {
      const spec = existingSkills[i].getAttribute("data-specialization");
      if (spec) {
        existingSpecs.push(spec);
      }
    }
  }

  return existingSpecs;
}

function updateExistingSkill(skillName, specialization, level) {
  const skillItems = document.querySelectorAll(".skill-item");

  for (let i = 0; i < skillItems.length; i++) {
    const skillNameElem = skillItems[i].querySelector(".skill-name");

    if (
      skillNameElem.getAttribute("data-skill") === skillName &&
      skillNameElem.getAttribute("data-specialization") === specialization
    ) {
      const input = skillItems[i].querySelector("input");
      input.value = level;
      return true;
    }
  }

  return false;
}

function addSingleSkill(skillName, specialization, skillLevel) {
  // Check if skill already exists
  const existingSkills = document.querySelectorAll(".skill-name");
  for (let i = 0; i < existingSkills.length; i++) {
    if (
      existingSkills[i].getAttribute("data-skill") === skillName &&
      existingSkills[i].getAttribute("data-specialization") === specialization
    ) {
      // Update existing skill instead of adding duplicate
      updateExistingSkill(skillName, specialization, skillLevel);
      return;
    }
  }

  const skillsContainer = document.getElementById("skills-container");
  const skillDiv = document.createElement("div");
  skillDiv.className = "skill-item";

  // Store both skill name and specialization separately for data handling
  skillDiv.innerHTML = `
                <span class="skill-name" data-skill="${skillName}" data-specialization="${
    specialization || ""
  }">
                    ${skillName}${
    specialization
      ? ` <span class="skill-specialization">(${specialization})</span>`
      : ""
  }
                </span>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control form-control-sm mx-2" value="${skillLevel}" min="0" style="width: 60px;">
                    <button class="btn btn-remove no-print" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

  skillsContainer.appendChild(skillDiv);
}

// Modified addSkill function to handle mandatory specializations
function addSkill() {
  const skillName = document.getElementById("skillSearch").value;
  const specialization = document.getElementById("specializationField").value;
  const skillLevel = document.getElementById("skillLevel").value || 0;

  if (!skillName) return;

  // Special handling for skills with mandatory specializations
  if (skillsWithMandatorySpecializations.includes(skillName)) {
    if (!specialization && skillSpecializations[skillName]?.length > 0) {
      alert(
        `The skill "${skillName}" requires you to select a specialization.`
      );
      return;
    }

    // Add all specializations at level 0, with the chosen one at the specified level
    const specs = skillSpecializations[skillName] || [];
    if (specs.length > 0) {
      // First check if any specializations already exist
      const existingSpecs = getExistingSpecializations(skillName);

      // If not all specializations exist yet, add all of them
      if (existingSpecs.length < specs.length) {
        for (const spec of specs) {
          if (!existingSpecs.includes(spec)) {
            // This is the chosen specialization, add it with the specified level
            if (spec === specialization) {
              addSingleSkill(skillName, spec, skillLevel);
            } else {
              // Other specializations are added at level 0
              addSingleSkill(skillName, spec, 0);
            }
          }
        }
        alert(
          `All specializations for ${skillName} have been added to your character sheet.`
        );
        return;
      } else {
        // If all specializations already exist, just update the level of the chosen one
        updateExistingSkill(skillName, specialization, skillLevel);
        return;
      }
    }
  }

  // Standard skill addition for non-special skills
  addSingleSkill(skillName, specialization, skillLevel);

  // Clear inputs
  document.getElementById("skillSearch").value = "";
  document.getElementById("specializationField").value = "";
  document.getElementById("skillLevel").value = 0;
}

// Add education to education table
function addEducation() {
  const educationType = document.getElementById("educationType").value;
  const educationYears = document.getElementById("educationYears").value;
  const educationOutcome = document.getElementById("educationOutcome").value;
  const educationBenefits = document.getElementById("educationBenefits").value;

  if (!educationType) {
    alert("Please select a pre-career option");
    return;
  }

  // Check if we already have 3 pre-career options
  const existingOptions = document
    .getElementById("education-container")
    .querySelectorAll("tr");
  if (existingOptions.length >= 3) {
    alert("You can only select up to three pre-career options.");
    return;
  }

  const educationContainer = document.getElementById("education-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td data-type="${educationType}">${educationType}</td>
                <td data-years="${educationYears}">${educationYears}</td>
                <td data-outcome="${educationOutcome}">${educationOutcome}</td>
                <td data-benefits="${educationBenefits}">${educationBenefits}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                </td>
            `;

  educationContainer.appendChild(row);

  // Clear inputs
  document.getElementById("educationType").selectedIndex = 0;
  document.getElementById("educationYears").value = "4";
  document.getElementById("educationOutcome").selectedIndex = 0;
  document.getElementById("educationBenefits").value = "";

  // Update button state and age
  updateEducationButtons();
  updateTotalYears();
}

// Function to update the Add Education button state
function updateEducationButtons() {
  const existingOptions = document
    .getElementById("education-container")
    .querySelectorAll("tr");
  const addButton = document.getElementById("addEducationBtn");

  if (existingOptions.length >= 3) {
    addButton.disabled = true;
    addButton.classList.add("disabled");
  } else {
    addButton.disabled = false;
    addButton.classList.remove("disabled");
  }
}

// Update saveCharacter function to save the new fields
function saveCharacter() {
  const character = {
    // Basic info
    charName: document.getElementById("charName").value,
    species: document.getElementById("species").value,
    age: document.getElementById("age").value,

    // Get pre-career options details (updated from education)
    preCareerOptions: Array.from(
      document.getElementById("education-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          type: cells[0].getAttribute("data-type") || cells[0].textContent,
          years: cells[1].getAttribute("data-years") || cells[1].textContent,
          outcome:
            cells[2].getAttribute("data-outcome") || cells[2].textContent,
          benefits:
            cells[3].getAttribute("data-benefits") || cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Get career details with assignments
    careers: Array.from(
      document.getElementById("careers-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return null;
        return {
          career: cells[0].getAttribute("data-career") || cells[0].textContent,
          assignment:
            cells[1].getAttribute("data-assignment") || cells[1].textContent,
          terms: cells[2].getAttribute("data-terms") || cells[2].textContent,
          rank: cells[3].getAttribute("data-rank") || cells[3].textContent,
          benefits:
            cells[4].getAttribute("data-benefits") || cells[4].textContent,
        };
      })
      .filter((c) => c !== null),

    // Characteristics - updated to store both current and baseline
    characteristics: {
      str: {
        current: document.getElementById("str-current").value,
        baseline: document.getElementById("str-baseline").value,
      },
      dex: {
        current: document.getElementById("dex-current").value,
        baseline: document.getElementById("dex-baseline").value,
      },
      end: {
        current: document.getElementById("end-current").value,
        baseline: document.getElementById("end-baseline").value,
      },
      int: {
        current: document.getElementById("int-current").value,
        baseline: document.getElementById("int-baseline").value,
      },
      edu: {
        current: document.getElementById("edu-current").value,
        baseline: document.getElementById("edu-baseline").value,
      },
      soc: {
        current: document.getElementById("soc-current").value,
        baseline: document.getElementById("soc-baseline").value,
      },

      // Additional characteristics
      psi: {
        current: document.getElementById("psi-current").value,
        baseline: document.getElementById("psi-baseline").value,
      },
      wlt: {
        current: document.getElementById("wlt-current").value,
        baseline: document.getElementById("wlt-baseline").value,
      },
      lck: {
        current: document.getElementById("lck-current").value,
        baseline: document.getElementById("lck-baseline").value,
      },
      mrl: {
        current: document.getElementById("mrl-current").value,
        baseline: document.getElementById("mrl-baseline").value,
      },
      sty: {
        current: document.getElementById("sty-current").value,
        baseline: document.getElementById("sty-baseline").value,
      },
      std: {
        current: document.getElementById("std-current").value,
        baseline: document.getElementById("std-baseline").value,
      },
      chr: {
        current: document.getElementById("chr-current").value,
        baseline: document.getElementById("chr-baseline").value,
      },
    },

    // Finances
    credits: document.getElementById("credits").value,
    pension: document.getElementById("pension").value,
    debt: document.getElementById("debt").value,
    cashOnHand: document.getElementById("cashOnHand").value,
    livingCosts: document.getElementById("livingCosts").value,
    shipPayments: document.getElementById("shipPayments").value,
    shipCosts: document.getElementById("shipCosts").value, // Add this line

    // Notes
    notes: document.getElementById("notes").value,

    // Skills
    skills: Array.from(document.querySelectorAll(".skill-item")).map((item) => {
      const skillElement = item.querySelector(".skill-name");
      return {
        name: skillElement.getAttribute("data-skill"),
        specialization: skillElement.getAttribute("data-specialization"),
        level: item.querySelector("input").value,
      };
    }),

    // Weapons
    weapons: Array.from(
      document.getElementById("weapons-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 7) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          skill: cells[2].querySelector("input")
            ? cells[2].querySelector("input").value
            : "",
          damage: cells[3].textContent,
          range: cells[4].textContent,
          weight: cells[5].textContent,
          magazine: cells[6].textContent,
        };
      })
      .filter((w) => w !== null),

    // Armor
    armor: Array.from(
      document.getElementById("armor-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          rating: cells[1].textContent,
          tl: cells[2].textContent,
          radiation: cells[3].textContent,
        };
      })
      .filter((a) => a !== null),

    // Equipment
    equipment: Array.from(
      document.getElementById("equipment-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) return null;
        return {
          name: cells[0].textContent,
          tl: cells[1].textContent,
          mass: cells[2].textContent,
          cost: cells[3].textContent,
        };
      })
      .filter((e) => e !== null),

    // Skills in Training
    trainingSkills: Array.from(
      document.getElementById("training-skills-container").querySelectorAll("tr")
    )
      .map(row => {
        const weeksComplete = row.querySelector('input').value;
        return {
          skill: row.querySelector('td[data-skill]').getAttribute('data-skill'),
          specialization: row.querySelector('td[data-specialization]').getAttribute('data-specialization'),
          weeksRequired: row.querySelector('td[data-weeks-required]').getAttribute('data-weeks-required'),
          weeksComplete: weeksComplete
        };
      })
  };

  try {
    localStorage.setItem("traveller-character", JSON.stringify(character));
    alert("Character saved successfully!");
  } catch (e) {
    console.error("Save failed:", e);
    alert("Failed to save character. Error: " + e.message);
  }
}

// Load character from localStorage - consolidated version
function loadCharacter() {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Basic info
    document.getElementById("charName").value = character.charName || "";
    document.getElementById("species").value = character.species || "Human";
    document.getElementById("age").value = character.age || "18";

    // Clear existing education entries
    document.getElementById("education-container").innerHTML = "";

    // Load pre-career options data if it exists
    if (character.preCareerOptions && character.preCareerOptions.length) {
      character.preCareerOptions.forEach((optionData) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${optionData.type}">${optionData.type}</td>
                            <td data-years="${optionData.years}">${optionData.years}</td>
                            <td data-outcome="${optionData.outcome}">${optionData.outcome}</td>
                            <td data-benefits="${optionData.benefits}">${optionData.benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }
    // Legacy support for old education format
    else if (character.education && character.education.length) {
      character.education.forEach((educationData) => {
        // Convert old format to new format
        const outcome = educationData.qualification || "Graduate";
        const benefits = educationData.skills || "";

        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-type="${educationData.type}">${educationData.type}</td>
                            <td data-years="${educationData.years}">${educationData.years}</td>
                            <td data-outcome="${outcome}">${outcome}</td>
                            <td data-benefits="${benefits}">${benefits}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateEducationButtons(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("education-container").appendChild(row);
      });
    }

    // Update button state after loading
    updateEducationButtons();

    // Clear existing careers
    document.getElementById("careers-container").innerHTML = "";

    // Load careers if they exist
    if (character.careers && character.careers.length) {
      character.careers.forEach((careerData) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-career="${careerData.career}">${
          careerData.career
        }</td>
                            <td data-assignment="${
                              careerData.assignment || ""
                            }">${careerData.assignment || ""}</td>
                            <td data-terms="${careerData.terms}">${
          careerData.terms
        }</td>
                            <td data-rank="${careerData.rank}">${
          careerData.rank
        }</td>
                            <td data-benefits="${careerData.benefits}">${
          careerData.benefits
        }</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("careers-container").appendChild(row);
      });

      updateTotalTerms();
    }

    // Update to load characteristics with current and baseline values
    if (character.characteristics) {
      const chars = character.characteristics;

      // Load the main characteristics
      if (chars.str) {
        document.getElementById("str-current").value = chars.str.current || "7";
        document.getElementById("str-baseline").value =
          chars.str.baseline || "7";
      }
      if (chars.dex) {
        document.getElementById("dex-current").value = chars.dex.current || "7";
        document.getElementById("dex-baseline").value =
          chars.dex.baseline || "7";
      }
      if (chars.end) {
        document.getElementById("end-current").value = chars.end.current || "7";
        document.getElementById("end-baseline").value =
          chars.end.baseline || "7";
      }
      if (chars.int) {
        document.getElementById("int-current").value = chars.int.current || "7";
        document.getElementById("int-baseline").value =
          chars.int.baseline || "7";
      }
      if (chars.edu) {
        document.getElementById("edu-current").value = chars.edu.current || "7";
        document.getElementById("edu-baseline").value =
          chars.edu.baseline || "7";
      }
      if (chars.soc) {
        document.getElementById("soc-current").value = chars.soc.current || "7";
        document.getElementById("soc-baseline").value =
          chars.soc.baseline || "7";
      }

      // Load additional characteristics
      if (chars.psi) {
        document.getElementById("psi-current").value = chars.psi.current || "7";
        document.getElementById("psi-baseline").value =
          chars.psi.baseline || "7";
      }
      if (chars.wlt) {
        document.getElementById("wlt-current").value = chars.wlt.current || "7";
        document.getElementById("wlt-baseline").value =
          chars.wlt.baseline || "7";
      }
      if (chars.lck) {
        document.getElementById("lck-current").value = chars.lck.current || "7";
        document.getElementById("lck-baseline").value =
          chars.lck.baseline || "7";
      }
      if (chars.mrl) {
        document.getElementById("mrl-current").value = chars.mrl.current || "7";
        document.getElementById("mrl-baseline").value =
          chars.mrl.baseline || "7";
      }
      if (chars.sty) {
        document.getElementById("sty-current").value = chars.sty.current || "7";
        document.getElementById("sty-baseline").value =
          chars.sty.baseline || "7";
      }
      if (chars.std) {
        document.getElementById("std-current").value = chars.std.current || "7";
        document.getElementById("std-baseline").value =
          chars.std.baseline || "7";
      }
      if (chars.chr) {
        document.getElementById("chr-current").value = chars.chr.current || "7";
        document.getElementById("chr-baseline").value =
          chars.chr.baseline || "7";
      }

      // Update all DMs after setting characteristics
      updateDM("str");
      updateDM("dex");
      updateDM("end");
      updateDM("int");
      updateDM("edu");
      updateDM("soc");

      // Update DMs for additional characteristics
      updateDM("psi");
      updateDM("wlt");
      updateDM("lck");
      updateDM("mrl");
      updateDM("sty");
      updateDM("std");
      updateDM("chr");
    } else {
      // Legacy support for characters without dual values
      // ...load from old format if available...
    }

    // Finances
    document.getElementById("credits").value = character.credits || "0";
    document.getElementById("pension").value = character.pension || "0";
    document.getElementById("debt").value = character.debt || "0";
    document.getElementById("cashOnHand").value = character.cashOnHand || "0";
    document.getElementById("livingCosts").value = character.livingCosts || "0";
    document.getElementById("shipPayments").value =
      character.shipPayments || "0";
    document.getElementById("shipCosts").value = character.shipCosts || "0"; // Add this line

    // Notes
    document.getElementById("notes").value = character.notes || "";

    // Clear existing items
    document.getElementById("skills-container").innerHTML = "";
    document.getElementById("weapons-container").innerHTML = "";
    document.getElementById("armor-container").innerHTML = "";
    document.getElementById("equipment-container").innerHTML = "";

    // Skills with specialization support
    if (character.skills && character.skills.length) {
      character.skills.forEach((skill) => {
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-item";
        skillDiv.innerHTML = `
                            <span class="skill-name" data-skill="${
                              skill.name
                            }" data-specialization="${
          skill.specialization || ""
        }">
                                ${skill.name}${
          skill.specialization
            ? ` <span class="skill-specialization">(${skill.specialization})</span>`
            : ""
        }
                            </span>
                            <div class="d-flex align-items-center">
                                <input type="number" class="form-control form-control-sm mx-2" value="${
                                  skill.level
                                }" min="0" style="width: 60px;">
                                <button class="btn btn-remove no-print" onclick="this.parentElement.parentElement.remove()">×</button>
                            </div>
                        `;
        document.getElementById("skills-container").appendChild(skillDiv);
      });
    }

    // Weapons
    if (character.weapons && character.weapons.length) {
      character.weapons.forEach((weapon) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${weapon.name}</td>
                            <td>${weapon.tl || "-"}</td>
                            <td><input type="text" class="form-control form-control-sm" value="${
                              weapon.skill || ""
                            }" placeholder="Skill"></td>
                            <td>${weapon.damage || "-"}</td>
                            <td>${weapon.range || "-"}</td>
                            <td>${weapon.weight || "-"}</td>
                            <td>${weapon.magazine || "-"}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                            </td>
                        `;
        document.getElementById("weapons-container").appendChild(row);
      });
    }

    // Armor
    if (character.armor && character.armor.length) {
      character.armor.forEach((armor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${armor.name}</td>
                            <td>${armor.rating}</td>
                            <td>${armor.tl}</td>
                            <td>${armor.radiation}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("armor-container").appendChild(row);
      });
    }

    // Equipment
    if (character.equipment && character.equipment.length) {
      character.equipment.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${equipment.name}</td>
                            <td>${equipment.tl}</td>
                            <td>${equipment.mass}</td>
                            <td>${equipment.cost}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                        `;
        document.getElementById("equipment-container").appendChild(row);
      });
    }

    // Load training skills if they exist
    if (character.trainingSkills && character.trainingSkills.length) {
      character.trainingSkills.forEach(skill => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td data-skill="${skill.skill}">${skill.skill}</td>
          <td data-specialization="${skill.specialization}">${skill.specialization || "-"}</td>
          <td data-weeks-required="${skill.weeksRequired}">${skill.weeksRequired}</td>
          <td data-weeks-complete="${skill.weeksComplete}">
            <input type="number" class="form-control form-control-sm" value="${skill.weeksComplete}" min="0" max="${skill.weeksRequired}">
          </td>
          <td class="no-print">
            <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
            <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
          </td>
        `;
        document.getElementById("training-skills-container").appendChild(row);
      });
    }

    alert("Character loaded successfully!");
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
}

// Reset character sheet
function resetCharacter() {
  if (
    confirm(
      "Are you sure you want to reset the character sheet? All data will be lost."
    )
  ) {
    // Basic info
    document.getElementById("charName").value = "";
    document.getElementById("species").value = "Human";
    document.getElementById("age").value = "18";

    // Reset both current and baseline for all characteristics
    document.getElementById("str-current").value = "7";
    document.getElementById("str-baseline").value = "7";
    document.getElementById("dex-current").value = "7";
    document.getElementById("dex-baseline").value = "7";
    document.getElementById("end-current").value = "7";
    document.getElementById("end-baseline").value = "7";
    document.getElementById("int-current").value = "7";
    document.getElementById("int-baseline").value = "7";
    document.getElementById("edu-current").value = "7";
    document.getElementById("edu-baseline").value = "7";
    document.getElementById("soc-current").value = "7";
    document.getElementById("soc-baseline").value = "7";

    // Additional Characteristics
    document.getElementById("psi-current").value = "7";
    document.getElementById("psi-baseline").value = "7";
    document.getElementById("wlt-current").value = "7";
    document.getElementById("wlt-baseline").value = "7";
    document.getElementById("lck-current").value = "7";
    document.getElementById("lck-baseline").value = "7";
    document.getElementById("mrl-current").value = "7";
    document.getElementById("mrl-baseline").value = "7";
    document.getElementById("sty-current").value = "7";
    document.getElementById("sty-baseline").value = "7";
    document.getElementById("std-current").value = "7";
    document.getElementById("std-baseline").value = "7";
    document.getElementById("chr-current").value = "7";
    document.getElementById("chr-baseline").value = "7";

    // Update DMs
    updateDM("str");
    updateDM("dex");
    updateDM("end");
    updateDM("int");
    updateDM("edu");
    updateDM("soc");

    // Update DMs for additional characteristics
    updateDM("psi");
    updateDM("wlt");
    updateDM("lck");
    updateDM("mrl");
    updateDM("sty");
    updateDM("std");
    updateDM("chr");

    // Finances
    document.getElementById("credits").value = "0";
    document.getElementById("pension").value = "0";
    document.getElementById("debt").value = "0";
    document.getElementById("cashOnHand").value = "0";
    document.getElementById("livingCosts").value = "0";
    document.getElementById("shipPayments").value = "0";
    document.getElementById("shipCosts").value = "0"; // Add this line

    // Notes
    document.getElementById("notes").value = "";

    // Clear containers
    document.getElementById("skills-container").innerHTML = "";
    document.getElementById("weapons-container").innerHTML = "";
    document.getElementById("armor-container").innerHTML = "";
    document.getElementById("equipment-container").innerHTML = "";

    alert("Character sheet has been reset.");
  }
}

// Add shortcut for adding typical human characteristics
function setHumanCharacteristics() {
  document.getElementById("str-current").value = "7";
  document.getElementById("str-baseline").value = "7";
  document.getElementById("dex-current").value = "7";
  document.getElementById("dex-baseline").value = "7";
  document.getElementById("end-current").value = "7";
  document.getElementById("end-baseline").value = "7";
  document.getElementById("int-current").value = "7";
  document.getElementById("int-baseline").value = "7";
  document.getElementById("edu-current").value = "7";
  document.getElementById("edu-baseline").value = "7";
  document.getElementById("soc-current").value = "7";
  document.getElementById("soc-baseline").value = "7";

  updateDM("str");
  updateDM("dex");
  updateDM("end");
  updateDM("int");
  updateDM("edu");
  updateDM("soc");
}

// Export character to JSON file
function exportCharacter() {
  const characterData = localStorage.getItem("traveller-character");
  if (!characterData) {
    alert("No character data to export. Please save your character first.");
    return;
  }

  const character = JSON.parse(characterData);
  const characterName = character.charName || "traveller-character";
  const filename = `${characterName.replace(/\s+/g, "-")}.json`;

  const blob = new Blob([characterData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import character from JSON file
function importCharacter() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const characterData = e.target.result;
        localStorage.setItem("traveller-character", characterData);
        loadCharacter();
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import character. The file might be corrupted.");
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

// Add career to the careers table
function addCareer() {
  const careerName = document.getElementById("careerName").value;
  const careerAssignment = document.getElementById("careerAssignment").value;
  const careerTerms = document.getElementById("careerTerms").value;
  const careerRank = document.getElementById("careerRank").value;
  const careerBenefits = document.getElementById("careerBenefits").value;

  if (!careerName) {
    alert("Please select a career");
    return;
  }

  const careersContainer = document.getElementById("careers-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td data-career="${careerName}">${careerName}</td>
                <td data-assignment="${careerAssignment}">${careerAssignment}</td>
                <td data-terms="${careerTerms}">${careerTerms}</td>
                <td data-rank="${careerRank}">${careerRank}</td>
                <td data-benefits="${careerBenefits}">${careerBenefits}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
                </td>
            `;

  careersContainer.appendChild(row);

  // Clear inputs
  document.getElementById("careerName").selectedIndex = 0;
  document.getElementById("careerAssignment").innerHTML =
    '<option value="">Select Assignment...</option>';
  document.getElementById("careerTerms").value = "1";
  document.getElementById("careerRank").value = "";
  document.getElementById("careerBenefits").value = "";

  // Update total terms
  updateTotalTerms();
}

// Initialize career dropdown on page load
document.addEventListener("DOMContentLoaded", function () {
  // ...existing initialization code...

  // Add event listener for career terms to suggest ranks
  document.getElementById("careerTerms").addEventListener("input", suggestRank);
});

// Update the saveCharacter function to save careers with assignments
const originalSaveCharacter = saveCharacter;

saveCharacter = function () {
  const character = {
    // ...existing character data...

    // Get career details with assignments
    careers: Array.from(
      document.getElementById("careers-container").querySelectorAll("tr")
    )
      .map((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return null;
        return {
          career: cells[0].getAttribute("data-career") || cells[0].textContent,
          assignment:
            cells[1].getAttribute("data-assignment") || cells[1].textContent,
          terms: cells[2].getAttribute("data-terms") || cells[2].textContent,
          rank: cells[3].getAttribute("data-rank") || cells[3].textContent,
          benefits:
            cells[4].getAttribute("data-benefits") || cells[4].textContent,
        };
      })
      .filter((c) => c !== null),

    // ...rest of character data...
  };

  // Store in localStorage
  try {
    localStorage.setItem("traveller-character", JSON.stringify(character));
    alert("Character saved successfully!");
  } catch (e) {
    console.error("Save failed:", e);
    alert("Failed to save character. Error: " + e.message);
  }
};

// Update the loadCharacter function to load careers with assignments
const originalLoadCharacter = loadCharacter;

loadCharacter = function () {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Clear existing careers
    document.getElementById("careers-container").innerHTML = "";

    // Load careers if they exist
    if (character.careers && character.careers.length) {
      character.careers.forEach((careerData) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td data-career="${careerData.career}">${
          careerData.career
        }</td>
                            <td data-assignment="${
                              careerData.assignment || ""
                            }">${careerData.assignment || ""}</td>
                            <td data-terms="${careerData.terms}">${
          careerData.terms
        }</td>
                            <td data-rank="${careerData.rank}">${
          careerData.rank
        }</td>
                            <td data-benefits="${careerData.benefits}">${
          careerData.benefits
        }</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove(); updateTotalYears();">×</button>
                            </td>
                        `;
        document.getElementById("careers-container").appendChild(row);
      });

      updateTotalTerms();
    }

    // Call the original function to load other data
    originalLoadCharacter();
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
};

// ...existing code...

// Create a comprehensive initialization function
function initializeCharacterSheet() {
  console.log("Initializing character sheet...");

  // Initialize characteristics
  updateDM("str");
  updateDM("dex");
  updateDM("end");
  updateDM("int");
  updateDM("edu");
  updateDM("soc");

  // Initialize additional characteristics
  updateDM("psi");
  updateDM("wlt");
  updateDM("lck");
  updateDM("mrl");
  updateDM("sty");
  updateDM("std");
  updateDM("chr");

  // Create the skills datalist for autocomplete
  const skillSearch = document.getElementById("skillSearch");

  // First check if datalist already exists and remove if so
  const existingDatalist = document.getElementById("skill-list");
  if (existingDatalist) {
    existingDatalist.remove();
  }

  // Create fresh datalist
  const datalist = document.createElement("datalist");
  datalist.id = "skill-list";

  // Sort the skills alphabetically
  const sortedSkills = [...commonSkills].sort();

  sortedSkills.forEach((skill) => {
    const option = document.createElement("option");
    option.value = skill;
    datalist.appendChild(option);
  });

  document.body.appendChild(datalist);

  // Make sure the input element has the list attribute
  if (skillSearch) {
    skillSearch.setAttribute("list", "skill-list");
    console.log("Skills datalist connected to input");
  } else {
    console.error("Could not find skillSearch element");
  }

  // Add autocomplete handling for specializations
  const specializationField = document.getElementById("specializationField");

  // First check if specialization datalist already exists
  const existingSpecList = document.getElementById("specialization-list");
  if (existingSpecList) {
    existingSpecList.remove();
  }

  // Create fresh specialization datalist
  const specList = document.createElement("datalist");
  specList.id = "specialization-list";
  document.body.appendChild(specList);

  if (specializationField) {
    specializationField.setAttribute("list", "specialization-list");
    // Update specialization options when skill changes
    skillSearch.addEventListener("input", updateSpecializationOptions);
    console.log("Specialization datalist connected");
  } else {
    console.error("Could not find specializationField element");
  }

  // Populate career dropdown
  const careerSelect = document.getElementById("careerName");
  if (careerSelect) {
    // Clear existing options except the first one
    while (careerSelect.options.length > 1) {
      careerSelect.remove(1);
    }

    // Sort the careers alphabetically
    const sortedCareers = [...mgt2Careers].sort();

    // Add core rulebook careers
    sortedCareers.forEach((career) => {
      // Look for matching career in careerData (with or without numeric suffix)
      const careerKeys = Object.keys(careerData);
      const matchingCareer =
        careerKeys.find(
          (key) => key.startsWith(career + " (") || key === career
        ) || career;

      const option = document.createElement("option");
      // Use the exact key from careerData to maintain consistency
      option.value = matchingCareer;
      // Display the clean career name without the number
      option.textContent = matchingCareer.replace(/\s*\(\d+\)$/, "");
      careerSelect.appendChild(option);
    });

    // Make sure the event handler is properly attached
    careerSelect.addEventListener("change", updateAssignments);
  }

  // ...rest of initialization code...

  // Initialize pre-career options button state
  updateEducationButtons();
  updateWealthDisplay();
}

// Set up event listener to initialize the sheet when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  initializeCharacterSheet();
});

// Function to add a weapon to the weapons table - update this function
function addWeapon() {
  const weaponName = document.getElementById("weaponName").value;
  const weaponTL = document.getElementById("weaponTL").value;
  const weaponDamage = document.getElementById("weaponDamage").value;
  const weaponRange = document.getElementById("weaponRange").value;
  const weaponWeight = document.getElementById("weaponWeight").value;
  const weaponMagazine = document.getElementById("weaponMagazine").value;

  if (!weaponName) {
    alert("Please enter a weapon name");
    return;
  }

  const weaponsContainer = document.getElementById("weapons-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${weaponName}</td>
                <td>${weaponTL || "-"}</td>
                <td><input type="text" class="form-control form-control-sm" placeholder="Skill"></td>
                <td>${weaponDamage || "-"}</td>
                <td>${weaponRange || "-"}</td>
                <td>${weaponWeight || "-"}</td>
                <td>${weaponMagazine || "-"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  weaponsContainer.appendChild(row);

  // Clear inputs
  document.getElementById("weaponName").value = "";
  document.getElementById("weaponTL").value = "";
  document.getElementById("weaponDamage").value = "";
  document.getElementById("weaponRange").value = "";
  document.getElementById("weaponWeight").value = "";
  document.getElementById("weaponMagazine").value = "";
}

// Function to add armor to the armor table
function addArmor() {
  const armorName = document.getElementById("armorName").value;
  const armorRating = document.getElementById("armorRating").value;
  const armorTL = document.getElementById("armorTL").value;
  const armorRadiation = document.getElementById("armorRadiation").value;

  if (!armorName) {
    alert("Please enter armor name");
    return;
  }

  const armorContainer = document.getElementById("armor-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${armorName}</td>
                <td>${armorRating || "0"}</td>
                <td>${armorTL || "-"}</td>
                <td>${armorRadiation || "-"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  armorContainer.appendChild(row);

  // Clear inputs
  document.getElementById("armorName").value = "";
  document.getElementById("armorRating").value = "";
  document.getElementById("armorTL").value = "";
  document.getElementById("armorRadiation").value = "";
}

// Function to add equipment to the equipment table
function addEquipment() {
  const equipmentName = document.getElementById("equipmentName").value;
  const equipmentTL = document.getElementById("equipmentTL").value;
  const equipmentMass = document.getElementById("equipmentMass").value;
  const equipmentCost = document.getElementById("equipmentCost").value;

  if (!equipmentName) {
    alert("Please enter equipment name");
    return;
  }

  const equipmentContainer = document.getElementById("equipment-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${equipmentName}</td>
                <td>${equipmentTL || "-"}</td>
                <td>${equipmentMass || "0"}</td>
                <td>${equipmentCost || "0"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  equipmentContainer.appendChild(row);

  // Clear inputs
  document.getElementById("equipmentName").value = "";
  document.getElementById("equipmentTL").value = "";
  document.getElementById("equipmentMass").value = "";
  document.getElementById("equipmentCost").value = "";
}

// Functions for dice rolling
function rollDice(number, sides) {
  let total = 0;
  let rolls = [];

  for (let i = 0; i < number; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  const resultDiv = document.getElementById("roll-result");
  resultDiv.innerHTML = `${number}D${sides}: ${total} (${rolls.join(", ")})`;
  return total;
}

function rollTask(target) {
  const roll = rollDice(2, 6);
  const resultDiv = document.getElementById("roll-result");

  if (roll >= target) {
    resultDiv.innerHTML += `<br><strong>SUCCESS!</strong> (Target: ${target}+)`;
  } else {
    resultDiv.innerHTML += `<br><strong>FAILURE.</strong> (Target: ${target}+)`;
  }
}

// Function to delete the saved character
function deleteCharacter() {
  if (
    confirm(
      "Are you sure you want to delete the saved character? This cannot be undone."
    )
  ) {
    try {
      localStorage.removeItem("traveller-character");
      alert("Character has been deleted.");
      // Optionally reset the form
      resetCharacter();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete character. Error: " + e.message);
    }
  }
}

// Function to sort select options alphabetically
function sortSelectOptions(selectElement) {
  // Get the options as an array
  const options = Array.from(selectElement.options);

  // Skip the first option (usually the default/prompt option)
  const firstOption = options.shift();

  // Sort the remaining options
  options.sort((a, b) => a.text.localeCompare(b.text));

  // Clear the select
  selectElement.innerHTML = "";

  // Add the first option back
  if (firstOption) {
    selectElement.add(firstOption);
  }

  // Add the sorted options
  options.forEach((option) => selectElement.add(option));
}

// Add this to initialization to ensure the pre-career options are sorted
document.addEventListener("DOMContentLoaded", function () {
  // Sort the education type dropdown options
  const educationTypeSelect = document.getElementById("educationType");
  if (educationTypeSelect) {
    sortSelectOptions(educationTypeSelect);
  }
});

// Add this function to your JavaScript
function updateWealthDisplay() {
  const currentValue = document.getElementById("wlt-current").value;
  const baselineValue = document.getElementById("wlt-baseline").value;

  document.getElementById("wlt-baseline-display").textContent = baselineValue;
  document.getElementById("wlt-baseline").value = baselineValue;
}

// Update the original initialization function to call updateWealthDisplay
const originalInitializeFunction = initializeCharacterSheet;
initializeCharacterSheet = function () {
  originalInitializeFunction();
  updateWealthDisplay();
};

// Ensure baseline value stays in sync when DMs are updated
const originalUpdateDM = updateDM;
updateDM = function (stat) {
  originalUpdateDM(stat);
  if (stat === "wlt") {
    updateWealthDisplay();
  }
};

// Add this improved function to your JavaScript section
function updateWealthInfoDisplay() {
  const currentWealthLevel =
    parseInt(document.getElementById("wlt-current").value) || 0;
  const baselineWealthLevel =
    parseInt(document.getElementById("wlt-baseline").value) || 0;

  // Define the wealth values mapping
  const wealthValues = {
    0: "0",
    1: "100",
    2: "200",
    3: "400",
    4: "800",
    5: "1,200",
    6: "1,500",
    7: "2,000",
    8: "3,000",
    9: "5,000",
    10: "7,500",
    11: "10,000",
    12: "12,500",
    13: "15,000",
    14: "17,500",
    15: "20,000",
  };

  // Update the current wealth level display
  const currentWealthInfo = document.querySelector(
    ".char-value:first-child .wealth-info"
  );
  if (currentWealthInfo) {
    currentWealthInfo.textContent = `(Cr ${
      wealthValues[currentWealthLevel] || "?"
    })`;
  }

  // Update the baseline wealth level display
  const baselineWealthInfo = document.querySelector(
    ".char-value:last-child .wealth-info"
  );
  if (baselineWealthInfo) {
    baselineWealthInfo.textContent = `(Cr ${
      wealthValues[baselineWealthLevel] || "?"
    })`;
  }

  // Update the small reference text below inputs
  const currentWealthValueElem = document.getElementById(
    "current-wealth-value"
  );
  if (currentWealthValueElem) {
    currentWealthValueElem.textContent = `Cr ${
      wealthValues[currentWealthLevel] || "?"
    } available`;
  }

  const baselineWealthValueElem = document.getElementById(
    "baseline-wealth-value"
  );
  if (baselineWealthValueElem) {
    baselineWealthValueElem.textContent = `Cr ${
      wealthValues[baselineWealthLevel] || "?"
    } baseline`;
  }
}

// Make sure the document ready handler initializes the wealth display
document.addEventListener("DOMContentLoaded", function () {
  // Existing initialization code...

  // Initialize the wealth display
  updateWealthInfoDisplay();

  // Add explicit event listeners to both wealth inputs
  document
    .getElementById("wlt-current")
    .addEventListener("input", updateWealthInfoDisplay);
  document
    .getElementById("wlt-baseline")
    .addEventListener("input", updateWealthInfoDisplay);
});

// Function to add an augment to the augments table
function addAugment() {
  const augmentType = document.getElementById("augmentType").value;
  const augmentTL = document.getElementById("augmentTL").value;
  const augmentImprovement =
    document.getElementById("augmentImprovement").value;

  if (!augmentType) {
    alert("Please enter augment type");
    return;
  }

  const augmentsContainer = document.getElementById("augments-container");
  const row = document.createElement("tr");
  row.innerHTML = `
                <td>${augmentType}</td>
                <td>${augmentTL || "-"}</td>
                <td>${augmentImprovement || "-"}</td>
                <td class="no-print">
                    <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                </td>
            `;

  augmentsContainer.appendChild(row);

  // Clear inputs
  document.getElementById("augmentType").value = "";
  document.getElementById("augmentTL").value = "";
  document.getElementById("augmentImprovement").value = "";
}

// Update the save character function to save augments
const originalSaveCharacterWithAugments = saveCharacter;
saveCharacter = function () {
  // Get the existing character data if any
  let character = {};
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (savedCharacter) {
      character = JSON.parse(savedCharacter);
    }
  } catch (e) {
    console.error("Error parsing saved character:", e);
  }

  // Add augments to the character data
  character.augments = Array.from(
    document.getElementById("augments-container").querySelectorAll("tr")
  )
    .map((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 3) return null;
      return {
        type: cells[0].textContent,
        tl: cells[1].textContent,
        improvement: cells[2].textContent,
      };
    })
    .filter((a) => a !== null);

  // Call the original save function or store directly
  localStorage.setItem("traveller-character", JSON.stringify(character));
  alert("Character saved successfully!");
};

// Update the load character function to load augments
const originalLoadCharacterWithAugments = loadCharacter;
loadCharacter = function () {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Clear existing augments
    document.getElementById("augments-container").innerHTML = "";

    // Load augments if they exist
    if (character.augments && character.augments.length) {
      character.augments.forEach((augment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${augment.type}</td>
                            <td>${augment.tl || "-"}</td>
                            <td>${augment.improvement || "-"}</td>
                            <td class="no-print">
                                <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
                            </td>
                        `;
        document.getElementById("augments-container").appendChild(row);
      });
    }

    // Call the original load function to handle the rest
    originalLoadCharacterWithAugments();
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
};

// Modified function to initialize character sheet
function initializeCharacterSheet() {
  console.log("Initializing character sheet...");

  // Initialize characteristics DMs
  updateDM("str");
  updateDM("dex");
  updateDM("end");
  updateDM("int");
  updateDM("edu");
  updateDM("soc");

  // Initialize additional characteristics
  updateDM("psi");
  updateDM("wlt");
  updateDM("lck");
  updateDM("mrl");
  updateDM("sty");
  updateDM("std");
  updateDM("chr");

  // Create and attach the skills datalist for autocomplete
  initializeSkillsDropdown();

  // Initialize career dropdown
  initializeCareerDropdown();

  // Update education buttons
  updateEducationButtons();
  updateWealthDisplay();
  updateWealthInfoDisplay();
}

// New function to properly initialize the skills dropdown
function initializeSkillsDropdown() {
  console.log("Setting up skills autocomplete...");
  const skillSearch = document.getElementById("skillSearch");

  if (!skillSearch) {
    console.error("Could not find skillSearch element");
    return;
  }

  // Remove any existing datalist
  let existingDatalist = document.getElementById("skill-list");
  if (existingDatalist) {
    existingDatalist.remove();
  }

  // Create fresh datalist
  const datalist = document.createElement("datalist");
  datalist.id = "skill-list";

  // Sort the skills alphabetically
  const sortedSkills = [...commonSkills].sort();

  // Add options to datalist
  sortedSkills.forEach((skill) => {
    const option = document.createElement("option");
    option.value = skill;
    datalist.appendChild(option);
  });

  // Append the datalist to the document
  document.body.appendChild(datalist);

  // Connect input to datalist
  skillSearch.setAttribute("list", "skill-list");
  console.log(
    `Skills datalist connected to input (${sortedSkills.length} skills)`
  );

  // Set up specialization dropdown
  const specializationField = document.getElementById("specializationField");
  if (!specializationField) {
    console.error("Could not find specializationField element");
    return;
  }

  // Remove any existing specialization datalist
  existingDatalist = document.getElementById("specialization-list");
  if (existingDatalist) {
    existingDatalist.remove();
  }

  // Create fresh specialization datalist
  const specList = document.createElement("datalist");
  specList.id = "specialization-list";
  document.body.appendChild(specList);

  // Connect input to datalist
  specializationField.setAttribute("list", "specialization-list");

  // Add event listener to update specializations when skill changes
  skillSearch.addEventListener("input", function () {
    updateSpecializationOptions();
  });

  console.log("Specialization datalist connected");
}

// New function to properly initialize career dropdown
function initializeCareerDropdown() {
  console.log("Setting up career dropdown...");
  const careerSelect = document.getElementById("careerName");

  if (!careerSelect) {
    console.error("Could not find careerName select element");
    return;
  }

  // Clear existing options except the first one
  while (careerSelect.options.length > 1) {
    careerSelect.remove(1);
  }

  // Sort the careers alphabetically
  const sortedCareers = [...mgt2Careers].sort();

  console.log(`Adding ${sortedCareers.length} careers to dropdown`);

  // Add core rulebook careers
  sortedCareers.forEach((career) => {
    const option = document.createElement("option");
    option.value = career; // Use the exact career name as the value
    option.textContent = career;
    careerSelect.appendChild(option);
  });

  // Make sure the event handler is properly attached
  careerSelect.removeEventListener("change", updateAssignments); // Remove any existing listeners
  careerSelect.addEventListener("change", updateAssignments);
  console.log("Career dropdown initialized and event handler attached");
}

// Improved updateSpecializationOptions function
function updateSpecializationOptions() {
  const skillName = document.getElementById("skillSearch").value;
  const specList = document.getElementById("specialization-list");
  if (!specList) {
    console.error("Specialization datalist not found");
    return;
  }

  // Clear existing options
  while (specList.firstChild) {
    specList.removeChild(specList.firstChild);
  }

  // If we have specializations for this skill, add them
  if (skillSpecializations[skillName]) {
    const sortedSpecs = [...skillSpecializations[skillName]].sort();
    console.log(
      `Adding ${sortedSpecs.length} specializations for ${skillName}`
    );

    sortedSpecs.forEach((spec) => {
      const option = document.createElement("option");
      option.value = spec;
      specList.appendChild(option);
    });
  }
}

// Improved updateAssignments function
function updateAssignments() {
  const careerName = document.getElementById("careerName").value;
  const assignmentSelect = document.getElementById("careerAssignment");

  if (!assignmentSelect) {
    console.error("Could not find careerAssignment select element");
    return;
  }

  console.log(`Updating assignments for career: ${careerName}`);

  // Clear current options
  assignmentSelect.innerHTML = '<option value="">Select Assignment...</option>';

  // If no career is selected, just return
  if (!careerName) {
    return;
  }

  // Check if career exists in our data
  if (careerData[careerName] && careerData[careerName].assignments) {
    const assignments = Object.keys(careerData[careerName].assignments);
    console.log(`Found ${assignments.length} assignments for ${careerName}`);

    // Add assignments in alphabetical order
    assignments.sort().forEach((assignment) => {
      const option = document.createElement("option");
      option.value = assignment;
      option.textContent = assignment;
      assignmentSelect.appendChild(option);
    });
  } else {
    console.warn(`No assignment data found for career: ${careerName}`);
  }

  // Clear and update rank field
  document.getElementById("careerRank").value = "";
  suggestRank();
}

// Make sure initialization happens after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded, initializing character sheet...");
  setTimeout(initializeCharacterSheet, 0); // Use setTimeout to ensure DOM is ready
});

// ...existing code...

// Add this function to directly initialize the dropdown elements without relying on dynamic creation
function initializeDropdowns() {
  console.log("Initializing all dropdowns...");
  
  // Initialize skills dropdown first
  initializeSkillsDropdownDirect();
  
  // Initialize specializations
  initializeSpecializationsDropdownDirect();
  
  // Initialize career dropdown
  initializeCareerDropdownDirect();
  
  console.log("All dropdowns initialized");
}

// Direct initialization of skills dropdown that doesn't rely on dynamic creation
function initializeSkillsDropdownDirect() {
  console.log("Directly initializing skills dropdown...");
  
  const skillSearch = document.getElementById("skillSearch");
  if (!skillSearch) {
    console.error("Could not find skillSearch input element");
    return;
  }
  
  // Create datalist element
  let skillList = document.getElementById("skill-list");
  if (!skillList) {
    skillList = document.createElement("datalist");
    skillList.id = "skill-list";
    document.body.appendChild(skillList);
  } else {
    // Clear existing options
    skillList.innerHTML = "";
  }
  
  // Add options to datalist
  commonSkills.sort().forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    skillList.appendChild(option);
  });
  
  // Connect input to datalist
  skillSearch.setAttribute("list", "skill-list");
  console.log(`Skills dropdown initialized with ${commonSkills.length} options`);
}

// Direct initialization of specializations dropdown
function initializeSpecializationsDropdownDirect() {
  console.log("Directly initializing specialization dropdown...");
  
  const specField = document.getElementById("specializationField");
  if (!specField) {
    console.error("Could not find specializationField input element");
    return;
  }
  
  // Create datalist element
  let specList = document.getElementById("specialization-list");
  if (!specList) {
    specList = document.createElement("datalist");
    specList.id = "specialization-list";
    document.body.appendChild(specList);
  } else {
    // Clear existing options
    specList.innerHTML = "";
  }
  
  // Connect input to datalist
  specField.setAttribute("list", "specialization-list");
  
  // Add event listener for skill selection to update specializations
  const skillSearch = document.getElementById("skillSearch");
  if (skillSearch) {
    // Remove any existing listeners to prevent duplicates
    skillSearch.removeEventListener("input", updateSpecializationOptions);
    skillSearch.addEventListener("input", updateSpecializationOptions);
    console.log("Added event listener to update specializations");
  }
}

// Direct initialization of career dropdown
function initializeCareerDropdownDirect() {
  console.log("Directly initializing career dropdown...");
  
  const careerSelect = document.getElementById("careerName");
  if (!careerSelect) {
    console.error("Could not find careerName select element");
    return;
  }
  
  // Clear existing options except first one
  while (careerSelect.options.length > 1) {
    careerSelect.remove(1);
  }
  
  // Add career options in alphabetical order
  mgt2Careers.sort().forEach(career => {
    const option = document.createElement("option");
    option.value = career;
    option.textContent = career;
    careerSelect.appendChild(option);
  });
  
  // Add event listener for career selection
  careerSelect.removeEventListener("change", updateAssignments);
  careerSelect.addEventListener("change", updateAssignments);
  console.log(`Career dropdown initialized with ${mgt2Careers.length} options`);
}

// Modified updateSpecializationOptions function with better error handling
function updateSpecializationOptions() {
  const skillName = document.getElementById("skillSearch")?.value;
  if (!skillName) return;
  
  const specList = document.getElementById("specialization-list");
  if (!specList) {
    console.error("Specialization datalist not found");
    return;
  }
  
  // Clear existing options
  specList.innerHTML = "";
  
  // Add specializations if they exist for this skill
  if (skillSpecializations[skillName]?.length > 0) {
    const sortedSpecs = [...skillSpecializations[skillName]].sort();
    console.log(`Adding ${sortedSpecs.length} specializations for ${skillName}`);
    
    sortedSpecs.forEach(spec => {
      const option = document.createElement("option");
      option.value = spec;
      specList.appendChild(option);
    });
  }
}

// Make sure initialization happens immediately and reliably
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing character sheet components...");
  
  // Initialize all character sheet components
  initializeCharacterSheet();
  
  // Directly initialize all dropdowns to ensure they work
  initializeDropdowns();
  
  // Update education buttons initial state
  updateEducationButtons();
  
  // Initialize wealth display
  updateWealthInfoDisplay();
});

// Add a fallback initialization that runs after window load
window.addEventListener("load", function() {
  console.log("Window loaded, checking if dropdowns need reinitialization...");
  
  // Check if our dropdowns are working, if not reinitialize
  const skillList = document.getElementById("skill-list");
  const specList = document.getElementById("specialization-list");
  
  if (!skillList || !specList || skillList.children.length === 0) {
    console.log("Dropdowns not properly initialized, reinitializing now...");
    initializeDropdowns();
  }
});

// Fix the original initializeSkillsDropdown function to be more robust
function initializeSkillsDropdown() {
  // Now just call our direct initialization function
  initializeSkillsDropdownDirect();
}

// Fix the original initializeCareerDropdown function to be more robust
function initializeCareerDropdown() {
  // Now just call our direct initialization function
  initializeCareerDropdownDirect();
}

// Add function to create a new skill in training
function addTrainingSkill() {
  const skillName = document.getElementById("trainingSkillSearch").value;
  const specialization = document.getElementById("trainingSpecializationField").value;
  const weeksRequired = document.getElementById("trainingWeeks").value || 1;
  const weeksComplete = document.getElementById("trainingComplete").value || 0;

  if (!skillName) {
    alert("Please enter a skill name for training");
    return;
  }

  const trainingContainer = document.getElementById("training-skills-container");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td data-skill="${skillName}">${skillName}</td>
    <td data-specialization="${specialization}">${specialization || "-"}</td>
    <td data-weeks-required="${weeksRequired}">${weeksRequired}</td>
    <td data-weeks-complete="${weeksComplete}">
      <input type="number" class="form-control form-control-sm" value="${weeksComplete}" min="0" max="${weeksRequired}">
    </td>
    <td class="no-print">
      <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
      <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
    </td>
  `;

  trainingContainer.appendChild(row);

  // Clear inputs
  document.getElementById("trainingSkillSearch").value = "";
  document.getElementById("trainingSpecializationField").value = "";
  document.getElementById("trainingWeeks").value = "1";
  document.getElementById("trainingComplete").value = "0";
}

// Function to mark a skill training as complete
function completeTraining(button) {
  const row = button.closest('tr');
  
  // Get skill details from the row
  const skillName = row.querySelector('td[data-skill]').getAttribute('data-skill');
  const specialization = row.querySelector('td[data-specialization]').getAttribute('data-specialization');
  const weeksComplete = parseInt(row.querySelector('input').value);
  const weeksRequired = parseInt(row.querySelector('td[data-weeks-required]').getAttribute('data-weeks-required'));
  
  // Check if training is complete
  if (weeksComplete < weeksRequired) {
    alert(`Training not yet complete. ${weeksRequired - weeksComplete} week(s) remaining.`);
    return;
  }
  
  // Add the skill to the regular skills
  addSingleSkill(skillName, specialization !== "-" ? specialization : "", 1);
  
  // Remove the training row
  row.remove();
  
  alert(`Training complete! ${skillName}${specialization !== "-" ? ` (${specialization})` : ""} has been added to your skills.`);
}

// Update the save character function to include skills in training
const originalSaveCharacterWithTraining = saveCharacter;
saveCharacter = function() {
  // Get the existing character data or create new object
  let character = {};
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (savedCharacter) {
      character = JSON.parse(savedCharacter);
    }
  } catch (e) {
    console.error("Error parsing saved character:", e);
  }
  
  // Add training skills to the character data
  character.trainingSkills = Array.from(
    document.getElementById("training-skills-container").querySelectorAll("tr")
  )
    .map(row => {
      const weeksComplete = row.querySelector('input').value;
      return {
        skill: row.querySelector('td[data-skill]').getAttribute('data-skill'),
        specialization: row.querySelector('td[data-specialization]').getAttribute('data-specialization'),
        weeksRequired: row.querySelector('td[data-weeks-required]').getAttribute('data-weeks-required'),
        weeksComplete: weeksComplete
      };
    });
  
  // Store in localStorage
  localStorage.setItem("traveller-character", JSON.stringify(character));
  alert("Character saved successfully!");
};

// Update the load character function to load skills in training
const originalLoadCharacterWithTraining = loadCharacter;
loadCharacter = function() {
  try {
    const savedCharacter = localStorage.getItem("traveller-character");
    if (!savedCharacter) {
      alert("No saved character found.");
      return;
    }

    const character = JSON.parse(savedCharacter);

    // Clear existing training skills
    document.getElementById("training-skills-container").innerHTML = "";

    // Load training skills if they exist
    if (character.trainingSkills && character.trainingSkills.length) {
      character.trainingSkills.forEach(skill => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td data-skill="${skill.skill}">${skill.skill}</td>
          <td data-specialization="${skill.specialization}">${skill.specialization || "-"}</td>
          <td data-weeks-required="${skill.weeksRequired}">${skill.weeksRequired}</td>
          <td data-weeks-complete="${skill.weeksComplete}">
            <input type="number" class="form-control form-control-sm" value="${skill.weeksComplete}" min="0" max="${skill.weeksRequired}">
          </td>
          <td class="no-print">
            <button class="btn btn-remove" onclick="this.closest('tr').remove()">×</button>
            <button class="btn btn-secondary btn-sm ml-2" onclick="completeTraining(this)">Complete</button>
          </td>
        `;
        document.getElementById("training-skills-container").appendChild(row);
      });
    }

    // Call the original load function to handle the rest
    originalLoadCharacterWithTraining();
  } catch (e) {
    console.error("Load failed:", e);
    alert("Failed to load character. Error: " + e.message);
  }
};

// Initialize training skill search with same data as regular skill search
document.addEventListener("DOMContentLoaded", function() {
  // ...existing initialization code...
  
  // Connect the training skill inputs to the same skill lists
  const trainingSkillSearch = document.getElementById("trainingSkillSearch");
  const trainingSpecField = document.getElementById("trainingSpecializationField");
  
  if (trainingSkillSearch) {
    trainingSkillSearch.setAttribute("list", "skill-list");
    trainingSkillSearch.addEventListener("input", function() {
      updateTrainingSpecializationOptions();
    });
  }
  
  if (trainingSpecField) {
    trainingSpecField.setAttribute("list", "specialization-list");
  }
});

// Function to update specialization options for training skills
function updateTrainingSpecializationOptions() {
  updateSpecializationOptions("trainingSkillSearch");
}
