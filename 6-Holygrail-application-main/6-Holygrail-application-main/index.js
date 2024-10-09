var express = require('express');
var app     = express();
var redis = require("redis"); 
var client = redis.createClient(); 

//init values
client.mset('header',0, 'left',0, 'article',0, 'right',0, 'footer',0);
client.mget(['header', 'left', 'article', 'right', 'footer'],
    function(err, value){
        console.log(value)
    });

// serve static files from public directory
app.use(express.static('public'));

// init values
client.mset('header',0,'left',0,'article',0,'right',0,'footer',0);
client.mget(['header','left','article','right','footer'], 
  function(err, value) {
    console.log(value);
});   

//Write your code for function data that returns
//relevant dats to all holy grail section
function data(){
    return new Promise((resolve, reject) => {
        client.mget(['header', 'left', 'article', 'right', 'footer'], function(err, values) {
            if (err) {
                reject(err);
            } else {
                const result = {
                    header: values[0],
                    left: values[1],
                    article: values[2],
                    right: values[3],
                    footer: values[4]
                };
                resolve(result);
            }
        });
    });

}

// get key data
app.get('/data', function (req, res) {
    data()            
        .then(data => {
            console.log(data);
            res.send(data);                
        });
});


// plus
app.get('/update/:key/:value', function (req, res) {
    const key = req.params.key;
    let value = Number(req.params.value);
    client.get(key, function(err, reply) {

        // new value
        value = Number(reply) + value;
        client.set(key, value);

        // return data to client
        data()            
            .then(data => {
                console.log(data);
                res.send(data);                
            });
    });   
});

app.listen(3000, () => {
  console.log('Running on 3000');
});

process.on("exit", function(){
    client.quit();
});