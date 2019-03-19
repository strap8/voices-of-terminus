const documentBase = [
  { value: "Blog", label: "Blog" },
  { value: "FanFiction", label: "FanFiction" },
  { value: "FanMade", label: "FanMade" },
  { value: "Guide", label: "Guide" },
  { value: "Lore", label: "Lore" },
  { value: "Review", label: "Review" },
  { value: "Other", label: "Other" },

  { value: "VR", label: "VR" },
  { value: "Guild", label: "Guild" },
  { value: "Game", label: "Game" },
  { value: "VoTShow", label: "VoTShow" },
  { value: "Community", label: "Community" },
  { value: "VoT", label: "VoT" }
];

export const articleSlectOptions = [
  { value: "Article", label: "Article", isFixed: true },
  ...documentBase.slice(0, 7)
];

export const newsletterSelectOptions = [
  { value: "Newsletter", label: "Newsletter", isFixed: true },
  ...documentBase.slice(8)
];

export const newsSelectOptions = [
  { value: "Article", label: "Article" },
  { value: "Newsletter", label: "Newsletter" },
  ...documentBase
];

export const eventTags = [
  { value: "Event", label: "Event", isFixed: true },
  { value: "Dungeon", label: "Dungeon" },
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Quest", label: "Quest" },
  { value: "Raid", label: "Raid" },
  { value: "VoTShow", label: "VoTShow" }
];

export const eventTagOptions = {
  Event: [],
  Dungeon: [],
  Explore: [],
  Group: [
    { value: "Epic", label: "Epic" },
    { value: "Harvesting", label: "Harvesting" },
    { value: "Crafting", label: "Crafting" },
    { value: "Perception", label: "Perception" },
    { value: "Faction", label: "Faction" }
  ],
  Quest: [],
  Raid: [],
  VoTShow: []
};

export const locationTags = [
  { value: "Locations", label: "Locations", isFixed: true },
  { value: "Thronefast", label: "Thronefast" }
];

export const galleryImageTags = [
  { value: "Dungeon", label: "Dungeon" },
  { value: "Explore", label: "Explore" },
  { value: "Group", label: "Group" },
  { value: "Quest", label: "Quest" },
  { value: "Raid", label: "Raid" }
];
