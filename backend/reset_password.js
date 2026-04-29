const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const user = await User.findOne({ email: 'yashwant@gmail.com' });
        
        if (!user) {
            console.log('User not found.');
            process.exit(1);
        }

        user.password = 'admin123';
        await user.save();
        
        console.log(`Successfully reset password for ${user.email} to: admin123`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
