import type { ru } from './ru';

type Translations = typeof ru;

export const en: Translations = {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    all: 'All',
    noData: 'No data',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    or: 'or',
  },

  // Navigation
  nav: {
    directions: 'Directions',
    schedule: 'Schedule',
    rating: 'Rating',
    news: 'News',
    materials: 'Materials',
    map: 'Map',
    rewards: 'Rewards',
    profile: 'Profile',
    myTeams: 'My Teams',
    adminPanel: 'Admin Panel',
    logout: 'Log Out',
    backToSite: 'Back to site',
    skipToContent: 'Skip to content',
  },

  // Theme
  theme: {
    dark: 'Dark',
    light: 'Light',
    neon: 'Neon',
  },

  // Auth
  auth: {
    login: 'Sign In',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    registerLink: 'Register as SGTU student',
    guestHint: 'School student or guest?',
    telegramLink: 'Contact us on Telegram',
    loginError: 'Login failed. Check your email and password.',
    platformName: 'SGTU Phygital Activities Platform',
    firstName: 'First Name',
    lastName: 'Last Name',
    patronymic: 'Patronymic',
    studentId: 'Student ID',
    hasAccount: 'Already have an account?',
    enterPassword: 'Enter password',
  },

  // Home
  home: {
    welcome: 'Welcome to',
    subtitle: 'Book training sessions, join tournaments, level up your rating, and earn rewards. The unified platform for university phygital activities.',
    bookSession: 'Book a Session',
    allDirections: 'All Directions',
    myRating: 'My Rating',
    bookings: 'Bookings',
    viewSchedule: 'View schedule',
    myTeams: 'My Teams',
    manageTeams: 'Manage teams',
    nearestSlots: 'Upcoming Slots',
    schedule: 'Schedule',
    top5: 'Top 5 Rating',
    leaderboard: 'Leaderboard',
    noNews: 'No news',
    signUp: 'Sign up',
    session: 'Session',
    seats: 'seats',
    platformBadge: 'SGTU Platform',
    dkshTitle: 'Project with DKSh',
    dkshPartner: 'Partner',
    dkshDescription: 'Voluntary Cyber School — an educational project for developing digital competencies of students. Join our community!',
    dkshLink: 'DKSh Community on VK',
    quickMaterials: 'Materials',
    quickMaterialsDesc: 'Lectures, videos, links',
    quickMap: 'Campus Map',
    quickMapDesc: 'Find a venue',
    quickRewards: 'Rewards',
    quickRewardsDesc: 'Redeem points',
    quickSchedule: 'Schedule',
    quickScheduleDesc: 'Book sessions',
  },

  // News types
  newsTypes: {
    news: 'News',
    announcement: 'Announcement',
    result: 'Result',
  },

  // Rating levels
  ratingLevels: {
    elite: 'Elite',
    advanced: 'Advanced',
    active: 'Active',
    beginner: 'Beginner',
  },

  // Directions fallback
  directionsFallback: {
    cybersport: 'Esports',
    lasertag: 'Laser Tag',
    drones: 'Drones',
    playstation: 'PlayStation',
    computers: 'Computers',
  },

  // Admin sidebar
  admin: {
    dashboard: 'Dashboard',
    users: 'Users',
    directions: 'Directions',
    resources: 'Resources',
    locations: 'Locations',
    slots: 'Slots',
    news: 'News',
    materials: 'Materials',
    rewards: 'Rewards',
    rating: 'Rating',
    dksh: 'DKSh',
    analytics: 'Analytics',
    audit: 'Audit',
  },

  // PWA
  pwa: {
    offlineTitle: 'No Connection',
    offlineMessage: 'Check your internet connection and try again.',
    retry: 'Retry',
  },

  // Accessibility
  a11y: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openProfile: 'Open profile',
    notifications: 'Notifications',
    changeTheme: 'Change theme',
    changeLanguage: 'Change language',
    mainNavigation: 'Main navigation',
    ratingScore: 'Rating',
  },
};
