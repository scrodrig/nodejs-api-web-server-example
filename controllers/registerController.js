const usersDB = {
    users: require('../model/users'),
    setUsers: (payload) => {
        usersDB.users = payload;
    },
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ error: 'Include username and password' });
    }
    const duplicated = usersDB.users.find((person) => person.user === user);
    if (duplicated) {
        return res.sendStatus(409);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //Store the new user in the database
        const newUser = {
            username: user,
            password: hashedPwd,
        };
        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users),
        );
        console.log(usersDB.users);
        res.status(201).json({ success: `New user ${user} created` });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { handleNewUser };
