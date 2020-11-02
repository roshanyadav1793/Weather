const express=require('express');
const bodyParser=require('body-parser');
const https=require('https');
const ejs=require('ejs');

const app=express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.render("index",{cssa:'index'});
});

app.get("/SignUp", function(req,res){
    res.render("login",{cssa:'login'});
});

app.get("/Login", function(req,res){
    res.render("login",{cssa:'login'});
});
app.get("/input", function(req,res){
    res.render("input",{cssa:'index'});
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
            res.write("<p>The weather is currently " + weatherDescription+"</p>");
            res.write("<h1>The temperature in "+ query + " is "+ temp+" degrees celcius.</h1>");
            res.write("<img src="+ imageURL+">");
            res.send();
            res.set('Content-Type', 'text/html');
        });
    
    });

});
 


app.listen(3000, function(){
    console.log("server started on port 3000");
});