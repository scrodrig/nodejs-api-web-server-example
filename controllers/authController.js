const usersDB = {
    users: require('../model/users'),
    setUsers: (payload) => {
        usersDB.users = payload;
    },
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ error: 'Include username and password' });
    }
    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser) {
        return res.sendStatus(401);
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' },
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        //! This is just for not having a database saving the refresh tokens
        const otherUsers = usersDB.users.filter(
            (person) => person.username !== foundUser.username,
        );
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users),
        );
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            // sameSite: 'None',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };
