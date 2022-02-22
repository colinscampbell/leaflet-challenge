// Look at Mapping Web - Lesson 2 (Saturday)
// Creating the map object
var myMap = L.map("map", {
    center: [40, -90],
    zoom: 4.5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  


  // Use this link to get the GeoJSON data.
  var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02";
  
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

//10,30,50,70,90

  // Getting our GeoJSON data
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
            weight: .5
            }).bindPopup(`<h4><ul><li>Name: ${title}</li><li>Magnitude: ${magnitude}</li><li>Location: [${coordinate[1]} , ${coordinate[0]}]</li></ul></h4>`)
        );
        //append(FeaturesArray, iterable[i])

    }

    console.log(coordsArray[2])
    console.log(magnitudeArray[2])
    console.log(titleArray[2])

    var earthquakeLayer = L.layerGroup(earthquakeMarkers);

    earthquakeLayer.addTo(myMap);

    //L.geoJson(data).addTo(myMap);

  });

