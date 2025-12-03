import sequelize from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const debugLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check if admin exists
    const admin = await User.findOne({ where: { email: 'admin@elisshbeauty.ae' } });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      
      // Create admin with manual password hashing
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newAdmin = await User.create({
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@elisshbeauty.ae',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin created with manual hash');
      
      // Test password
      const isValid = await bcrypt.compare('admin123', newAdmin.password);
      console.log('Password test:', isValid ? '✅ Valid' : '❌ Invalid');
      
    } else {
      console.log('✅ Admin user found');
      console.log('Admin data:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        hasPassword: !!admin.password
      });
      
      // Test password comparison
      if (admin.comparePassword) {
        const isValid = await admin.comparePassword('admin123');
        console.log('Model password test:', isValid ? '✅ Valid' : '❌ Invalid');
      }
      
      // Test direct bcrypt
      const directTest = await bcrypt.compare('admin123', admin.password);
      console.log('Direct bcrypt test:', directTest ? '✅ Valid' : '❌ Invalid');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
};

debugLogin();