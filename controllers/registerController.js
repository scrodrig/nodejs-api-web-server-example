const usersDB = {
    users: require('../model/users'),
    setUsers: (payload) => {
        usersDB.users = payload;
    },
};

const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ error: 'Include username and password' });
    }
    const duplicated = await User.findOne({ username: user }).exec();
    if (duplicated) {
        return res.sendStatus(409);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //Store the new user in the database
        await User.create({
            username: user,
            password: hashedPwd,
        });

        res.status(201).json({ success: `New user ${user} created` });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { handleNewUser };
