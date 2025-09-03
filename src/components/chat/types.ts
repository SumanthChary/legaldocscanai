export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  description?: string;
  organization_id: string;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  content?: string;
  message_type: 'text' | 'file' | 'analysis_share' | 'system';
  sender_id: string;
  created_at: string;
  file_url?: string;
  file_name?: string;
  analysis_id?: string;
  sender_profile: {
    username: string;
    avatar_url?: string;
  };
}

export interface TeamMember {
  id: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url?: string;
    email: string;
  };
}