const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request")

const app = express();
var pageN =9
var cont="GetMoreNews" 
var a="POST"
var b="/news"
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("home",{textj:""})
})

app.get("/checker",(req,res)=>{
    res.render("checker");
})
function size(obj){
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function n(na){
    return numberWithCommas(Number(na))
}
app.post("/checker",(req,res)=>{
    symp = req.body.symp;
    dis = req.body.dis;
    info = req.body.info;
    // console.log(symp);
    // console.log(dis);
    // console.log(info);
    // console.log(Array.isArray(symp));
    // if(Array.isArray(symp) || Array.isArray(dis) || Array.isArray(info)){
    //     if(symp.indexOf("none1") !== -1 || dis.indexOf("none2") !== -1 || info.indexOf("none3") !== -1 ){
    //         res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup"})
    //     }
    //  } else 
     if(Array.isArray(symp) && Array.isArray(dis) && Array.isArray(info)){
        if(symp.indexOf("none1") === "-1" || dis.indexOf("none2") === "-1" || info.indexOf("none3") === "-1" ){
            res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup by <a class ='btn btn-dark'>Click Here</a>"})
        }else{
            res.render("home",{textj:"you risk level is high"})

        }
    } else if (Array.isArray(symp) && Array.isArray(dis) && Array.isArray(info)===false){
        if(symp.indexOf("none1") === "-1" || dis.indexOf("none2") === "none1" || info.indexOf("none3") === "none1" ){
            res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup by <a class ='btn btn-dark'>Click Here</a>"})
        }
        else if (symp === "none3"){
            res.render("home",{textj:"you risk level is medium"})
        } else {
            res.render("home",{textj:"you risk level is high"})
        }
        
    }else if(Array.isArray(symp) && Array.isArray(dis)===false && Array.isArray(info)===false){
        console.log("hi");
        
         if (dis === "none2" && info === "none3"){
            res.render("home",{textj:"your risk level is low"});
        } else {
            res.render("home",{textj:"your risk level is high"})
        }
        
    } else if(Array.isArray(symp)===false && Array.isArray(dis) && Array.isArray(info)===false){
        if(symp.indexOf("none1") === "none1" || dis.indexOf("none2") === "none1" || info.indexOf("none3") === "none1" ){
            res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup"})
        } else if(symp === "none1"&& info === "none3"){
            res.render("home",{textj:"your risk level is medium"})
        } else{
            res.render("home",{textj:"your risk level is medium"})
        }
    } else if(Array.isArray(symp)===false && Array.isArray(dis) && Array.isArray(info)){
        if(symp.indexOf("none1") === "none1" || dis.indexOf("none2") === "none1" || info.indexOf("none3") === "none1" ){
            res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup"})
        } else {
        res.render("home",{textj:"your risk level is medium"})
        }
    } else if (Array.isArray(symp) && Array.isArray(dis)===false && Array.isArray(info)){
        if(symp.indexOf("none1") === "none1" || dis.indexOf("none2") === "none1" || info.indexOf("none3") === "none1" ){
            res.render("home",{textj:"please dont choose nonee with other option.You can retake your checkup"})
        } else {
            res.render("home",{textj:"your risk level is medium"})
        }
    } else if(symp === "none1" && dis === "none2" && info ==="none3"){
        res.render("home",{textj:"your risk level is super low"})
    }else{
        res.render("home",{textj:"your risk level is  medium"})
    }
})
app.get("/cases",(req,res)=>{
    
    var options = {
        url : "https://api.covid19api.com/world/total",
        method: "GET",
    }
    request(options,function(error,response,body){
        data = JSON.parse(body)
        request("https://api.covid19api.com/live/country/india",function(e,r,boi){
            var IndiaData = JSON.parse(boi)
            var icdn = size(IndiaData);
            var icd = IndiaData[icdn-1];

            request("https://api.covid19api.com/total/country/united-states",function(ea,ra,boia){
            var aData = JSON.parse(boia)
            var acdn = size(aData);
            var acd = aData[acdn-1];
            
    res.render("cases",{gd:n(data.TotalDeaths),ga:n(data.TotalConfirmed),gr:n(data.TotalRecovered),id:n(icd.Deaths),ia:n(icd.Confirmed),ir:n(icd.Recovered),ad:n(acd.Deaths),aa:n(acd.Confirmed),ar:n(acd.Recovered)});
            })
        })
    });
})
app.post("/cases",(req,res)=>{
    con = req.body.country;
    conl = con.toLowerCase();
    request("https://api.covid19api.com/total/country/"+conl,function(ea,ra,boia){
        console.log(JSON.parse(boia))
        if(boia){
            const aData = JSON.parse(boia)
            const acdn = size(aData);
            const acd = aData[acdn-1];
            console.log(acd);

            res.send(`
            <html>
            <head>
            <title>Covid-19</title>
            <!-- font -->
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,900|Nunito+Sans:900i&display=swap" rel="stylesheet">
            
    <link rel="stylesheet" href="/css/bootstrap.css">
    <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
            <div id="nav-a">
            <h2 class="">${con}:</h2>
            <div class="row" id ="main-body">
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 active-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://img.etimg.com/thumb/width-640,height-480,imgsize-186873,resizemode-1,msid-74932435/noida-7-more-test-positive-for-covid-19-in-last-24-hours-active-cases-39.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">CONFIRMED:</h5>
                          <p class="card-text">${n(acd.Confirmed)} </p>
                        </div>
                      </div>
                </div>
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 death-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202003/Suicide_1_0.jpeg?7ca8_EQg8pUbZchwhekwUx3xwsvFcCqQ" class="card-img-top img-death" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">DEATHS:</h5>
                          <p class="card-text">${n(acd.Deaths)} </p>
                        </div>
                      </div>
                </div>
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 rec-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://i.dailymail.co.uk/1s/2020/03/02/23/25451918-8066545-More_people_in_China_have_recovered_from_coronavirus_than_are_cu-a-11_1583190863935.jpg" class="card-img-top img-rec" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">RECOVERED:</h5>
                          <p class="card-text">${n(acd.Recovered)} </p>
                        </div>
                      </div>
                </div>
                <h1><a href='/' role = "button" class="btn btn-primary btn-lg ml-auto mr-auto">Go to home</a></h1> 
            </div>
            </div>
            </body>
            </html>`)
        } else {
            res.send("sorry");
        }
        })
})
app.get("/news/:n",(req,res)=>{
    const n = Number(req.params.n);
    request("https://newsapi.org/v2/top-headlines?q=corona%20virus&country=in&category=health&pageSize="+n+"&apiKey=<Enter your own api key from news api>",function(error,response,body){
        var news = [JSON.parse(body).articles]
        // console.log(news[0]["articles"]);
        request("https://newsapi.org/v2/everything?q=covid-19&pageSize="+n+"&apiKey=69c0850d9aa44307b93aa8928a42fb11",function(er,rsponse,bo){
            var nw = [JSON.parse(bo).articles]
            
        res.render("news",{posts:news,pw:nw,c:cont,p:b,d:a})
        })
    })
})
app.post("/news",(req,res)=>{
 res.redirect("/news/20")
})
let port = process.env.PORT;
if (port === null || port === "") {
    port = 3000;
}
app.listen(port || 3000,()=>{
    console.log("website started")
})
