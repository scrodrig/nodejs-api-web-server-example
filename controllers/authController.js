const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ error: 'Include username and password' });
    }
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.sendStatus(401);
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' },
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            // sameSite: 'None', //This is for the cookie to be sent in a cross-origin request for develoopment
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ accessToken });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };
