import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import WPR from './models/WPR.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await WPR.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const students = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@student.com',
        password: 'password123',
        role: 'student',
        semester: 5,
        department: 'Computer Science',
      },
      {
        name: 'Bob Smith',
        email: 'bob@student.com',
        password: 'password123',
        role: 'student',
        semester: 6,
        department: 'Computer Science',
      },
      {
        name: 'Carol Williams',
        email: 'carol@student.com',
        password: 'password123',
        role: 'student',
        semester: 5,
        department: 'Information Technology',
      },
    ]);

    const teachers = await User.create([
      {
        name: 'Dr. John Davis',
        email: 'john@teacher.com',
        password: 'password123',
        role: 'teacher',
      },
      {
        name: 'Prof. Sarah Miller',
        email: 'sarah@teacher.com',
        password: 'password123',
        role: 'teacher',
      },
    ]);

    console.log('Created users...');

    // Create projects
    const projects = await Project.create([
      {
        title: 'AI-Based Chatbot',
        description: 'Develop an intelligent chatbot using NLP and machine learning for customer support automation.',
        guide: teachers[0]._id,
        students: [students[0]._id, students[1]._id],
        semester: 5,
        status: 'approved',
        progress: 40,
        startDate: new Date(),
      },
      {
        title: 'E-Commerce Platform',
        description: 'Build a full-stack e-commerce website with payment gateway integration and inventory management.',
        guide: teachers[0]._id,
        students: [students[2]._id],
        semester: 6,
        status: 'approved',
        progress: 60,
        startDate: new Date(),
      },
      {
        title: 'Smart Attendance System',
        description: 'Face recognition based attendance system for educational institutions.',
        guide: teachers[1]._id,
        students: [],
        semester: 7,
        status: 'pending',
        progress: 0,
      },
      {
        title: 'Healthcare Management System',
        description: 'Digital platform for managing patient records, appointments, and hospital operations.',
        guide: teachers[1]._id,
        students: [students[0]._id],
        semester: 8,
        status: 'completed',
        progress: 100,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    ]);

    console.log('Created projects...');

    // Update user projects
    await User.findByIdAndUpdate(students[0]._id, { projects: [projects[0]._id, projects[3]._id] });
    await User.findByIdAndUpdate(students[1]._id, { projects: [projects[0]._id] });
    await User.findByIdAndUpdate(students[2]._id, { projects: [projects[1]._id] });

    // Create WPRs
    await WPR.create([
      {
        project: projects[0]._id,
        weekNumber: 1,
        progressDescription: 'Initial research on NLP libraries and chatbot frameworks. Set up development environment.',
        submittedBy: students[0]._id,
      },
      {
        project: projects[0]._id,
        weekNumber: 2,
        progressDescription: 'Implemented basic text processing and intent recognition module.',
        submittedBy: students[0]._id,
      },
      {
        project: projects[0]._id,
        weekNumber: 3,
        progressDescription: 'Integrated dialog management system and started working on response generation.',
        submittedBy: students[1]._id,
      },
      {
        project: projects[0]._id,
        weekNumber: 4,
        progressDescription: 'Completed API integration and started frontend development.',
        submittedBy: students[0]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 1,
        progressDescription: 'Requirements gathering and database schema design.',
        submittedBy: students[2]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 2,
        progressDescription: 'Implemented user authentication and product catalog modules.',
        submittedBy: students[2]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 3,
        progressDescription: 'Added shopping cart functionality and started payment integration.',
        submittedBy: students[2]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 4,
        progressDescription: 'Completed Stripe payment integration. Working on order management.',
        submittedBy: students[2]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 5,
        progressDescription: 'Finished order management and inventory tracking. Started admin dashboard.',
        submittedBy: students[2]._id,
      },
      {
        project: projects[1]._id,
        weekNumber: 6,
        progressDescription: 'Completed admin dashboard with analytics. Preparing for deployment.',
        submittedBy: students[2]._id,
      },
    ]);

    console.log('Created WPRs...');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n--- Demo Credentials ---');
    console.log('Students:');
    console.log('  alice@student.com / password123');
    console.log('  bob@student.com / password123');
    console.log('  carol@student.com / password123');
    console.log('Teachers:');
    console.log('  john@teacher.com / password123');
    console.log('  sarah@teacher.com / password123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
