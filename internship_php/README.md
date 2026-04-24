# Online Internship Management System (PHP/MySQL)

A complete three-module internship management system with Admin, Student, and Company panels built using PHP, Bootstrap 5, and MySQL. Features a modern gradient UI, sidebar navigation, responsive design, and role-based access.

## Features

### 🔐 Admin Module
- **Dashboard**: Overview of system statistics with sample certificates
- **Department Management**: Add/Edit/Delete departments
- **Internship Types**: Manage internship categories
- **Company Management**: Approve/Reject company registrations
- **Student Management**: Add/Edit/Delete students
- **Assessment Management**: Create and manage skill assessments
- **View Applications**: Track all internship applications
- **View Assessment Results**: Monitor student performance
- **Reports**: Generate reports and export CSV

### 👨‍🎓 Student Module
- **Dashboard**: Quick overview with stats and achievement cards
- **Browse Internships**: View all available internship positions
- **Apply for Internships**: Submit applications with one click
- **Track Applications**: Monitor application status in real-time
- **Take Assessments**: Evaluate skills with interactive quizzes
- **View Certificates**: Access earned internship certificates and sample achievements
- **Download Offer Letters**: Get approved offer letters
- **Profile Management**: Update personal information

### 🏢 Company Module
- **Dashboard**: Overview of postings and applications
- **Post Internships**: Create and manage internship listings
- **Manage Applications**: Review and approve/reject applications
- **Send Offer Letters**: Create and send offer letters to students
- **Company Profile**: Update company information
- **Auth Management**: Register and login system

## Setup

1. **Environment**: `PHP >= 7.4`, `MySQL` (or MariaDB), and a web server (Apache, Nginx) configured to serve `internship_php` folder.
2. **Database**: create a database called `internship_management` and import tables below.

```sql
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) DEFAULT ''
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(15),
  address TEXT,
  status TINYINT DEFAULT 0 COMMENT '0=pending,1=approved,2=rejected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE internship_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE internship_postings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  duration VARCHAR(100),
  stipend INT DEFAULT 0,
  status TINYINT DEFAULT 1 COMMENT '1=active,0=inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  date_submitted DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending,approved,rejected',
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (internship_id) REFERENCES internship_postings(id)
);

CREATE TABLE offer_letters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  content TEXT,
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending,accepted,rejected',
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (internship_id) REFERENCES internship_postings(id)
);

CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  certificate_number VARCHAR(100) UNIQUE,
  issued_date DATE,
  grade VARCHAR(10),
  remarks TEXT,
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (internship_id) REFERENCES internship_postings(id)
);

CREATE TABLE assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT,
  total_questions INT DEFAULT 20,
  duration_minutes INT DEFAULT 30,
  passing_score INT DEFAULT 60,
  difficulty_level VARCHAR(20) COMMENT 'beginner,intermediate,advanced',
  status TINYINT DEFAULT 1 COMMENT '1=active,0=inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  assessment_id INT NOT NULL,
  score INT,
  completion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);
```

3. **Configuration**: Edit `includes/db.php` with your DB credentials.

4. **Admin Setup**: Create an admin user manually:
   ```sql
   INSERT INTO admins (email, password, name) VALUES 
   ('admin@example.com', '[PASSWORD_HASH]', 'Administrator');
   ```
   Generate hash using: `password_hash('yourpassword', PASSWORD_DEFAULT)`

5. **Access Points**:
   - **Admin Login**: `http://localhost/internship_php/admin/login.php`
   - **Student Register/Login**: `http://localhost/internship_php/student/register.php`
   - **Company Register/Login**: `http://localhost/internship_php/company/register.php`
   - **Home**: `http://localhost/internship_php/`

## UI Details

- Gradient background (`#4facfe` to `#00f2fe`) applied globally.
- Sidebar stays fixed on larger screens and collapses on small devices.
- Uses FontAwesome for icons and Bootstrap 5 for layout.

## Development Notes

- Each module (admin, company, student) sits in its own directory.
- Reusable header, footer, sidebar are in `includes/`.
- Add further CRUD operations by editing respective PHP files and creating forms.

Feel free to extend with authentication, validation, AJAX operations, and production best practices.
