/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibGV1bWFzY29kZSIsImEiOiJja2gxdHNiNjUwYjY2MnFuYXhvbWFnMmtsIn0.B-1QAFSAYHzgWQAQZyowTg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/leumascode/ckh1wyzvv0ewz19m6guk9wh95',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend Map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
