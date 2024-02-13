const usersDB = {
    users: require('../model/users'),
    setUsers: (payload) => {
        usersDB.users = payload;
    },
};
const bcrypt = require('bcrypt');

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
        //! Here it would be JWTs token
        return res.status(200).json({ success: `User ${user} is logged in!` });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };
