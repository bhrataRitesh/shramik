const dotenv = require('dotenv');
dotenv.config();

const express = require('express')

const methodOverride = require('method-override')
const path = require('path');
const Shramik = require('./models/shramik')
const ejsMate = require('ejs-mate')

const ExpressError = require("./utils/ExpressError")

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');



const shramikRoutes = require('./routes/shramiks');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const MongoDBStore = require("connect-mongo")(session);


const app = express();



const connectDb = require('./config/connectDb')


connectDb();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);


const store = new MongoDBStore({
    url: process.env.DB_URL,
    secret: "thisshouldbeabettersecret!",
    touchafter: 24 * 3600
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,

    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",


    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
// const connectSrcUrls = [

// ];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            // connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyoynbt7i/", //SHOULD MATCH CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }),
    helmet.crossOriginEmbedderPolicy({
        policy: "credentialless"
    })
);




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/shramiks', shramikRoutes)
app.use('/shramiks/:id/reviews', reviewRoutes)
app.use('/', userRoutes);

app.get('/', async (req, res) => {
    // const shramiks = await Shramik.find({});
    res.redirect('/home')
})

app.get('/home', async (req, res) => {
    // const shramiks = await Shramik.find({});
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something Went wrong!'
    res.status(statusCode).render('error', { err });
    console.log(err)

})

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`you are listening port ${PORT}`);
})