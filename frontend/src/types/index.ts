export interface EventProgram {
  id: number;
  time_label: string;
  title_hi: string;
  title_en: string;
  description?: string;
  display_order: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title_hi: string;
  title_en: string;
  event_type: string;
  description_hi?: string;
  description_en?: string;
  start_date: string;
  end_date: string;
  venue: string;
  cover_image_url?: string;
  poster_url?: string;
  target_donation_amount: number;
  status: string;
  is_featured: boolean;
  programs?: EventProgram[];
}

export interface CommitteeMemberPublic {
  id: string;
  full_name: string;
  designation_title_hi?: string;
  designation_title_en?: string;
  custom_designation?: string;
  profile_photo_url?: string;
  bio?: string;
  display_order: number;
  social_links?: Record<string, any>;
}

export interface AnnouncementItem {
  id: string;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  image_url?: string;
  is_published: boolean;
  publish_at: string;
}

export interface PosterItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export interface PublicDonor {
  display_name: string;
  amount: number;
  purpose: string;
  donated_at: string;
  is_anonymous: boolean;
}

export interface TransparencySummary {
  total_verified_donations: number;
  total_approved_expenses: number;
  net_available_balance: number;
  target_fund_goal: number;
  fundraising_percentage: number;
  verified_donation_count: number;
  public_expense_count: number;
  event_summary: Record<string, any>;
  category_expenses: Record<string, number>;
}

export interface JanmashtamiBundle {
  event: EventItem;
  announcements: AnnouncementItem[];
  posters: PosterItem[];
  committee_members: CommitteeMemberPublic[];
  transparency: TransparencySummary;
  upi_settings: {
    upi_id: string;
    payee_name: string;
    donation_note: string;
  };
}

export interface DonationAdminItem {
  id: string;
  amount: number;
  purpose: string;
  payment_method: string;
  transaction_ref?: string;
  status: "PENDING" | "PAYMENT_SUBMITTED" | "VERIFIED" | "REJECTED" | "REFUNDED";
  is_anonymous: boolean;
  donor_message?: string;
  donor_name: string;
  donor_mobile: string;
  donor_email?: string;
  event_title?: string;
  receipt_number?: string;
  receipt_download_url?: string;
  collected_by_name?: string;
  verified_by_name?: string;
  verified_at?: string;
  created_at: string;
}

export interface ExpenseAdminItem {
  id: string;
  event_id?: string;
  category_id: number;
  amount: number;
  description: string;
  committee_member_id?: string;
  vendor_name?: string;
  payment_method: string;
  expense_date: string;
  status: "PENDING" | "APPROVED" | "VOIDED";
  category_name_hi?: string;
  category_name_en?: string;
  committee_member_name?: string;
  event_title?: string;
  created_by_name?: string;
  approved_by_name?: string;
  is_public_disclosed: boolean;
  notes?: string;
  created_at: string;
}
