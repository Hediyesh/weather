//the default lat and long shows my city 
var defaultLatitude = 36.83927917;
var defaultLongitude = 54.43208694;
//map api
var apikey = 'AoYuqMaVdGCEPMrkhGTEBAkcHoPcPAGQGwaYeXwxrZX8TmmCInhcQKJeNiuOl0Yi';
var map;
//define default location for map
window.addEventListener("load", function () {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: 'AoYuqMaVdGCEPMrkhGTEBAkcHoPcPAGQGwaYeXwxrZX8TmmCInhcQKJeNiuOl0Yi',
        center: new Microsoft.Maps.Location(defaultLatitude, defaultLongitude),
    });
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) { set_latitudes_and_longitude(e); });
});
function set_latitudes_and_longitude(map){

}