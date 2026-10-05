export type Track = 'chatbot' | 'vision' | 'generator' | 'automation'
export type Year  = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Post-Graduate'

export interface Registration {
  id:                  string
  name:                string
  email:               string
  phone:               string
  college:             string
  year:                Year
  track:               Track
  referral_code:       string
  referred_by:         string | null
  ai_welcome_message:  string | null
  created_at:          string
  updated_at:          string
}

export interface RegistrationFormData {
  name:         string
  email:        string
  phone:        string
  college:      string
  year:         Year
  track:        Track
  referralCode: string
  terms:        boolean
}

export interface RegisterApiRequest {
  name:          string
  email:         string
  phone:         string
  college:       string
  year:          Year
  track:         Track
  referral_code: string  // THEIR own generated code
  referred_by?:  string  // code from person who referred them
}

export interface RegisterApiResponse {
  success:           boolean
  referral_code?:    string
  ai_welcome?:       string
  error?:            string
  field_errors?:     Record<string, string>
}

export interface LeaderboardEntry {
  referral_code:  string
  name:           string
  college:        string
  referral_count: number
}

export interface ReferralStats {
  total_referred: number
  rank:           number
}

export interface DashboardData {
  registration:   Registration
  stats:          ReferralStats
  leaderboard:    LeaderboardEntry[]
}

export interface WorkshopConfig {
  total_seats:        number
  workshop_date:      string
  workshop_time:      string
  workshop_topic:     string
  registration_open:  boolean
  seats_taken:        number
}

export interface TrackMeta {
  id:    Track
  emoji: string
  label: string
  desc:  string
}

export interface RewardTier {
  min:   number
  emoji: string
  label: string
  perk:  string
}
