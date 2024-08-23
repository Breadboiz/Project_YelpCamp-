maptilersdk.config.apiKey = apiKey;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11, // starting zoom
  });
  const marker = new maptilersdk.Marker()
     .setLngLat(campground.geometry.coordinates)
     .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)