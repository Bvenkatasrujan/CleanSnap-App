import { supabase } from '../config/supabase';

export const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getMyReports = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateStatus = async (reportId, status) => {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId)
    .select()
    .single();
  if (error) throw error;
  return data;
};