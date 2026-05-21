const User = require('../models/User');

const initAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });

    if (adminCount > 0) {
      console.log('✅ Admin account already exists. Skip init.');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vetsuviet.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminFullName = process.env.ADMIN_FULL_NAME || 'Vết Sử Việt Admin';

    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      fullName: adminFullName,
      role: 'admin',
      isActive: true,
      xp: 0,
      level: 1,
    });

    await admin.save();

    console.log('🎉 Default admin account initialized successfully');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('⚠️  Please change default admin password after first login.');
  } catch (error) {
    console.error(`❌ Init admin failed: ${error.message}`);
  }
};

module.exports = initAdmin;
