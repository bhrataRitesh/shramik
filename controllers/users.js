const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    if (!req.user) {
        return res.render('users/register');
    } else {
        req.flash('error', 'You are already logged IN ')
        res.redirect('/shramiks');
    }
}

module.exports.register = async (req, res) => {
    if (!req.user) {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Shramik!');
                res.redirect('/shramiks');
            })
        }
        catch (e) {
            req.flash('error', e.message);
            res.redirect('/register');
        }
    } else {
        req.flash('error', 'You are already logged IN ')
        res.redirect('/shramiks');
    }
}

module.exports.renderLogin = (req, res) => {
    if (!req.user) {
        return res.render('users/login');
    } else {
        req.flash('error', 'You are already logged In ')
        return res.redirect('/shramiks');
    }
}

module.exports.login = async (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || "/shramiks";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/shramiks');
    });
}