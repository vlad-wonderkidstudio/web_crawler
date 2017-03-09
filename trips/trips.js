var querystring = require("querystring");
var proxyManager = require('../lib/proxy.manager.js');
var tt = 0;
var proxy = proxyManager.getProxies();
var gateProxy = {};
var numProxy = 0;
wh =0;
var components = {"8000001" : "Aachen Hbf", "1290401" : "Wien Hbf",     "8100108" : "Innsbruck Hbf",
                    "8100173" : "Graz Hbf",   "8100002" : "Salzburg Hbf", "1291501" : "Wien Westbahnhof",
                    "1120109" : "Annabichl (Klagenfurt)", "8100013" : "Linz/Donau Hbf",
                    "8507000" : "Bern", "8506013" : "Aadorf" 
                 };
exports.getTrips = function () {
  return function (req, res) {
    _setProxy( function (data){ 
      result = '';
      i=0;
      tt=0;
      wh = 0;
      (function f( i ) {
      if ( i > 24 ){ res.send((result)); return;}
        _getTrips(req, res, function(rs) {
          if( rs === "false" )
          {
            numProxy ++;
            if( numProxy >= proxy.length )
              numProxy = 0;
            gateProxy = split_proxy(numProxy);
            wh ++;
            tt = i-1;
            if ( wh >= proxy.length )
            {
              result += rs;
              f( i + 1 );
            }
              
            else
              f( i );
          }
          else
          {
            result += rs;
            f( i + 1 );
          }
            
        });
      })(1);
    
    } );
  }
}
/* */
function _pars(feed, callback)
{
  var cheerio = require('cheerio');
  var bb;
  var $ = cheerio.load( feed );
  table='<table>';
  var showall = $('#showAllDetails').attr('href');
  var http = require('http');
  http.get(showall, function(resp){
      var feed = '';
      resp.on('data', function(chunk){
        feed += chunk.toString();
      }).on('end', function() {
        var bcol = "#dfdfdf";
                $('table.hfs_overview > tr').each(function(){
                    if( bcol == "#dfdfdf" )
                      bcol = "#afafaf";
                    else
                      bcol = "#dfdfdf";
                    table+='<tr bgcolor="'+bcol+'">'+$(this).html()+'</tr>';
                });
                table += '</table><hr/ size="5">';
                callback(table);
                //callback(feed);
      });
  }).on("error", function(e){
      console.log("Got error: " + e.message);
    });
        
  return ( table );    
   //return ( feed ); 
}
/** set proxy from list */
function _setProxy (callback)
{
  var j = 0;
  (function ff( j ) {
    if ( j > proxy.length ){ callback(); return; }
      var http = require("http");
      numProxy = j-1;
      gateProxy = split_proxy(numProxy);
      var url = 'http://fahrplan.sbb.ch/bin/query.exe/en';
      var options = {
                      host:       gateProxy.host,
                      port:       gateProxy.port,
                      path:       url,
                      headers:    {
                          'Proxy-Authorization':  'Basic ' + new Buffer(gateProxy.user + ':' + gateProxy.pass).toString('base64'),
                      }
                    };
      request = http.request(options, function(response) {
        var chunks = [];
        response.on('data', function(chunk) {
          chunks.push(chunk);
        });
        response.on('end', function() {
          body = Buffer.concat(chunks).toString();
          if( ( body.length < 5 ) )
            ff( j + 1 );
          else
            callback();
        });
      });
      request.on('error', function(error) {
        console.log(error.message);
        ff( j + 1 );
      });
      request.end();
    })(1);
}
/** */
function _getTrips (req, res, callback)
{
  var http = require("http");
  var JStopsS0G = components[req.query.dep_ident];
  var JStopsZ0G = components[req.query.arr_ident];
  var req_date = req.query.date;
  var req_time = '00:01';
  if( tt )
  {
    req_time = '0' + tt + ':00';
    if( tt > 9 )
    {
      req_time = tt + ':00';
    }
  }
  tt++;
  var postData = querystring.stringify(
   { 
           queryPageDisplayed: "yes",
           "HWAI=JS!ajax": "yes",
           "HWAI=JS!js": "yes",
           HWAI: "~CONNECTION!",
           REQ0Total_KissRideMotorClass: "404",
           REQ0Total_KissRideCarClass: "5",
           REQ0Total_KissRide_maxDist: "10000000",
           REQ0Total_KissRide_minDist: "0",
           REQComparisonCarload: "0",
           REQ0JourneyStopsS0G: JStopsS0G,
           REQ0JourneyStopsS0ID: "A=1@O=Bern@X=7439122@Y=46948825@U=85@L=008507000@B=1@p=1481019526@",
           REQ0JourneyStopsS0A: "255",
           REQ0JourneyStopsZ0G: JStopsZ0G,
           REQ0JourneyStopsZ0ID: "A=1@O=Aadorf@X=8903285@Y=47488115@U=85@L=008506013@B=1@p=1481019526@",
           REQ0JourneyStopsZ0A: "255",
           "REQ0JourneyStops1.0G": "",
           "REQ0JourneyStops1.0A": "1",
           REQ0JourneyStopover1: "",
           date: req_date,
           REQ0JourneyTime: req_time,
           REQ0HafasSearchForw: "1",
           "changeQueryInputData=yes&start": "Search+connection",
           "REQ0JourneyStops2.0G": "",
           "REQ0JourneyStops2.0A": "1",
           REQ0JourneyStopover2: "",
           "REQ0JourneyStops3.0G": "",
           "REQ0JourneyStops3.0A": "1",
           REQ0JourneyStopover3: "",
           "REQ0JourneyStops4.0G": "",
           "REQ0JourneyStops4.0A": "1",
           REQ0JourneyStopover4: "",
           "REQ0JourneyStops5.0G": "",
           "REQ0JourneyStops5.0A": "1",
           REQ0JourneyStopover5: "",
           existOptimizePrice: "0",
           existUnsharpSearch: "yes",
           REQ0HafasChangeTime: "0:1",
           existHafasAttrExc: "yes",
           REQ0JourneyProduct_prod_0: "1",
           existProductBits0: "yes",
           REQ0JourneyProduct_prod_1: "1",
           REQ0JourneyProduct_prod_2: "1",
           REQ0JourneyProduct_prod_3: "1",
           REQ0JourneyProduct_prod_4: "1",
           REQ0JourneyProduct_prod_5: "1",
           REQ0JourneyProduct_prod_6: "1",
           REQ0JourneyProduct_prod_7: "1",
           REQ0JourneyProduct_prod_8: "1",
           REQ0JourneyProduct_prod_9: "1",
           REQ0JourneyProduct_opt_section_0_list: "0:0000",
           disableBaim: "yes&REQ0HafasHandicapLimit=4:4"

        });
  var url = 'http://fahrplan.sbb.ch/bin/query.exe/en';
  var options = {
    method: 'POST',
    host:       gateProxy.host,
    port:       gateProxy.port,
    path:       url,
    headers:    {
		    'Content-Length': Buffer.byteLength(postData),
        'Proxy-Authorization':  'Basic ' + new Buffer(gateProxy.user + ':' + gateProxy.pass).toString('base64'),
      }
    };
    var request = http.request(options, function(response) {
    var chunks = [];
    response.on('data', function(chunk) {
        chunks.push(chunk);
    });
    response.on('end', function() {
        body = Buffer.concat(chunks).toString();
        var table_ok  = body.indexOf("hfs_overview");
        if( (table_ok+1) )
          _pars(body, function(res) { callback(res)});
        else
        {
          callback("false"); 
        }
          
      });
    });

  request.on('error', function(error) {
      console.log('connect error:' + error.message);
  });
  request.write(postData);
  request.end();
}

/* */

function split_proxy (i) {
  var item = proxy[i].split(":");
  itemm = item[2].split("@");
  return {"url": proxy[i], "host" : itemm[1], "user" : item[1].substr(2),"pass" : itemm[0], "port" : item[3]};
}
  
  
