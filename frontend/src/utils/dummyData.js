// Dummy Data for Internship Management System

export const dummyUsers = {
  students: [
    {
      id: 1,
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      phone: '+1-555-0101',
      university: 'MIT',
      major: 'Computer Science',
      gpa: 3.8,
      skills: ['React', 'Node.js', 'MongoDB', 'Python'],
      resume: 'alice_resume.pdf',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      role: 'student',
      phone: '+1-555-0102',
      university: 'Stanford',
      major: 'Software Engineering',
      gpa: 3.6,
      skills: ['Java', 'Spring Boot', 'ReactJS', 'Docker'],
      resume: 'bob_resume.pdf',
      createdAt: '2025-01-20'
    },
    {
      id: 3,
      fullName: 'Carol Davis',
      email: 'carol@example.com',
      role: 'student',
      phone: '+1-555-0103',
      university: 'UC Berkeley',
      major: 'Data Science',
      gpa: 3.9,
      skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'],
      resume: 'carol_resume.pdf',
      createdAt: '2025-02-01'
    },
    {
      id: 4,
      fullName: 'David Wilson',
      email: 'david@example.com',
      role: 'student',
      phone: '+1-555-0104',
      university: 'CMU',
      major: 'Computer Science',
      gpa: 3.7,
      skills: ['C++', 'AWS', 'Python', 'Machine Learning'],
      resume: 'david_resume.pdf',
      createdAt: '2025-02-05'
    }
  ],
  companies: [
    {
      id: 101,
      fullName: 'Tech Corp',
      email: 'hr@techcorp.com',
      role: 'company',
      phone: '+1-555-1001',
      industry: 'Software Development',
      companySize: '500-1000',
      website: 'https://techcorp.com',
      location: 'San Francisco, CA',
      createdAt: '2025-01-01'
    },
    {
      id: 102,
      fullName: 'Data Dynamics',
      email: 'careers@datadynamics.com',
      role: 'company',
      phone: '+1-555-1002',
      industry: 'Data Analytics',
      companySize: '100-500',
      website: 'https://datadynamics.com',
      location: 'Boston, MA',
      createdAt: '2025-01-10'
    },
    {
      id: 103,
      fullName: 'Cloud Systems Inc',
      email: 'jobs@cloudsystems.com',
      role: 'company',
      phone: '+1-555-1003',
      industry: 'Cloud Computing',
      companySize: '200-500',
      website: 'https://cloudsystems.com',
      location: 'Seattle, WA',
      createdAt: '2025-01-15'
    },
    {
      id: 104,
      fullName: 'Mobile Innovations',
      email: 'hr@mobileinnovations.com',
      role: 'company',
      phone: '+1-555-1004',
      industry: 'Mobile App Development',
      companySize: '50-200',
      website: 'https://mobileinnovations.com',
      location: 'Austin, TX',
      createdAt: '2025-02-01'
    }
  ],
  admins: [
    {
      id: 201,
      fullName: 'Admin User',
      email: 'admin@internhub.com',
      role: 'admin',
      phone: '+1-555-2001',
      department: 'Administration',
      createdAt: '2024-12-01'
    }
  ]
};

export const dummyInternships = [
  {
    id: 1,
    title: 'Frontend Developer Internship',
    description: 'Join our team to build amazing user interfaces using React and modern web technologies.',
    company: 'Tech Corp',
    companyId: 101,
    location: 'San Francisco, CA',
    duration: '3 months',
    stipend: '$4,000/month',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    requirements: '2nd or 3rd year student, GPA > 3.5',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'open',
    applicants: 24,
    postedDate: '2025-02-10',
    description_full: `
      We are looking for a talented Frontend Developer Intern to join our dynamic team.
      
      Responsibilities:
      - Develop and maintain responsive web applications
      - Collaborate with designers and backend developers
      - Write clean, maintainable code
      - Participate in code reviews
      - Help improve user experience
      
      Requirements:
      - Strong knowledge of React and JavaScript
      - Understanding of HTML/CSS
      - Good communication skills
      - Problem-solving mindset
      
      What we offer:
      - Competitive stipend
      - Mentorship from experienced developers
      - Flexible working hours
      - Remote work option
    `
  },
  {
    id: 2,
    title: 'Backend Developer Internship',
    description: 'Build scalable backend systems with Node.js, Express, and MongoDB.',
    company: 'Tech Corp',
    companyId: 101,
    location: 'San Francisco, CA',
    duration: '3 months',
    stipend: '$4,500/month',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    requirements: '2nd or 3rd year student, GPA > 3.5',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'open',
    applicants: 18,
    postedDate: '2025-02-08',
    description_full: `
      We are seeking a Backend Developer Intern to help us build and maintain our server infrastructure.
      
      Responsibilities:
      - Design and develop REST APIs
      - Work with databases and optimization
      - Implement authentication and security
      - Write unit tests
      - Deploy and monitor applications
      
      Requirements:
      - Knowledge of Node.js and Express
      - Database experience (SQL or NoSQL)
      - Understanding of REST principles
      - Version control with Git
      
      Benefits:
      - Higher stipend for remote work opportunity
      - Flexible schedule
      - Full mentorship
      - Possibility of conversion to full-time
    `
  },
  {
    id: 3,
    title: 'Data Science Internship',
    description: 'Work with AI/ML models and data analysis. Perfect for aspiring data scientists.',
    company: 'Data Dynamics',
    companyId: 102,
    location: 'Boston, MA',
    duration: '4 months',
    stipend: '$5,000/month',
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Analysis'],
    requirements: 'Strong math background, GPA > 3.6',
    startDate: '2025-05-15',
    endDate: '2025-09-15',
    status: 'open',
    applicants: 31,
    postedDate: '2025-02-01',
    description_full: `
      Join our Data Science team and work on cutting-edge machine learning projects.
      
      Responsibilities:
      - Analyze large datasets
      - Build and train ML models
      - Create data visualizations
      - Present findings to stakeholders
      - Collaborate with data engineers
      
      Requirements:
      - Strong Python skills
      - Understanding of statistics and probability
      - Experience with TensorFlow or PyTorch
      - SQL knowledge
      
      Perks:
      - Highest stipend in the program
      - Access to state-of-the-art tools
      - Research publication opportunities
      - Conference attendance support
    `
  },
  {
    id: 4,
    title: 'DevOps Engineer Internship',
    description: 'Help us manage and improve our cloud infrastructure using AWS and Docker.',
    company: 'Cloud Systems Inc',
    companyId: 103,
    location: 'Seattle, WA',
    duration: '3 months',
    stipend: '$4,800/month',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
    requirements: '2nd year or above, Linux experience',
    startDate: '2025-06-15',
    endDate: '2025-09-15',
    status: 'open',
    applicants: 12,
    postedDate: '2025-02-05',
    description_full: `
      We're looking for a DevOps Engineer Intern to help maintain and scale our infrastructure.
      
      Responsibilities:
      - Monitor system performance and logs
      - Maintain CI/CD pipelines
      - Manage containerized applications
      - Implement infrastructure-as-code
      - Document processes and procedures
      
      Requirements:
      - Linux command line proficiency
      - Understanding of cloud platforms
      - Docker and containerization knowledge
      - Shell scripting skills
      
      Offer:
      - Hands-on cloud platform experience
      - Mentorship in DevOps practices
      - Work on real production systems
      - Flexible remote arrangements
    `
  },
  {
    id: 5,
    title: 'Mobile App Developer Internship',
    description: 'Create amazing native mobile applications for iOS and Android.',
    company: 'Mobile Innovations',
    companyId: 104,
    location: 'Austin, TX',
    duration: '3 months',
    stipend: '$4,200/month',
    skills: ['React Native', 'JavaScript', 'Swift', 'Kotlin'],
    requirements: '2nd or 3rd year student',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'open',
    applicants: 15,
    postedDate: '2025-02-09',
    description_full: `
      Join our mobile development team and build apps used by thousands of users.
      
      Responsibilities:
      - Develop cross-platform mobile applications
      - Write clean, efficient code
      - Test and debug applications
      - Implement UI/UX designs
      - Collaborate with product team
      
      Requirements:
      - Experience with React Native or Native development
      - JavaScript knowledge
      - Understanding of mobile UI principles
      - Problem-solving skills
      
      Benefits:
      - Work on real-world applications
      - App store publication opportunities
      - Tech stack flexibility
      - Startup environment
    `
  }
];

export const dummyApplications = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alice Johnson',
    internshipId: 1,
    internshipTitle: 'Frontend Developer Internship',
    company: 'Tech Corp',
    status: 'accepted',
    appliedDate: '2025-02-10',
    updatedDate: '2025-02-12',
    coverLetter: 'I am very interested in this opportunity...'
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Alice Johnson',
    internshipId: 3,
    internshipTitle: 'Data Science Internship',
    company: 'Data Dynamics',
    status: 'pending',
    appliedDate: '2025-02-11',
    updatedDate: '2025-02-11',
    coverLetter: 'My passion for data science...'
  },
  {
    id: 3,
    studentId: 2,
    studentName: 'Bob Smith',
    internshipId: 2,
    internshipTitle: 'Backend Developer Internship',
    company: 'Tech Corp',
    status: 'rejected',
    appliedDate: '2025-02-09',
    updatedDate: '2025-02-13',
    coverLetter: 'I have strong experience in backend development...'
  },
  {
    id: 4,
    studentId: 2,
    studentName: 'Bob Smith',
    internshipId: 4,
    internshipTitle: 'DevOps Engineer Internship',
    company: 'Cloud Systems Inc',
    status: 'pending',
    appliedDate: '2025-02-12',
    updatedDate: '2025-02-12',
    coverLetter: 'Cloud infrastructure interests me greatly...'
  },
  {
    id: 5,
    studentId: 3,
    studentName: 'Carol Davis',
    internshipId: 3,
    internshipTitle: 'Data Science Internship',
    company: 'Data Dynamics',
    status: 'accepted',
    appliedDate: '2025-02-08',
    updatedDate: '2025-02-13',
    coverLetter: 'I have published research in machine learning...'
  },
  {
    id: 6,
    studentId: 4,
    studentName: 'David Wilson',
    internshipId: 4,
    internshipTitle: 'DevOps Engineer Internship',
    company: 'Cloud Systems Inc',
    status: 'accepted',
    appliedDate: '2025-02-07',
    updatedDate: '2025-02-12',
    coverLetter: 'Excited to work with your cloud infrastructure...'
  }
];

export const dummyReports = [
  {
    id: 1,
    title: 'Q1 2025 Internship Report',
    company: 'Tech Corp',
    createdBy: 'hr@techcorp.com',
    createdDate: '2025-02-15',
    type: 'Performance',
    content: 'Overall performance of interns in Q1 has been excellent...',
    metrics: {
      totalInterns: 8,
      averageRating: 4.5,
      retentionRate: 87.5
    }
  },
  {
    id: 2,
    title: 'Hiring Analysis Report',
    company: 'Data Dynamics',
    createdBy: 'careers@datadynamics.com',
    createdDate: '2025-02-14',
    type: 'Analytics',
    content: 'Application analysis for current internship postings...',
    metrics: {
      totalApplications: 45,
      conversionRate: 22,
      timeToHire: 14
    }
  }
];

export const dummyNotifications = [
  {
    id: 1,
    userId: 1,
    type: 'application_accepted',
    message: 'Your application for Frontend Developer Internship has been accepted!',
    read: false,
    createdDate: '2025-02-13'
  },
  {
    id: 2,
    userId: 1,
    type: 'new_internship',
    message: 'A new internship matching your interests has been posted',
    read: true,
    createdDate: '2025-02-12'
  }
];

export const dummyStats = {
  students: {
    total: 1250,
    active: 1100,
    applied: 850,
    accepted: 320
  },
  companies: {
    total: 180,
    activePostings: 45,
    totalInternships: 210,
    filled: 85
  },
  applications: {
    total: 2450,
    pending: 320,
    accepted: 980,
    rejected: 450,
    withdrawn: 700
  },
  performance: {
    averageCompletionRate: 92,
    studentSatisfaction: 4.6,
    companySatisfaction: 4.5,
    placementRate: 78
  }
};
