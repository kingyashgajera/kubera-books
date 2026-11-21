import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const OWNER_EMAIL = process.env.OWNER_EMAIL || ''

export async function getOrCreateOrganization() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check existing membership
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(*)')
    .eq('user_id', user.id)
    .single()

  if (membership) {
    return membership.organizations
  }

  // Create new organization
  const isOwner = user.email === OWNER_EMAIL
  const orgName = user.email?.split('@')[0] || 'My Business'
  const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4)

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      name: orgName,
      slug,
      owner_id: user.id,
      is_owner_org: isOwner,
      subscription_status: isOwner ? 'free' : 'incomplete',
    })
    .select()
    .single()

  if (error || !org) throw new Error('Failed to create organization')

  // Add owner membership
  await supabase.from('organization_members').insert({
    organization_id: org.id,
    user_id: user.id,
    role: 'owner',
  })

  return org
}

export async function requireActiveSubscription() {
  const org = await getOrCreateOrganization()
  if (org.is_owner_org || org.subscription_status === 'active' || org.subscription_status === 'free') {
    return org
  }
  redirect('/billing')
}
