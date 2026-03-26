export const RARITIES = [1, 2, 3, 4, 5] as const
export type Rarity = (typeof RARITIES)[number]

export const VALKYRIE_RANKS = ["B", "A", "SP", "S"] as const
export type ValkyrieRank = (typeof VALKYRIE_RANKS)[number]

export const TYPES = ["Biologic", "Psychic", "Mecha", "Quantum", "Imaginary", "SD-type"] as const
export type Type = (typeof TYPES)[number]

export const ELEMENTS = ["Physical", "Fire", "Ice", "Lightning"] as const
export type Element = (typeof ELEMENTS)[number]

export const WEAPONS = [
  "Pistols",
  "Katanas",
  "Cannons",
  "Crosses",
  "Greatswords",
  "Gauntlets",
  "Scythes",
  "Lances",
  "Bows",
  "Chakrams",
  "Javelins",
  "Drive Cores",
  "Rapid-Shot Crossbows",
  "Rocket Hammers",
  "Chained Blades",
  "Trick Staves",
] as const
export type Weapon = (typeof WEAPONS)[number]

export const SPECIALIZATIONS = [
  "World Star",
  "Rite of Oblivion",
  "Wheel of Destiny",
  "Law of Ascension",
  "Grail of Infinitude",
] as const
export type Specialization = (typeof SPECIALIZATIONS)[number]

export const SPECIALIZATION_TAGS = [
  "Domain Resonance",
  "Omniscient Star",
  "Harmonized Shadow Star",
  "Heavenly Shift",
  "Symbiosis",
] as const
export type SpecializationTag = (typeof SPECIALIZATION_TAGS)[number]

export const STRENGTHS = [
  "Freeze",
  "Paralyze",
  "Stun",
  "Ignite",
  "Bleed",
  "Heavy ATK",
  "Weaken",
  "Impair",
  "Time Mastery",
  "Gather",
  "Heal",
  "Fast ATK",
  "Burst",
  "Aerial",
  "Summoned Entity",
] as const
export type Strength = (typeof STRENGTHS)[number]

export const SKILL_UNLOCKS = ["Default", "A", "S", "S1", "S2", "S3", "SS", "SS1", "SS2", "SS3", "SSS"] as const
export type SkillUnlock = (typeof SKILL_UNLOCKS)[number]

export const COSTUME_UNLOCKS = [
  "Default",
  "Story",
  "Event (Free)",
  "B-Chips",
  "Gacha",
  "Log-in",
  "Top-up Event",
  "Spending Event",
  "Battle Pass",
] as const
export type CostumeUnlock = (typeof COSTUME_UNLOCKS)[number]
