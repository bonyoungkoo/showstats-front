export interface Pitch {
  name: string;
  speed: number;
  control: number;
  movement: number;
}
export interface PlayerCard {
  _id: string;
  uuid: string;
  name: string;
  ovr: number;
  img: string;
  baked_img: string;
  series: string;
  display_position: string;
  display_secondary_positions: string;
  bat_hand: string;
  throw_hand: string;
  rarity: string;
  team: string;
  team_short_name: string;
  age: number;
  height: string;
  weight: string;
  born: string;
  jersey_number: string;
  contact_left: number;
  contact_right: number;
  power_left: number;
  power_right: number;
  speed: number;
  fielding_ability: number;
  arm_strength: number;
  arm_accuracy: number;
  reaction_time: number;
  blocking: number;
  baserunning_ability: number;
  baserunning_aggression: number;
  plate_vision: number;
  plate_discipline: number;
  batting_clutch: number;
  bunting_ability: number;
  drag_bunting_ability: number;
  hitting_durability: number;
  pitch_velocity: number;
  pitch_control: number;
  pitch_movement: number;
  pitching_clutch: number;
  pitches?: Pitch[];
  stamina: number;
  is_hitter: boolean;
  locations: string[];
  event: boolean;
  is_live_set: boolean;
  is_sellable: boolean;
  has_augment: boolean;
  has_matchup: boolean;
  has_rank_change: boolean;
  new_rank: number;
  trend: string | null;
  stars: string | null;
  augment_text: string | null;
  augment_end_date: string | null;
  short_description: string | null;
  series_texture_name: string;
  series_year: number;
  set_name: string;
  type: string;
  ui_anim_index: number;
  hit_rank_image?: string;
  fielding_rank_image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayersResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: PlayerCard[];
}

export interface UsePlayerCardsOptions {
  page?: number;
  limit?: number;
  search?: string;
  rarity?: string;
  position?: string;
}
