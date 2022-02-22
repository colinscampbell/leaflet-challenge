var myMap = L.map("map", {
    center: [40, -90],
    zoom: 4.5
  });
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
   
  function dotColor(depth) {
    if(depth < 10) {
      return "lime";
    }
    if(depth < 30) {
      return "yellow";
    }
    if(depth < 50) {
      return "orange";
    }
    if(depth < 70) {
      return "DarkOrange";
    }
    if(depth < 90) {
      return "orangeRed";
    }
    return "Red";

  }

  var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02";

  d3.json(link).then(function(data) {

    let coordsArray = []
    let magnitudeArray = []
    let titleArray = []
    let iterable = data.features
    var earthquakeMarkers = []


    for(let i=0; i<iterable.length; i++) {
        coordinate = iterable[i].geometry.coordinates
        magnitude = iterable[i].properties.mag
        title = iterable[i].properties.title

        coordsArray.push(coordinate)
        magnitudeArray.push(magnitude)
        titleArray.push(title)

        earthquakeMarkers.push(
          L.circle([coordinate[1],[coordinate[0]],], {
            color: "black",
            radius: magnitude*10000,
            fill: true,
            fillColor: dotColor(coordinate[2]),
            weight: .5,
            fillOpacity: .8
            }).bindPopup(`<h4><ul><li>Name: ${title}</li><li>Magnitude: ${magnitude}</li><li>Location: [${coordinate[1]} , ${coordinate[0]}]</li></ul></h4>`)
        );

    }

    var earthquakeLayer = L.layerGroup(earthquakeMarkers);

    earthquakeLayer.addTo(myMap);

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(importedData) {
      // console.log(importedData);
      var plateData = importedData;
      var plateLayer = L.layerGroup(plateData);
    });

    var overlayMaps = {
      Earthquakes: earthquakeLayer,
      Tectonics: plateLayer
    };

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  });

