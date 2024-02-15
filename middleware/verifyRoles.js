const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        const result = req.roles
            .map((role) => {
                return rolesArray.includes(role);
            })
            .find((item) => item === true);
        if (!result) {
            return res.sendStatus(403);
        }
        next();
    };
};

module.exports = verifyRoles;
