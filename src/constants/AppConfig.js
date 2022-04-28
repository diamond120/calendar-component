/**
 * App Config File
 */

import { dev } from '../../config/env-vars'

export default {
    appLogo: '/static/logos/site-logo.png', // App Logo,
    darkLogo: '/static/logos/site-logo-dark.png', // dark logo
    appLogo2: '/static/logos/logo_login_signup.png', // App Logo 3 For Login & Signup Page
    brand: 'Workbetter-Duhs', // Brand Name
    copyrightText: 'Workbetter-Duhs © 2019 All Rights Reserved.', // Copyright Text
    enableUserTour: process.env.NODE_ENV === 'production', // Enable User Tour
    meetingTag: {
        critical: 'workbetter:critical:',
        personal: 'workbetter:personal:',
    },
    ...dev,
}
