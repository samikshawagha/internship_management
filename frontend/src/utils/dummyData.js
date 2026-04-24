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
  // Student Reports - Submitted to Companies
  {
    id: 1,
    title: 'Week 1-2 Onboarding Summary',
    studentId: 1,
    studentName: 'Alice Johnson',
    internshipId: 1,
    internshipTitle: 'Frontend Developer Internship',
    company: 'Tech Corp',
    content: `
      During the first two weeks of my internship at Tech Corp, I successfully onboarded into the frontend development team. 
      
      Key Accomplishments:
      - Set up development environment and reviewed codebase
      - Completed company orientation and met all team members
      - Fixed 3 UI bugs in the main dashboard
      - Learned the company's React component architecture
      
      Challenges:
      - Initial setup took longer than expected
      - Learning curve with proprietary libraries
      
      Next Steps:
      - Start working on assigned feature development
      - Deepen understanding of backend APIs
      - Improve code review process knowledge
    `,
    status: 'approved',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-14'
  },
  {
    id: 2,
    title: 'Progress Report - Feature Development',
    studentId: 1,
    studentName: 'Alice Johnson',
    internshipId: 1,
    internshipTitle: 'Frontend Developer Internship',
    company: 'Tech Corp',
    content: `
      Completed my second month of internship with significant progress on assigned features.
      
      Completed Tasks:
      - Developed user profile management feature (100% complete)
      - Implemented responsive design for mobile devices
      - Wrote comprehensive unit tests (coverage: 85%)
      - Optimized component rendering performance by 30%
      
      Skills Developed:
      - Advanced React patterns and hooks
      - Performance optimization techniques
      - Testing best practices with Jest
      
      Feedback:
      - Team lead praised code quality and attention to detail
      - Recommended for full-time position
    `,
    status: 'approved',
    createdAt: '2025-02-17',
    updatedAt: '2025-02-18'
  },
  {
    id: 3,
    title: 'Initial Learning Report',
    studentId: 2,
    studentName: 'Bob Smith',
    internshipId: 2,
    internshipTitle: 'Full Stack Developer Internship',
    company: 'Tech Corp',
    content: `
      Started my internship at Tech Corp as a Full Stack Developer.
      
      Week 1 Activities:
      - Attended team stand-ups and code review sessions
      - Set up local development environment
      - Reviewed existing backend architecture
      - Completed security training modules
      
      Technologies Refreshed:
      - Spring Boot framework
      - React.js fundamentals
      - PostgreSQL database queries
      - Docker containerization
      
      Upcoming Tasks:
      - Contribute to API development
      - Participate in sprint planning
      - Complete assigned tickets
    `,
    status: 'approved',
    createdAt: '2025-02-11',
    updatedAt: '2025-02-15'
  },
  {
    id: 4,
    title: 'Backend API Development - Phase 1',
    studentId: 2,
    studentName: 'Bob Smith',
    internshipId: 2,
    internshipTitle: 'Full Stack Developer Internship',
    company: 'Tech Corp',
    content: `
      Successfully completed Phase 1 of backend API development.
      
      Deliverables:
      - Developed REST APIs for user management (8 endpoints)
      - Implemented JWT authentication and authorization
      - Created database migrations for new features
      - Set up logging and error handling
      
      Testing & Quality:
      - Unit test coverage: 90%
      - Integrated with CI/CD pipeline
      - Passed all code review requirements
      
      Performance Metrics:
      - API response time: <200ms average
      - Database query optimization: 45% improvement
      
      Learnings:
      - Advanced Java/Spring Boot patterns
      - Database indexing strategies
      - API security best practices
    `,
    status: 'pending',
    createdAt: '2025-02-18',
    updatedAt: '2025-02-19'
  },
  {
    id: 5,
    title: 'Data Analytics Internship - Month 1',
    studentId: 3,
    studentName: 'Carol Davis',
    internshipId: 3,
    internshipTitle: 'Data Science Internship',
    company: 'Data Dynamics',
    content: `
      Completed first month of Data Science internship at Data Dynamics.
      
      Projects Completed:
      - Customer segmentation analysis using K-means clustering
      - Predictive model for customer churn (accuracy: 87%)
      - Dashboard creation with Tableau visualization
      - Data cleanup and preprocessing for large datasets
      
      Skills Applied:
      - Python (pandas, scikit-learn, matplotlib)
      - SQL for complex data queries
      - Tableau for business intelligence
      - Statistical analysis and hypothesis testing
      
      Insights Discovered:
      - Identified 3 actionable customer segments
      - Recommended pricing strategy adjustments
      - Automated monthly reporting process
      
      Mentor Feedback:
      - Excellent analytical thinking
      - Good attention to detail in data validation
    `,
    status: 'approved',
    createdAt: '2025-02-12',
    updatedAt: '2025-02-16'
  },
  {
    id: 6,
    title: 'Machine Learning Model Development',
    studentId: 3,
    studentName: 'Carol Davis',
    internshipId: 3,
    internshipTitle: 'Data Science Internship',
    company: 'Data Dynamics',
    content: `
      Advanced to machine learning model development phase.
      
      Current Project:
      - Building ensemble learning model for demand forecasting
      - Data preprocessing: 100,000+ records
      - Feature engineering using domain expertise
      - Model evaluation and hyperparameter tuning
      
      Models Implemented:
      - Random Forest (accuracy: 85%)
      - Gradient Boosting (accuracy: 89%)
      - Neural Network (accuracy: 88%)
      
      Deliverables:
      - Trained model with 89% accuracy
      - Production-ready prediction API
      - Documentation and deployment guide
      
      Business Impact:
      - Estimated inventory optimization savings: $250K/year
      - Reduced forecasting errors by 35%
    `,
    status: 'approved',
    createdAt: '2025-02-19',
    updatedAt: '2025-02-19'
  },
  {
    id: 7,
    title: 'DevOps Infrastructure Setup',
    studentId: 4,
    studentName: 'David Wilson',
    internshipId: 4,
    internshipTitle: 'DevOps Engineer Internship',
    company: 'Cloud Systems Inc',
    content: `
      Starting DevOps internship at Cloud Systems Inc.
      
      Initial Assignments:
      - Reviewed existing AWS infrastructure
      - Learned CI/CD pipeline architecture
      - Set up monitoring with CloudWatch
      - Configured security groups and VPCs
      
      Training Completed:
      - AWS certification course (70% complete)
      - Docker and Kubernetes fundamentals
      - Infrastructure as Code (Terraform)
      - Linux system administration
      
      First Project:
      - Containerizing legacy application
      - Setting up automated deployment process
      
      Resources:
      - Participating in knowledge transfer sessions
      - Active in Slack engineering channel
    `,
    status: 'approved',
    createdAt: '2025-02-14',
    updatedAt: '2025-02-17'
  },
  {
    id: 8,
    title: 'Cloud Infrastructure Optimization',
    studentId: 4,
    studentName: 'David Wilson',
    internshipId: 4,
    internshipTitle: 'DevOps Engineer Internship',
    company: 'Cloud Systems Inc',
    content: `
      Successfully implemented infrastructure optimization initiatives.
      
      Completed Tasks:
      - Migrated 15 microservices to Kubernetes cluster
      - Implemented auto-scaling policies
      - Set up centralized logging with ELK stack
      - Reduced cloud infrastructure costs by 22%
      
      Tools & Technologies Used:
      - Kubernetes for orchestration
      - Terraform for infrastructure provisioning
      - Prometheus for monitoring
      - Jenkins for CI/CD automation
      
      Impact Metrics:
      - Deployment time reduced: 60 minutes → 10 minutes
      - System uptime improved: 98.5% → 99.95%
      - Cost savings: $45K/month
      
      Recommendations:
      - Implement disaster recovery plan
      - Automate backup processes
      - Conduct security audit
    `,
    status: 'pending',
    createdAt: '2025-02-19',
    updatedAt: '2025-02-19'
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

// Company Dashboard Dummy Data
export const dummyCompanies = [
  {
    id: 1,
    name: 'Tech Innovations Inc',
    email: 'hr@techinnovations.com',
    phone: '+1-555-1000',
    industry: 'Software Development',
    website: 'www.techinnovations.com',
    logo: '🏢',
    location: 'San Francisco, CA',
    employees: 500,
    founded: 2015,
    description: 'Leading software development company specializing in cloud solutions'
  },
  {
    id: 2,
    name: 'Data Solutions Ltd',
    email: 'careers@datasolutions.com',
    phone: '+1-555-2000',
    industry: 'Data Analytics',
    website: 'www.datasolutions.com',
    logo: '📊',
    location: 'New York, NY',
    employees: 250,
    founded: 2018,
    description: 'Providing advanced data analytics and AI solutions'
  }
];

export const dummyCompanyAttendance = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alice Johnson',
    date: '2026-02-19',
    status: 'present',
    remarks: null
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Bob Smith',
    date: '2026-02-19',
    status: 'late',
    remarks: 'Traffic on the way'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Carol Davis',
    date: '2026-02-19',
    status: 'present',
    remarks: null
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'David Wilson',
    date: '2026-02-19',
    status: 'absent',
    remarks: 'Unwell'
  },
  {
    id: 5,
    studentId: 1,
    studentName: 'Alice Johnson',
    date: '2026-02-18',
    status: 'present',
    remarks: null
  },
  {
    id: 6,
    studentId: 2,
    studentName: 'Bob Smith',
    date: '2026-02-18',
    status: 'present',
    remarks: null
  },
  {
    id: 7,
    studentId: 3,
    studentName: 'Carol Davis',
    date: '2026-02-18',
    status: 'present',
    remarks: null
  },
  {
    id: 8,
    studentId: 4,
    studentName: 'David Wilson',
    date: '2026-02-18',
    status: 'late',
    remarks: 'Morning appointment'
  }
];

export const dummyCompanyLeaves = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alice Johnson',
    startDate: '2026-02-20',
    endDate: '2026-02-22',
    reason: 'Personal work',
    leaveType: 'casual',
    status: 'pending',
    createdAt: '2026-02-19'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Bob Smith',
    startDate: '2026-02-25',
    endDate: '2026-02-27',
    reason: 'Medical appointment',
    leaveType: 'sick',
    status: 'pending',
    createdAt: '2026-02-18'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Carol Davis',
    startDate: '2026-02-17',
    endDate: '2026-02-19',
    reason: 'Family emergency',
    leaveType: 'emergency',
    status: 'approved',
    approverComments: 'Approved with sympathy',
    createdAt: '2026-02-15'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'David Wilson',
    startDate: '2026-02-10',
    endDate: '2026-02-12',
    reason: 'Home relocation',
    leaveType: 'personal',
    status: 'rejected',
    approverComments: 'Insufficient notice period',
    createdAt: '2026-02-08'
  },
  {
    id: 5,
    studentId: 1,
    studentName: 'Alice Johnson',
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    reason: 'Conference attendance',
    leaveType: 'casual',
    status: 'approved',
    createdAt: '2026-01-18'
  }
];

export const dummyPerformanceEvaluations = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Alice Johnson',
    internshipId: 1,
    internshipTitle: 'Frontend Development',
    evaluatorId: 10,
    evaluatorName: 'John Manager',
    technicalSkills: 4.5,
    communication: 4.2,
    teamwork: 4.7,
    punctuality: 5.0,
    proactiveness: 4.3,
    comments: 'Excellent work on React components. Very detail-oriented and communicates well with team. Shows great initiative in learning new technologies.',
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Bob Smith',
    internshipId: 2,
    internshipTitle: 'Backend Development',
    evaluatorId: 11,
    evaluatorName: 'Sarah Developer',
    technicalSkills: 4.0,
    communication: 3.8,
    teamwork: 4.2,
    punctuality: 4.5,
    proactiveness: 3.9,
    comments: 'Good performance with API development. Sometimes needs more initia in system design decisions but shows consistent growth.',
    createdAt: '2026-02-17',
    updatedAt: '2026-02-17'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Carol Davis',
    internshipId: 3,
    internshipTitle: 'Data Science',
    evaluatorId: 12,
    evaluatorName: 'Michael Data Lead',
    technicalSkills: 4.8,
    communication: 4.1,
    teamwork: 4.4,
    punctuality: 4.6,
    proactiveness: 4.5,
    comments: 'Outstanding technical skills in machine learning. Delivered high-quality analysis reports. Could improve presentation skills.',
    createdAt: '2026-02-16',
    updatedAt: '2026-02-16'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'David Wilson',
    internshipId: 4,
    internshipTitle: 'DevOps',
    evaluatorId: 13,
    evaluatorName: 'Emily Ops Engineer',
    technicalSkills: 4.3,
    communication: 3.9,
    teamwork: 4.5,
    punctuality: 4.8,
    proactiveness: 4.0,
    comments: 'Strong infrastructure knowledge and Linux expertise. Very reliable and punctual. Needs to develop better documentation habits.',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-15'
  }
];

export const dummyCompanyAnalytics = {
  monthlyApplications: [
    { month: 'Jan', applications: 45, hired: 12 },
    { month: 'Feb', applications: 68, hired: 18 },
    { month: 'Mar', applications: 52, hired: 14 },
    { month: 'Apr', applications: 78, hired: 22 },
    { month: 'May', applications: 65, hired: 19 },
    { month: 'Jun', applications: 82, hired: 25 }
  ],
  departmentDistribution: [
    { department: 'Engineering', count: 12, color: '#667eea' },
    { department: 'Data Science', count: 8, color: '#84fab0' },
    { department: 'Product', count: 5, color: '#ffa502' },
    { department: 'DevOps', count: 4, color: '#17a2b8' },
    { department: 'Design', count: 3, color: '#dc3545' }
  ],
  performanceDistribution: [
    { range: '4.5-5.0', count: 8, color: '#28a745' },
    { range: '4.0-4.4', count: 12, color: '#84fab0' },
    { range: '3.5-3.9', count: 6, color: '#ffc107' },
    { range: '3.0-3.4', count: 2, color: '#fd7e14' },
    { range: '<3.0', count: 1, color: '#dc3545' }
  ]
};

export const dummyCompanyTeamMembers = [
  {
    id: 1,
    studentId: 1,
    name: 'Alice Johnson',
    internshipTitle: 'Frontend Development',
    startDate: '2025-12-01',
    endDate: '2026-03-01',
    status: 'active',
    performanceScore: 4.5,
    attendancePercentage: 95
  },
  {
    id: 2,
    studentId: 2,
    name: 'Bob Smith',
    internshipTitle: 'Backend Development',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    status: 'active',
    performanceScore: 4.0,
    attendancePercentage: 88
  },
  {
    id: 3,
    studentId: 3,
    name: 'Carol Davis',
    internshipTitle: 'Data Science',
    startDate: '2026-01-01',
    endDate: '2026-04-01',
    status: 'active',
    performanceScore: 4.8,
    attendancePercentage: 96
  },
  {
    id: 4,
    studentId: 4,
    name: 'David Wilson',
    internshipTitle: 'DevOps',
    startDate: '2025-11-15',
    endDate: '2026-02-15',
    status: 'completed',
    performanceScore: 4.3,
    attendancePercentage: 94
  }
];

export const dummyCompanyDashboardData = {
  summary: {
    totalInternships: 5,
    activeInterns: 4,
    completedInternships: 8,
    averagePerformance: 4.4,
    totalApplicationsreviewed: 280,
    hirePendingCount: 12
  },
  recentApplications: [
    {
      id: 1,
      studentName: 'Emma Wilson',
      position: 'Frontend Developer',
      status: 'new',
      appliedDate: '2026-02-19',
      university: 'MIT'
    },
    {
      id: 2,
      studentName: 'Frank Johnson',
      position: 'Data Analyst',
      status: 'reviewing',
      appliedDate: '2026-02-18',
      university: 'Stanford'
    },
    {
      id: 3,
      studentName: 'Grace Lee',
      position: 'Backend Developer',
      status: 'interview',
      appliedDate: '2026-02-17',
      university: 'Berkeley'
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Team Sync Meeting',
      date: '2026-02-20',
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Performance Review - Alice Johnson',
      date: '2026-02-21',
      time: '2:00 PM',
      type: 'review'
    },
    {
      id: 3,
      title: 'Internship Program Evaluation',
      date: '2026-02-22',
      time: '11:00 AM',
      type: 'evaluation'
    }
  ]
};
