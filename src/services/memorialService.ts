import { supabase } from './supabase';
import { Memorial } from '../types/memorial';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export class MemorialService {
  // Upload image to Supabase Storage
  static async uploadImage(uri: string, fileName: string): Promise<string | null> {
    try {
      console.log('Starting image upload...', fileName);
      
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      
      const arrayBuffer = decode(base64);
      
      const { data, error } = await supabase.storage
        .from('memorial-images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('memorial-images')
        .getPublicUrl(fileName);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Get all memorials (public - everyone can see)
  static async getAllMemorials(): Promise<Memorial[]> {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(memorial => ({
        id: memorial.id,
        name: memorial.name,
        birthYear: memorial.birth_year,
        deathYear: memorial.death_year,
        description: memorial.description || '',
        profileImage: memorial.profile_image || undefined,
        createdBy: memorial.created_by,
        createdAt: new Date(memorial.created_at),
      }));
    } catch (error) {
      console.error('Error fetching memorials:', error);
      throw error;
    }
  }

  // Get memorials created by current user
  static async getUserMemorials(userId: string): Promise<Memorial[]> {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(memorial => ({
        id: memorial.id,
        name: memorial.name,
        birthYear: memorial.birth_year,
        deathYear: memorial.death_year,
        description: memorial.description || '',
        profileImage: memorial.profile_image || undefined,
        createdBy: memorial.created_by,
        createdAt: new Date(memorial.created_at),
      }));
    } catch (error) {
      console.error('Error fetching user memorials:', error);
      throw error;
    }
  }

  // Get memorial by ID
  static async getMemorialById(id: string): Promise<Memorial | null> {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        birthYear: data.birth_year,
        deathYear: data.death_year,
        description: data.description || '',
        profileImage: data.profile_image || undefined,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Error fetching memorial:', error);
      return null;
    }
  }

  // Create new memorial (requires authentication)
  static async createMemorial(memorial: Omit<Memorial, 'id' | 'createdAt' | 'createdBy'>, userId: string): Promise<Memorial> {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .insert({
          name: memorial.name,
          birth_year: memorial.birthYear,
          death_year: memorial.deathYear,
          description: memorial.description,
          profile_image: memorial.profileImage,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        birthYear: data.birth_year,
        deathYear: data.death_year,
        description: data.description || '',
        profileImage: data.profile_image || undefined,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Error creating memorial:', error);
      throw error;
    }
  }

  // Check if user owns memorial
  static async userOwnsMemorial(memorialId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('created_by')
        .eq('id', memorialId)
        .single();

      if (error || !data) return false;

      return data.created_by === userId;
    } catch (error) {
      console.error('Error checking memorial ownership:', error);
      return false;
    }
  }
}