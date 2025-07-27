export interface Pitch {
  name: string;
  speed: [number, number];
  control: [number, number];
  movement: [number, number];
}

export type Quirk =
  | "Bad Ball Hitter"
  | "Breaking Ball Hitter"
  | "Break Outlier"
  | "Outlier I"
  | "Outlier II"
  | "Catcher Pop Time"
  | "Pinch Hitter"
  | "Pressure Cooker"
  | "Stopper"
  | "Rally Monkey"
  | "Road Warrior"
  | "Table Setter"
  | "Homebody"
  | "Day Player"
  | "Night Player"
  | "Fighter"
  | "First-Pitch Hitter"
  | "Situational Hitter"
  | "Dead Red"
  | "Unfazed";

export interface PlayerCardSearchFilters {
  name?: string;
  bat_hand?: string;
  throw_hand?: string;
  display_position?: string | string[];
  display_secondary_positions?: string | string[];

  // 타격
  contact_left: [number, number];
  contact_right: [number, number];
  power_left: [number, number];
  power_right: [number, number];
  plate_vision: [number, number];
  plate_discipline: [number, number];
  batting_clutch: [number, number];
  bunting_ability: [number, number];
  drag_bunting_ability: [number, number];
  hitting_durability: [number, number];

  // 수비
  fielding_ability: [number, number];
  arm_strength: [number, number];
  arm_accuracy: [number, number];
  reaction_time: [number, number];
  blocking: [number, number];

  // 주루
  speed: [number, number];
  baserunning_ability: [number, number];
  baserunning_aggression: [number, number];

  // 투구
  stamina: [number, number];
  hits_per_bf: [number, number];
  k_per_bf: [number, number];
  bb_per_bf: [number, number];
  hr_per_bf: [number, number];
  pitch_velocity?: [number, number];
  pitch_control?: [number, number];
  pitch_movement?: [number, number];
  pitching_clutch?: [number, number];

  pitches?: Pitch[];
  height?: [number, number];
  series?: string[];
  locations?: string[];
  quirks?: Quirk[];
}

export const playerCardFilterKeys: (keyof PlayerCardSearchFilters)[] = [
  "name",
  "bat_hand",
  "throw_hand",
  "display_position",
  "display_secondary_positions",
  "pitches",
  "height",
  "series",
  "quirks",
];
