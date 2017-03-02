// instantiate the map object
var map = L.map('map').setView([40.735021, -73.994787], 13);
var chart;
//add a dark basemap from carto's free basemaps
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);



$.getJSON('data/Location.geojson', function(jqueryData) {

  L.geoJson(fast_rest,{
    color:'white',
    fillOpacity: 0.1,
    weight:0.5,
    onEachFeature: onEachFeature
  }).addTo(map);  
}) // this is the end of the $.getJSON callback


/////Interactions:
function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 2,
        color: 'orange',
        dashArray: '',
        fillOpacity: 0
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

    info.update(layer.feature.properties);
    }
}

function resetHighlight(e) {
  var geojson;
  geojson = L.geoJson(communityDistricts);
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


///Add interactive legend;
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

///method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Health Inspection Grade</h4>' +  (props ?
        '<b>' + props.business + '</b><br />' + props.inspection + ' inspections, ' + props.grade + ' % chance to get A'
        : 'Hover over a store, click to zoom in.');
};
info.addTo(map);


var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 25, 50, 75,100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(map);

///////////////////////////////////////////////////////
// Click button to reset back:



