const { createClient } = require('@supabase/supabase-js')

// Supabase project URL and service-role key
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// This client can verify tokens with full admin permissions
const supabaseAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

module.exports = supabaseAdminClient
