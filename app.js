var express                 = require('express'),
    mongoose                = require('mongoose'),
    bodyParser              = require('body-parser'),
    methodOverride          = require('method-override'),
    passport                = require('passport'),
    LocalStrategy          = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    Booking                 = require('./models/booking'),
    User                    = require('./models/user'),
    app                     = express();

mongoose.connect('mongodb://localhost/hotelManagement');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(require('express-session')({
    secret: 'HotelManagementSystem',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.redirect('/login');
}

app.get('/', function(req, res){
    res.render('home');
});

app.get('/bookings', isLoggedIn, function(req, res){
    Booking.find({}, function(error, bookings) {
        if(error)
            console.log(error);
        else
            res.render('bookings', {bookings: bookings});
    });
});

app.get('/bookings/new', isLoggedIn, function(req, res){
    res.render('bookings/new');
});

app.post('/bookings', function(req, res){
    var booking = req.body.booking;
    console.log(booking);
    Booking.create(booking, function(error, addedBooking) {
        if(error)
            console.log(error)
        else    
            res.redirect('/bookings');
    });
});

app.get('/bookings/:id', function(req, res){
    Booking.findById(req.params.id, function(error, booking){
        if(error)
            console.log(error);
        else
            res.render('bookings/show', {booking : booking});
    });
});

app.get('/bookings/:id/edit', function(req, res){
    Booking.findById(req.params.id, function(error, booking){
        if(error)
            console.log(error);
        else    
            res.render('edit', {booking: booking});
    });
});

app.put('/bookings/:id', function(req, res){
    Booking.findByIdAndUpdate(req.params.id, req.body.updatedBooking, function(error, updatedBooking){
        if(error)
            console.log(error);
        else    
            res.redirect('/bookings/' + req.params.id);
    });
});

app.delete('/bookings/:id', function(req, res){
    Booking.findByIdAndRemove(req.params.id, function(error){
        if(error)
            console.log(error);
        else
            res.redirect('/bookings');
    });
});

app.get('/contact', function(req, res){
    res.render('contact');
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/rooms', function(req, res){
    res.render('rooms');
});

app.get('/aminities', function(req, res){
    res.render('aminities');
});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/signup', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        if(error)
            console.log(error);
        else    
            passport.authenticate('local')(req, res, function(){
                res.redirect('/bookings');
            });
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/bookings',
    failureRedirect: '/login',
}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(3000, function(){
    console.log('The server is up and running');
}); 