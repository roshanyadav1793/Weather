const express=require('express');
const bodyParser=require('body-parser');
const https=require('https');
const ejs=require('ejs');
const mongoose=require('mongoose');
// const session=require('express-session');
// const passport=require('passport');
// const passportLocalMongoose =require('passport-local-mongoose');
// const LocalStrategy = require('passport-local');
const bcrypt=require('bcrypt');
const saltRounds=10;


const app=express();


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

// app.use(session({
//     secret:"our little secret",
//     resave:false,
//     saveUninitialized:false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/weatherDB",{ useNewUrlParser: true ,useUnifiedTopology: true });
// mongoose.set("useCreateIndex",true);

app.get("/",(req,res)=>{
    res.render("index",{cssa:'index'});
});

app.get("/SignUp", function(req,res){
    res.render("login",{cssa:'login'});
});

app.get("/Login", function(req,res){
    res.render("login",{cssa:'login'});
});


app.post("/input", function(req,res){
    const query=req.body.cityName;
    const apiKey="34bef40304807cf089a8dd778875a117";
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query + "&appid="+ apiKey+ "&units="+ unit;
    

    https.get(url,function(response){
        console.log(response.statusCode);
        

        response.on("data", function(data){
            const weatherData=JSON.parse(data);
            const temp=weatherData.main.temp;
            const weatherDescription=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const imageURL="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
            res.setHeader('Content-Type', 'text/html');
            res.write("<p>The weather is currently " + weatherDescription+"</p>");
            res.write("<h1>The temperature in "+ query + " is "+ temp+" degrees celcius.</h1>");
            res.write("<img src="+ imageURL+">");
            //res.write('<div class="card" style="width: 18rem;"><img class="card-img-top" src="..." alt="Card image cap"><div class="card-body"><p class="card-text">Some quick example text to build on the card title and make up the bulk of the card content.</p></div></div>');
            //  res.render("temp",{query: query, weatherDescription: weatherDescription,temperature: temp, imageURL: imageURL});            
        }); 
    
    });

});

const userSchema=new mongoose.Schema({
    email: {
        type:String,
        required: [true, "Please check your data entry, email not specified."]
    },
    password:{
        type:String
    }
});

// userSchema.plugin(passportLocalMongoose);

const User= mongoose.model("User",userSchema);

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.get("/input", function(req,res){
//     if(req.isAuthenticated()){
//         res.render("input",{cssa:'input'});
//     }else{
//         res.redirect("/input");
//     }
// });


app.post("/signup",function(req,res){ 
    
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser=new User({
            email:req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("input",{cssa:'input'});
            }
        });
    });   
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result === true){
                        res.render("input",{cssa:'input'});
                    }
                });
            }
        }
    });    
});
 


app.listen(3000, function(){
    console.log("server started on port 3000");
});
