// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Define function to create the circle radius based on the magnitude
  function radiusSize(magnitude) {
    return magnitude * 3;
  }

  // Define function to set the circle color based on the magnitude
  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#ccff33"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ffcc33"
    }
    else if (magnitude < 4) {
      return "#ff9933"
    }
    else if (magnitude < 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circleMarker(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
        
      }).bindPopup(function (layer) {
        
      });
    },
    onEachFeature: onEachFeature
  });
console.log(earthquakes)
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
 var faultLine = new L.LayerGroup();
  
  
var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
// Create the faultlines and add them to the faultline layer
d3.json(faultlinequery, function(data) {
  L.geoJSON(data, {
    style: function(feature) {
      return {color: "red", fillOpacity: 0}
    }
  }).addTo(faultLine)

});
var volcanoes = new L.LayerGroup();
var volcanoeLocation = "https://raw.githubusercontent.com/apelserg/data-osm-getdata/master/geojson/osmnode-volcano.geojson";


d3.json(volcanoeLocation, function(data) {
  L.geoJSON(data, {
    style: function(feature) {
    return {fillOpacity: .05}
    }
  }).bindPopup(function (layer) {
    return layer.feature.properties.Name;
  })
  .addTo(volcanoes)
});





function createMap(earthquakes) {

  // Define outdoormap, satellitemap, and grayscalemap layers
  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    'worldCopyJump': false,
    
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create the faultline layer
 
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines: faultLine,
    Volcanoes: volcanoes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [outdoorsmap, earthquakes, faultLine, volcanoes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Query to retrieve the faultline data
  // var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
  // // Create the faultlines and add them to the faultline layer
  // d3.json(faultlinequery, function(data) {
  //   L.geoJSON(data, {
  //     style: function(feature) {
  //       return {color: "red", fillOpacity: 0}
  //     }
  //   }).addTo(faultLine)
  // });

  // var volcanoeLocation = "https://raw.githubusercontent.com/apelserg/data-osm-getdata/master/geojson/osmnode-volcano.geojson";
  
  
  // d3.json(volcanoeLocation, function(data) {
  //   L.geoJSON(data, {
  //     style: function(feature) {
  //     return {fillOpacity: .05}
  //     }
  //   }).bindPopup(function (layer) {
  //     return layer.feature.properties.Name;
  //   })
  //   .addTo(volcanoes)
  // });
  

    // function createFeatures(volcanoeData) {

    //   // Define a function we want to run once for each feature in the features array
    //   // Give each feature a popup describing the place and time of the earthquake
    //   function onEachFeature(feature, layer) {
    //     layer.bindPopup("<h3>Volacanoe: " + feature.properties.Name +
    //       "</h3>" + "<br><h3>Elevation: " + feature.properties.Ele + "</h3>");
    //   }
    
    //   // Define function to create the circle radius based on the magnitude
    //   var geojsonMarkerOptions = {
    //     radius: 8,
    //     fillColor : "#ff7800",
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    //   }
      
    
    //   // Define function to set the circle color based on the magnitude
    //   function circleColor(Ele) {
    //     if (Ele < 1000) {
    //       return "#ccff33"
    //     }
    //     else if (Ele < 2000) {
    //       return "#ffff33"
    //     }
    //     else if (Ele < 3000) {
    //       return "#ffcc33"
    //     }
    //     else if (Ele < 4000) {
    //       return "#ff9933"
    //     }
    //     else if (Ele < 5000) {
    //       return "#ff6633"
    //     }
    //     else {
    //       return "#ff3333"
    //     }
    //   }
  
    //   // Create a GeoJSON layer containing the features array on the earthquakeData object
    //   // Run the onEachFeature function once for each piece of data in the array
    //   L.geoJSON(volcanoeData, {
    //     pointToLayer: function(volcanoeData, latlng) {
    //       return L.circleMarker(latlng, {
    //         // radius: radiusSize(volcanoeData.properties.Ele),
    //         // color: circleColor(volcanoeData.properties.Ele),
    //         fillOpacity: .0                                                                                                  
          
    //       });
          
    //     },
    //     onEachFeature: onEachFeature
        
        
    //   }).addTo(volcanoes)
    
    // }
    
  // color function to be used when creating the legend
  function getColor(d) {
    return d > 5 ? '#ff3333' :
           d > 4  ? '#ff6633' :
           d > 3  ? '#ff9933' :
           d > 2  ? '#ffcc33' :
           d > 1  ? '#ffff33' :
                    '#ccff33';
  }

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}

// 'use strict';
// // d3.sElectAll('#version').text(dc.version);
// // d3.json('https://api.github.com/repos/dc-js/dc.js/rEleases/latest').then(function (latestRElease) {
// //     /* eslint camelcase: 0 */
// //     d3.sElectAll('#latest').text(latestRElease.tag_name);
// // });
// function print_filter(filter) {
//   var f = eval(filter);
//   if (typeof(f.length) != "undefined") {} else {}
//   if (typeof(f.top) != "undefined") {f=f.demension(function(d) {return "";}).top(Infinity);} else {}
//   console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/)\,/g,"},\n\t").replace("]","\n]"));

// }

// function getValues(d) {
//   var str = d.key+"\nTotal:"+d.value;
//   return str;
// }

// var magnitudeChart = dc.barChart("#eq-chart");
// var lineChart = dc.lineChart("#eq-timechart");
// var depthChart = dc. barChart("#eq-depthchart");
// var eventtable = dc.dataTable("#eq-eventtable");
// var dataCountWidget = dc.dataCount("#dc-data-count")

// var renderBubbles = function (map, hourDim) {
//   map.bubbles(hourDim.top(Infinity), {
//     popupTemplate: function (geo, data) {
//       return ['<div class = "hoverinfo">' + data.location,
//       '<br/>Magnitude: ' + data.magnitude,
//       '<br/>Depth: ' + data.depth + '',
//       '<br/>Date: ' + data.date.time + '',
//       '</div>'].join('');
//     }
//   });
// }

// var refreshData = function() {
//   d3.json("http://earthquake-report.com/feeds/recent-eq?json", function(data) {

//   }).on("error", function(error) {d3.json("data/earth-quake.json", function(data) {
//         renderData(data, true);})
//   });
// }

// var renderData = function(data, offline) {
//   var currentDate = new Date();
//   var parseDate = d3.timeformat.utc("%Y-%m-%dT%H:%M:%S+00:00").parse;
//   console.log(currentDate);
//   if (offline) {
//       d3.sElect('#refreshDate').text("Offline Mode").style('color', 'blue');
//   } else {
//       d3.sElect('#refreshDate').text(currentDate).style('color', 'blue');
//   }

//   data.forEach(function(d) {
//       d.date_time = parseDate(d.date_time);
//       d.radius = +d.magnitude*2;
//       d.fillKey = function(d) {
//         if (+d.magnitude < 3.5) {
//               return 'L3';
//         } else if (+d.manitude > 3.5 && +d.magnitude < 5) {
//               return 'L2';
//         } else return 'L1';
//       };
//   });
  
// }



// refreshData();