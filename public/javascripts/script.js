var map = L.map('worldmap', {
    center: [48.866667, 2.333333],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' }).addTo(map);

var myIcon = L.icon({
    iconUrl: '/images/leaf-green.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [0, 0],
    shadowUrl: '/images/leaf-shadow.png',
    shadowSize: [20, 40],
    shadowAnchor: [4, 62]
});


var cities = document.getElementsByClassName('list-group-item');

for (let i = 0; i < cities.length; i++) {
    var lon = cities[i].dataset.lon;
    var lat = cities[i].dataset.lat;
    var cityname = cities[i].dataset.name;
    L.marker([lat, lon], { icon: myIcon }).addTo(map).bindPopup(cityname)
}

/* [...document.getElementsByTagName('li')].forEach(elem => {
    L.marker([elem.dataset.lat, elem.dataset.lon], { icon: myIcon }).addTo(map)
        .bindPopup(elem.dataset.name)
}); */