const express=require('express');
const bodyParser=require('body-parser');
const https=require('https');
const ejs=require('ejs');
const mongoose=require('mongoose');
const request=require('request-promise');
// const session=require('express-session');
// const passport=require('passport');
// const passportLocalMongoose =require('passport-local-mongoose');
// const LocalStrategy = require('passport-local');
const bcrypt=require('bcrypt');
const saltRounds=10;

const app=express();

var city = {};
let weatherData = [];

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

mongoose.connect("mongodb+srv://roshanyadav1793:Roshan@123@cluster0.ghlct.mongodb.net/weatherDB",{ useNewUrlParser: true ,useUnifiedTopology: true });
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
            weatherData=JSON.parse(data);
            const temp=weatherData.main.temp;
            const feels_like=weatherData.main.feels_like;
            const description=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const clouds = weatherData.clouds.all;
            const imageURL="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
            const cloudsImageURL = "http://openweathermap.org/img/wn/03n@2x.png";
            // res.setHeader('Content-Type', 'text/html');
            // res.write("<p>The weather is currently " + weatherDescription+"</p>");
            // res.write("<h1>The temperature in "+ query + " is "+ temp+" degrees celcius.</h1>");
            // res.write("<img src="+ imageURL+">");
            //  res.render("temp",{query: query, weatherDescription: weatherDescription,temperature: temp, imageURL: imageURL});   

            console.log(weatherData);
            var city = query;
            res.redirect("/result");
                     
        }); 
    
    });

    
});

const content1 = "11Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc";


app.get("/result", function(req, res) {
    res.render('result', {
      content: content1,
      description: weatherData.description,
      city: weatherData.city,
      temp: weatherData.temp,
      feelsLike: weatherData.feels_like  
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
                    }else{
                        console.log("incorrect password");                       
                        res.redirect("/");
                    }
                });
            }
        }
    });    
});
 


app.listen(3000, function(){
    console.log("server started on port 3000");
});
