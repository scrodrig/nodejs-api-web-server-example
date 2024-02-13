const usersDB = {
    users: require('../model/users'),
    setUsers: (payload) => {
        usersDB.users = payload;
    },
};
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogOut = async (req, res) => {
    //On client side, we need to remove the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    //Is refreshed token in DB?
    const foundUser = usersDB.users.find(
        (person) => person.refreshToken === refreshToken,
    );
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(204);
    }

    //Delete the refresh token from the user in the DB
    const otherUsers = usersDB.users.filter(
        (person) => person.refreshToken !== refreshToken,
    );
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users),
    );

    res.clearCookie('jwt', {
        httpOnly: true,
        // sameSite: 'None',
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }); //secure ture only for https
    res.sendStatus(204);
};

module.exports = { handleLogOut };
