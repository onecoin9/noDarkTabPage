import { createClient } from '@supabase/supabase-js';
import type { Bookmark, AppSettings, Todo } from '../types';

const supabaseUrl = 'https://gbfdfpxlltnvnrsayrou.supabase.co';
const supabaseAnonKey = 'sb_publishable_7Bxn8fxjWr9AOCUVfflw0w_J9F2m-Zx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserSettings = {
  id: string;
  user_id: string;
  bookmarks: Bookmark[];
  settings: AppSettings;
  todos: Todo[];
  updated_at: string;
};
