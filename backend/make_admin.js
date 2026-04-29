const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
        
        let email = 'blogpost@gmail.com';
        let password = 'admin123';
        
        let user = await User.findOne({ email });
        
        if (!user) {
            console.log('Admin account not found. Creating new admin account...');
            user = new User({
                name: 'Admin',
                email: email,
                password: password, // Will be hashed by pre-save hook
                role: 'Admin'
            });
        } else {
            console.log('User found. Updating role and resetting password...');
            user.role = 'Admin';
            user.password = password; // Resetting to admin123
        }

        await user.save();
        
        console.log('------------------------------------------------------------');
        console.log('SUCCESS!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('Role: Admin');
        console.log('------------------------------------------------------------');
        console.log('You can now log in with these credentials.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
