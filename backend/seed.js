// seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const users = [
    // {
    //   name: 'Admin User',
    //   email: 'admin@internhub.com',
    //   password: 'admin123',
    //   role: 'admin',
    // },
    // {
    //   name: 'Program Manager',
    //   email: 'pm@internhub.com',
    //   password: 'pmrs123',
    //   role: 'program_manager',
    // },
    {
      name: 'Guide user 2 ',
      email: 'guide2@internhub.com',
      password: 'guide123',
      role: 'guide',
    },
        {
      name: 'Guide user 3 ',
      email: 'guide3@internhub.com',
      password: 'guide123',
      role: 'guide',
    },
    // {
    //   name: 'Intern User',
    //   email: 'intern@internhub.com',
    //   password: 'intern123',
    //   role: 'intern',
    // },
    // {
    //   name: 'Panel Member',
    //   email: 'panel@internhub.com',
    //   password: 'panel123',
    //   role: 'panel_member',
    // },
  ]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // // Clear existing data
    // await User.deleteMany({});
    // console.log('Existing users removed');

    // Seed users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`User ${user.email} created`);
    }

    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
