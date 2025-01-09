export const faqData = {
  usersClients: {
    id: 'usersClients',
    title: 'Users & Clients',
    subtitle: 'Everything you need to know about user features and client management',
    icon: 'mdi:account-multiple-outline',
    qandA: [
      {
        id: 'progress-tracking',
        question: 'How can I track my progress?',
        answer: 'Users can track multiple metrics: Daily water intake, Body weight, Body measurements (multiple body parts), Food intake, and Progress photos.'
      },
      {
        id: 'fitness-calculators',
        question: 'What fitness calculators are available in the tools section?',
        answer: 'Our platform offers several fitness calculators: BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), Macro Calculator, Body Fat Calculator, and 1RM (One Rep Max) Calculator.'
      },
      {
        id: 'calendar-feature',
        question: 'How does the calendar feature work?',
        answer: 'The calendar allows you to: View workouts assigned by your trainer, Schedule your training sessions, Track your workout completion, and See upcoming assignments from your trainer.'
      }
    ]
  },
  social: {
    id: 'social',
    title: 'Social Features',
    subtitle: 'Learn about connecting with others on the platform',
    icon: 'mdi:account-group',
    qandA: [
      {
        id: 'connect-users',
        question: 'Can I connect with other users on the platform?',
        answer: 'Yes! Our platform includes social features similar to Instagram: Share progress photos, Follow other users, Like and comment on posts, and Build your fitness community.'
      },
      {
        id: 'profile-privacy',
        question: 'Is my profile private?',
        answer: '[Add your privacy settings details]'
      }
    ]
  },
  pricing: {
    id: 'pricing',
    title: 'Packages & Pricing',
    subtitle: 'Information about our subscription packages and pricing',
    icon: 'mdi:currency-usd',
    qandA: [
      {
        id: 'available-packages',
        question: 'What subscription packages are available?',
        answer: 'We offer three main packages: 1. Monthly Subscription (Full access to all features, Monthly billing), 2. Annual Subscription (Full access to all features, Yearly billing), 3. Free Trial (100% free, No credit card required, Full access to all features)'
      },
      {
        id: 'package-features',
        question: "What's included in each package?",
        answer: 'All packages include the same features: Client management, Workout creation and assignment, Diet plan creation, Progress tracking tools, Social features, Chat system, Forms and assessments, Fitness calculators, Calendar functionality'
      }
    ]
  },
  tracking: {
    id: 'tracking',
    title: 'Tracking & Progress',
    subtitle: 'Learn about tracking your fitness journey',
    icon: 'mdi:chart-line',
    qandA: [
      {
        id: 'trackable-metrics',
        question: 'What metrics can I track?',
        answer: 'Users can track: Body measurements (Weight, Individual body part measurements), Water intake, Food consumption, Progress photos, Workout completion'
      },
      {
        id: 'trainer-monitoring',
        question: "Can trainers monitor their clients' tracking data?",
        answer: 'Yes, trainers have access to their clients\' tracking data to monitor progress and adjust plans accordingly.'
      },
      {
        id: 'measurement-frequency',
        question: 'How often should I update my measurements?',
        answer: 'While this can vary based on your trainer\'s recommendations, most users update their measurements weekly or bi-weekly for optimal progress tracking.'
      }
    ]
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar & Scheduling',
    subtitle: 'Managing your workout schedule',
    icon: 'mdi:calendar',
    qandA: [
      {
        id: 'workout-assignment',
        question: 'How do trainers assign workouts?',
        answer: 'Trainers can: Assign workouts to specific dates, Designate clients for particular sessions, Schedule recurring workouts, Monitor workout completion'
      },
      {
        id: 'workout-history',
        question: 'Can I see my workout history?',
        answer: 'Yes, you can view your complete workout history, including completed workouts and performance metrics.'
      }
    ]
  },
  communication: {
    id: 'communication',
    title: 'Communication',
    subtitle: 'Staying connected with your trainer',
    icon: 'mdi:message',
    qandA: [
      {
        id: 'trainer-communication',
        question: 'How can I communicate with my trainer?',
        answer: 'The platform offers an integrated chat system for direct communication between trainers and clients.'
      }
    ]
  },
  trainerStatus: {
    id: 'trainerStatus',
    title: 'Trainer Subscription',
    subtitle: 'Understanding trainer subscription features',
    icon: 'mdi:account-check',
    qandA: [
      {
        id: 'subscription-expiry',
        question: 'What happens when my trainer subscription expires?',
        answer: 'When your subscription expires: You retain your trainer status/role, You maintain access to view your existing clients, Your profile remains visible, Your packages will no longer be visible to potential clients, You cannot create or assign new: Diet plans, Workout plans, Forms, Assessments'
      },
      {
        id: 'accessible-features',
        question: 'What features remain accessible after expiration?',
        answer: 'After expiration, you can still: View your existing client list, Access the chat system, View previously created plans, Access your profile, Use basic platform features'
      },
      {
        id: 'restricted-features',
        question: 'What features become restricted after expiration?',
        answer: 'You will lose the ability to: Create new diet plans, Create new workout plans, Assign plans to clients, Sell packages (packages hidden from profile), Create new forms or assessments, Add new clients'
      },
      {
        id: 'functionality-restoration',
        question: 'How quickly can I regain full functionality?',
        answer: 'Full trainer functionality is restored immediately upon reactivating your subscription.'
      },
      {
        id: 'client-data-retention',
        question: 'Will I lose my existing clients and their data when my subscription expires?',
        answer: 'No, you retain access to view all existing clients and their historical data. You just cannot make new assignments or modifications until resubscribing.'
      },
      {
        id: 'client-access',
        question: 'Can clients still access their existing plans during trainer subscription expiration?',
        answer: 'Yes, clients maintain access to all previously assigned plans and content.'
      }
    ]
  }
  // ... Add more categories as needed
}