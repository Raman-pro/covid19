const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request")
const nodemailer = require('nodemailer')
const mongoose= require('mongoose')

mongoose.connect("mongodb+srv://admin:ramanjot@1@cluster0-iikae.gcp.mongodb.net/covDB", {useNewUrlParser: true,useUnifiedTopology: true});

const mailschema = {
    mail:String,
    exists:Boolean
}


const Mail = mongoose.model("Mail", mailschema);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'covid19helper4u@gmail.com',
        pass: 'Ramanjot@12'
    }
});

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
    if((Array.isArray(symp) || Array.isArray(dis)|| Array.isArray(info)) && (symp.indexOf("none1") !== -1 || dis.indexOf("none2") !== -1 || info.indexOf("none3") !== -1 )){
            res.render("home",{textj:"please dont choose none with other option.Please retake your checkup"})
            console.log("none")
    } else if(Array.isArray(symp) && Array.isArray(dis)===false && Array.isArray(info)===false){
        console.log("hi");
        
         if (dis === "none2" && info === "none3"){
            res.render("home",{textj:"your risk level is low"});
        } else {
            res.render("home",{textj:"your risk level is high"})
        }
        
    } else if(Array.isArray(symp)===false && Array.isArray(dis) && Array.isArray(info)===false){
        if(symp === "none1"&& info === "none3"){
            res.render("home",{textj:"your risk level is medium"})
        } else{
            res.render("home",{textj:"your risk level is medium"})
        }
    } else if(Array.isArray(symp)===false && Array.isArray(dis) && Array.isArray(info)){
        res.render("home",{textj:"your risk level is medium"})
    } else if (Array.isArray(symp) && Array.isArray(dis)===false && Array.isArray(info)){
            res.render("home",{textj:"your risk level is medium"})
    } else if (Array.isArray(symp) && Array.isArray(dis) && Array.isArray(info)==false){
        res.render("home",{textj:"your risk level is high"})
    }else if(symp === "none1" && dis === "none2" && info ==="none3"){
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
        request("https://corona.lmao.ninja/v2/countries/India?yesterday=true&strict=true&query",function(e,r,boi){
            var icd = JSON.parse(boi)
            request("https://corona.lmao.ninja/v2/countries/USA?yesterday=true&strict=true&query",function(ea,ra,boia){
            var acd = JSON.parse(boia)
            
    res.render("cases",{gd:n(data.TotalDeaths),ga:n(data.TotalConfirmed),gr:n(data.TotalRecovered),id:n(icd.deaths),ia:n(icd.cases),ir:n(icd.recovered),ad:n(acd.deaths),aa:n(acd.cases),ar:n(acd.recovered)});
            })
        })
    });
})
app.post("/cases",(req,res)=>{
    con = req.body.country;
    conl = con.toLowerCase();
    request(`https://corona.lmao.ninja/v2/countries/${conl}?yesterday=false&strict=true&query/`,function(ea,ra,boia){
        if(boia){
            const acd = JSON.parse(boia)
            console.log(acd);
            if(acd.message==="Country not found or doesn't have any cases"){
                res.send("<h1>sorry the county didn't allowed for getting the cases <a href=\"/cases\"> click here to go back </a></h1>");
            }else{
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
            <div class="row" id ="main-body" style="text-align:center;margin-left:auto;margin-right:auto">
                <img src=${acd.countryInfo.flag} alt="flag" style="text-align:center">
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 active-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://img.etimg.com/thumb/width-640,height-480,imgsize-186873,resizemode-1,msid-74932435/noida-7-more-test-positive-for-covid-19-in-last-24-hours-active-cases-39.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">CONFIRMED:</h5>
                          <p class="card-text">${n(acd.cases)} </p>
                        </div>
                      </div>
                </div>
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 death-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202003/Suicide_1_0.jpeg?7ca8_EQg8pUbZchwhekwUx3xwsvFcCqQ" class="card-img-top img-death" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">DEATHS:</h5>
                          <p class="card-text">${n(acd.deaths)} </p>
                        </div>
                      </div>
                </div>
                <div class="col-lg-4 col-md-4 col-md-4 col-sm-12 rec-case case">
                    <div class="card" style="width: 18rem;">
                        <img src="https://i.dailymail.co.uk/1s/2020/03/02/23/25451918-8066545-More_people_in_China_have_recovered_from_coronavirus_than_are_cu-a-11_1583190863935.jpg" class="card-img-top img-rec" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">RECOVERED:</h5>
                          <p class="card-text">${n(acd.recovered)} </p>
                        </div>
                      </div>
                </div>
                <h1><a href='/' role = "button" class="btn btn-primary btn-lg ml-auto mr-auto">Go to home</a></h1> 
            </div>
            </div>
            </body>
            </html>`)
        }
    }
        })
})
app.get("/news/:n",(req,res)=>{
    const n = Number(req.params.n);
    request("https://newsapi.org/v2/top-headlines?q=corona%20virus&country=in&category=health&pageSize="+n+"&apiKey=69c0850d9aa44307b93aa8928a42fb11",function(error,response,body){
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
app.get("/emailreport",(req,res)=>{
    res.render("nl")
})
app.post("/emailreport",(req,res)=>{
    var mail = req.body.mail;
    request("https://newsapi.org/v2/top-headlines?q=corona%20virus&country=in&category=health&pageSize="+4+"&apiKey=69c0850d9aa44307b93aa8928a42fb11",function(error,response,body){
        var news = JSON.parse(body).articles
        console.log(news)
        request("https://api.covid19api.com/total/country/india",function(e,r,boi){
        var IndiaData = JSON.parse(boi)
        var icdn = size(IndiaData);
        var icd = IndiaData[icdn-1];
    var mailOptions = {
        from: 'covid19helper4u@gmail.com',
        to: mail,
        subject: 'covid - 19 helper News Letter',
        html:`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
\t\tbody {
\t\t\tmargin: 0;
\t\t\tpadding: 0;
\t\t}

\t\ttable,
\t\ttd,
\t\ttr {
\t\t\tvertical-align: top;
\t\t\tborder-collapse: collapse;
\t\t}

\t\t* {
\t\t\tline-height: inherit;
\t\t}

\t\ta[x-apple-data-detectors=true] {
\t\t\tcolor: inherit !important;
\t\t\ttext-decoration: none !important;
\t\t}
\t</style>
<style id="media-query" type="text/css">
\t\t@media (max-width: 690px) {

\t\t\t.block-grid,
\t\t\t.col {
\t\t\t\tmin-width: 320px !important;
\t\t\t\tmax-width: 100% !important;
\t\t\t\tdisplay: block !important;
\t\t\t}

\t\t\t.block-grid {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.col {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.col>div {
\t\t\t\tmargin: 0 auto;
\t\t\t}

\t\t\timg.fullwidth,
\t\t\timg.fullwidthOnMobile {
\t\t\t\tmax-width: 100% !important;
\t\t\t}

\t\t\t.no-stack .col {
\t\t\t\tmin-width: 0 !important;
\t\t\t\tdisplay: table-cell !important;
\t\t\t}

\t\t\t.no-stack.two-up .col {
\t\t\t\twidth: 50% !important;
\t\t\t}

\t\t\t.no-stack .col.num4 {
\t\t\t\twidth: 33% !important;
\t\t\t}

\t\t\t.no-stack .col.num8 {
\t\t\t\twidth: 66% !important;
\t\t\t}

\t\t\t.no-stack .col.num4 {
\t\t\t\twidth: 33% !important;
\t\t\t}

\t\t\t.no-stack .col.num3 {
\t\t\t\twidth: 25% !important;
\t\t\t}

\t\t\t.no-stack .col.num6 {
\t\t\t\twidth: 50% !important;
\t\t\t}

\t\t\t.no-stack .col.num9 {
\t\t\t\twidth: 75% !important;
\t\t\t}

\t\t\t.video-block {
\t\t\t\tmax-width: none !important;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tmin-height: 0px;
\t\t\t\tmax-height: 0px;
\t\t\t\tmax-width: 0px;
\t\t\t\tdisplay: none;
\t\t\t\toverflow: hidden;
\t\t\t\tfont-size: 0px;
\t\t\t}

\t\t\t.desktop_hide {
\t\t\t\tdisplay: block !important;
\t\t\t\tmax-height: none !important;
\t\t\t}
\t\t}
\t</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 17px;">
<p style="font-size: 24px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px; color: #303030;"><strong>COVID-19 HELPER.</strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">A WEBSITE WHICH HAVE ALL THE FEATURES TO MAKE YOU AWARE ABOUT COVID-19</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://lit-earth-76017.herokuapp.com/" style="height:31.5pt; width:151.5pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#d87d8e"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://lit-earth-76017.herokuapp.com/" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #d87d8e; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #d87d8e; border-right: 1px solid #d87d8e; border-bottom: 1px solid #d87d8e; border-left: 1px solid #d87d8e; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">↪ Go To Website</span></span></a>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 60px; padding-bottom: 60px; padding-left: 60px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://t3.ftcdn.net/jpg/03/30/32/46/240_F_330324614_8JksURgzdSIgDdJFE9MgBHp3DV3AMhrL.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 670px; display: block;" title="Alternate text" width="670"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 60px; padding-bottom: 60px; padding-left: 60px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 80px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 96px; margin: 0;"><span style="font-size: 80px;">INDIA :</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 40px; padding-right: 40px; padding-bottom: 40px; padding-left: 40px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://images.financialexpress.com/2020/04/covid-19-test-5.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 201px; display: block;" title="Image" width="201"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 58px; mso-line-height-alt: 70px; margin: 0;"><span style="font-size: 58px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 24px; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong><span style="font-size: 42px;">CASES: ${icd.Confirmed}</span><br/></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 58px; mso-line-height-alt: 70px; margin: 0;"><span style="font-size: 58px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div class="mobile_hide">
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f6e7e9;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#f6e7e9;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#f6e7e9"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:#f6e7e9;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:20px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 40px; padding-top: 15px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:15px;padding-right:10px;padding-bottom:10px;padding-left:40px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 24px; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong>DEATHS : ${icd.Deaths}</strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="5" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="5" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:#f6e7e9;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:55px; padding-bottom:0px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:55px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 5px;padding-left: 5px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="center"><![endif]-->
<div style="font-size:1px;line-height:5px"> </div><img align="center" alt="Image" border="0" class="center autowidth" src="data:image/png;base64,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" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 190px; display: block;" title="Image" width="190"/>
<div style="font-size:1px;line-height:5px"> </div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 46px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 55px; margin: 0;"><span style="font-size: 46px;">Recovered: ${icd.Recovered}</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><strong> Enjoy our</strong><strong><br/></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top: 5px; padding-bottom: 5px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px;">
<div style="line-height: 1.2; font-size: 12px; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; color: #282828; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><span style="font-size: 46px; color: #d87d8e;">THANKS FOR REGISTERING</span><strong><br/></strong></span></p>
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><span style="font-size: 46px; color: #d87d8e;">FOR OUR NEWSLETTER</span></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://lit-earth-76017.herokuapp.com/" style="height:31.5pt; width:168.75pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#d87d8e"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://lit-earth-76017.herokuapp.com/" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #d87d8e; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #d87d8e; border-right: 1px solid #d87d8e; border-bottom: 1px solid #d87d8e; border-left: 1px solid #d87d8e; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">↪ GO TO WEBSITE</span></span></a>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTGvmoV34_h12qIHx-xuEUGEPmXYFfw_y3T28CEGamwNl5E61V4&amp;usqp=CAU" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 569px; display: block;" title="Image" width="569"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:transparent;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">NEWs:</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center autowidth" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 650px; display: block;" title="Image" width="650"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[1].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[1].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[1].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[1].url}>READ FULL PARA</a>></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">by ${news[1].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[2].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[2].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[2].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[2].url}>READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news[2].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src= ${news[0].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[0].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[0].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[0].url} >READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news[0].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[3].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[3].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[3].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[3].url}>READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news.author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:transparent;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border
-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 96px; mso-line-height-alt: 115px; margin: 0;"><span style="font-size: 96px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:132pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><a href="https://lit-earth-76017.herokuapp.com/news/12">READ MORE</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 96px; mso-line-height-alt: 115px; margin: 0;"><span style="font-size: 96px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send("<h1>Your mail might be incorrect . mail : " + mail +" you can register again by <a href='/emailreport'>clicking here</a> </h1>")
        } else {

            const user= new Mail({
                mail:mail,
                exists:true
            })
            user.save(function(err){
                if(err){
                    console.log(err)
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send("<h1 style='font-size: 3rem'>Success! newsletter subrcibed . example mail is sent in your mail  Check it now.You will receive this type of mail after every 2 days.</h1> <a href='/'>Go to home</a>")
                }
            });
        }
    });
    })
    })
})
let port = process.env.PORT;
if (port === null || port === "") {
    port = 3000;
}
app.listen(port || 3000,()=>{
    console.log("website started")
})
app.get("/sendMail",function(req,res){
    var mailser = [];
    request("https://newsapi.org/v2/top-headlines?q=corona%20virus&country=in&category=health&pageSize="+4+"&apiKey=69c0850d9aa44307b93aa8928a42fb11",function(error,response,body){
        var news = JSON.parse(body).articles
        console.log(news)
        request("https://api.covid19api.com/total/country/india",function(e,r,boi){
            var IndiaData = JSON.parse(boi)
            var icdn = size(IndiaData);
            var icd = IndiaData[icdn-1];
            Mail.find({}, function(err, mails){
            mails.forEach((maile)=>{


        var mailOptions = {
            from: 'covid19helper4u@gmail.com',
            to: maile.mail,
            subject: 'covid - 19 helper News Letter',
            html:`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
\t\tbody {
\t\t\tmargin: 0;
\t\t\tpadding: 0;
\t\t}

\t\ttable,
\t\ttd,
\t\ttr {
\t\t\tvertical-align: top;
\t\t\tborder-collapse: collapse;
\t\t}

\t\t* {
\t\t\tline-height: inherit;
\t\t}

\t\ta[x-apple-data-detectors=true] {
\t\t\tcolor: inherit !important;
\t\t\ttext-decoration: none !important;
\t\t}
\t</style>
<style id="media-query" type="text/css">
\t\t@media (max-width: 690px) {

\t\t\t.block-grid,
\t\t\t.col {
\t\t\t\tmin-width: 320px !important;
\t\t\t\tmax-width: 100% !important;
\t\t\t\tdisplay: block !important;
\t\t\t}

\t\t\t.block-grid {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.col {
\t\t\t\twidth: 100% !important;
\t\t\t}

\t\t\t.col>div {
\t\t\t\tmargin: 0 auto;
\t\t\t}

\t\t\timg.fullwidth,
\t\t\timg.fullwidthOnMobile {
\t\t\t\tmax-width: 100% !important;
\t\t\t}

\t\t\t.no-stack .col {
\t\t\t\tmin-width: 0 !important;
\t\t\t\tdisplay: table-cell !important;
\t\t\t}

\t\t\t.no-stack.two-up .col {
\t\t\t\twidth: 50% !important;
\t\t\t}

\t\t\t.no-stack .col.num4 {
\t\t\t\twidth: 33% !important;
\t\t\t}

\t\t\t.no-stack .col.num8 {
\t\t\t\twidth: 66% !important;
\t\t\t}

\t\t\t.no-stack .col.num4 {
\t\t\t\twidth: 33% !important;
\t\t\t}

\t\t\t.no-stack .col.num3 {
\t\t\t\twidth: 25% !important;
\t\t\t}

\t\t\t.no-stack .col.num6 {
\t\t\t\twidth: 50% !important;
\t\t\t}

\t\t\t.no-stack .col.num9 {
\t\t\t\twidth: 75% !important;
\t\t\t}

\t\t\t.video-block {
\t\t\t\tmax-width: none !important;
\t\t\t}

\t\t\t.mobile_hide {
\t\t\t\tmin-height: 0px;
\t\t\t\tmax-height: 0px;
\t\t\t\tmax-width: 0px;
\t\t\t\tdisplay: none;
\t\t\t\toverflow: hidden;
\t\t\t\tfont-size: 0px;
\t\t\t}

\t\t\t.desktop_hide {
\t\t\t\tdisplay: block !important;
\t\t\t\tmax-height: none !important;
\t\t\t}
\t\t}
\t</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 17px;">
<p style="font-size: 24px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px; color: #303030;"><strong>COVID-19 HELPER.</strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">A WEBSITE WHICH HAVE ALL THE FEATURES TO MAKE YOU AWARE ABOUT COVID-19</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://lit-earth-76017.herokuapp.com/" style="height:31.5pt; width:151.5pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#d87d8e"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://lit-earth-76017.herokuapp.com/" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #d87d8e; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #d87d8e; border-right: 1px solid #d87d8e; border-bottom: 1px solid #d87d8e; border-left: 1px solid #d87d8e; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">↪ Go To Website</span></span></a>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 60px; padding-bottom: 60px; padding-left: 60px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://t3.ftcdn.net/jpg/03/30/32/46/240_F_330324614_8JksURgzdSIgDdJFE9MgBHp3DV3AMhrL.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 670px; display: block;" title="Alternate text" width="670"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 60px; padding-bottom: 60px; padding-left: 60px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 80px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 96px; margin: 0;"><span style="font-size: 80px;">INDIA :</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 40px; padding-right: 40px; padding-bottom: 40px; padding-left: 40px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://images.financialexpress.com/2020/04/covid-19-test-5.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 201px; display: block;" title="Image" width="201"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 58px; mso-line-height-alt: 70px; margin: 0;"><span style="font-size: 58px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 24px; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong><span style="font-size: 42px;">CASES: ${icd.Confirmed}</span><br/></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 58px; mso-line-height-alt: 70px; margin: 0;"><span style="font-size: 58px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div class="mobile_hide">
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f6e7e9;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#f6e7e9;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#f6e7e9"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:#f6e7e9;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:20px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 40px; padding-top: 15px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:15px;padding-right:10px;padding-bottom:10px;padding-left:40px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 24px; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong>DEATHS : ${icd.Deaths}</strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="5" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 5px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="5" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:#f6e7e9;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:55px; padding-bottom:0px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:55px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 5px;padding-left: 5px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="center"><![endif]-->
<div style="font-size:1px;line-height:5px"> </div><img align="center" alt="Image" border="0" class="center autowidth" src="data:image/png;base64,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" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 190px; display: block;" title="Image" width="190"/>
<div style="font-size:1px;line-height:5px"> </div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:#ffffff;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 46px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 55px; margin: 0;"><span style="font-size: 46px;">Recovered: ${icd.Recovered}</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: undefined; line-height: 1.2; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: NaNpx;">
<p style="font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px; margin: 0;"></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<div style="line-height: 1.2; font-size: 12px; color: #282828; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><strong> Enjoy our</strong><strong><br/></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top: 5px; padding-bottom: 5px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
<div style="color:#282828;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px;">
<div style="line-height: 1.2; font-size: 12px; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; color: #282828; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><span style="font-size: 46px; color: #d87d8e;">THANKS FOR REGISTERING</span><strong><br/></strong></span></p>
<p style="line-height: 1.2; word-break: break-word; text-align: center; font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px;"><span style="font-size: 46px; color: #d87d8e;">FOR OUR NEWSLETTER</span></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://lit-earth-76017.herokuapp.com/" style="height:31.5pt; width:168.75pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#d87d8e"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://lit-earth-76017.herokuapp.com/" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #d87d8e; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #d87d8e; border-right: 1px solid #d87d8e; border-bottom: 1px solid #d87d8e; border-left: 1px solid #d87d8e; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">↪ GO TO WEBSITE</span></span></a>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTGvmoV34_h12qIHx-xuEUGEPmXYFfw_y3T28CEGamwNl5E61V4&amp;usqp=CAU" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 569px; display: block;" title="Image" width="569"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:transparent;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">NEWs:</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center autowidth" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 650px; display: block;" title="Image" width="650"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[1].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[1].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[1].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[1].url}>READ FULL PARA</a>></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">by ${news[1].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[2].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[2].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[2].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[2].url}>READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news[2].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:transparent;">
<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src= ${news[0].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[0].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[0].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[0].url} >READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news[0].author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="335" style="background-color:transparent;width:335px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 335px; display: table-cell; vertical-align: top; width: 335px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src=${news[3].urlToImage} style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 335px; display: block;" title="Alternate text" width="335"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[3].title}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${news[3].content}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:94.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><a href=${news[3].url}>READ FULL PARA</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">BY ${news.author}</p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<div style="background-color:#ffeff3;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 670px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffeff3;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:670px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="670" style="background-color:transparent;width:670px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 670px; display: table-cell; vertical-align: top; width: 670px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 96px; mso-line-height-alt: 115px; margin: 0;"><span style="font-size: 96px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:31.5pt; width:132pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><a href="https://lit-earth-76017.herokuapp.com/news/12">READ MORE</a></span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
<p style="line-height: 1.2; word-break: break-word; font-size: 96px; mso-line-height-alt: 115px; margin: 0;"><span style="font-size: 96px;"> </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>
        `
        };

            transporter.sendMail(mailOptions, function(error, info){
                            mailser.push("mail sent to:"+ maile.mail)
            });
            })
            });
            res.send(mailser)
        })
    })
})

app.use(function (req, res, next) {
    res.status(404).send("Opps my bad not found! <a href='/'> Go home</a>")
})
