const User = require('../model/User');

const handleLogOut = async (req, res) => {
    //On client side, we need to remove the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    //Is refreshed token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', {
        httpOnly: true,
        // sameSite: 'None',
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }); //secure ture only for https
    res.sendStatus(204);
};

module.exports = { handleLogOut };
