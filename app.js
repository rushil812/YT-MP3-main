// Required Packages
const { render } = require("ejs");
const express = require("express");
const fetch=  require("node-fetch");
require("dotenv").config();

// Creating Express Server
const app=express();

// Port Number
const PORT = process.env.PORT || 3000;

// SET TEMPLATE ENGLINE
app.set("view engine","ejs");
app.use(express.static("public"));

// Parsing of html data to  give output
app.use(express.urlencoded({
    extended : true
}))
app.use(express.json());

app.get("/", (req,res)=>{
    res.render("index")
} )

app.post("/convert-mp3", async (req,res)=>{
    const videoID= req.body.videoID;
    if(videoID==undefined || videoID=="" || videoID==null)
    {
        return res.render("index",{success : false, message : "please enter a correct vedio ID"});
    }
    else{
        const fetchAPI= await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,{
            "method" : "GET",
            "headers":{
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host":process.env.API_HOST
            }
        });
         
     const fetchResponse= await fetchAPI.json();
     if(fetchResponse.status=="ok")
     {
        return res.render("index",{success : true , song_title:fetchResponse.title, song_link: fetchResponse.link});
     }
     else return res.render("index",{success:false,message: fetchResponse.msg}); 
    }
} )

// Start The server
app.listen(PORT ,()=>{
    console.log(`Server started at port ${PORT}`);
})