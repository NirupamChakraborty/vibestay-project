 const key = mapToken;

const map = new maplibregl.Map({
container: "map",
style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
center:listing.geometry.coordinates,
zoom: 10,
});
  

const marker = new maplibregl.Marker({ color: "red" })
.setLngLat(listing.geometry.coordinates)
.setPopup(new maplibregl.Popup({
    offset: 25,       
}).setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
.addTo(map);


