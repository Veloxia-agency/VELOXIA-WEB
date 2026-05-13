export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  business_type: string
  city: string
  status: LeadStatus
  revenue_potential: number
  source: string
  created_at: string
  last_contact?: string
  notes?: string
}

export interface Client extends Lead {
  contract_value: number
  services: string[]
  start_date: string
}
