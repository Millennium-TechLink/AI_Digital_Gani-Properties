import { supabase } from './supabase.js';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  submittedAt: string;
}

function transformLead(data: any): Lead {
  return {
    id: data.id,
    name: data.name,
    email: data.email || '',
    phone: data.phone,
    interest: data.interest || 'General Property Interest',
    message: data.message || '',
    submittedAt: data.submitted_at,
  };
}

export async function createLead(input: {
  name: string;
  email?: string;
  phone: string;
  interest?: string;
  message?: string;
  page?: string;
  propertyTitle?: string;
}): Promise<Lead> {
  const row = {
    name: input.name,
    email: input.email || null,
    phone: input.phone,
    interest: input.interest || 'General Property Interest',
    message: input.message || null,
    page: input.page || null,
    property_title: input.propertyTitle || null,
  };

  const { data, error } = await supabase.from('leads').insert(row).select().single();
  if (error || !data) {
    console.error('Error creating lead:', error);
    throw error || new Error('Failed to create lead');
  }

  return transformLead(data);
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return (data || []).map(transformLead);
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}
