const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find the first user in the database
        const user = await User.findOne();
        
        if (!user) {
            console.log('No users found in the database. Please sign up on the frontend first.');
            process.exit(1);
        }

        user.role = 'Admin';
        await user.save();
        
        console.log(`Successfully updated user '${user.name}' (${user.email}) to Admin!`);
        console.log('You can now log in with this account and access the Admin Panel.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
