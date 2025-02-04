const supabaseAdminClient = require('../supabaseClient')

module.exports = async function verifySupabaseAuth(req, res, next) {
    try {
        // Get authorization header from request
        const authHeader = req.headers.authorization || ''
        // Extract token from auth header
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        // Validate token with Supabase
        const { data, error } = await supabaseAdminClient.auth.getUser(token)

        if (error || !data?.user) {
            return res.status(401).json({ error: 'Invalid or expired token' })
        }

        // Attach user data to request object
        req.user = data.user
        
        next()
    } catch (err) {
        console.error('Error verifying Supabase token:', err)
        return res.status(401).json({ error: 'Unauthorized' })
    }
}