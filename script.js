// ============================================================
// THE ODisha ORANGUTAN MYSTERY
// Interactive Leaflet visualization
// ============================================================


// ------------------------------------------------------------
// LOCATIONS
// ------------------------------------------------------------

const LOCATIONS = {

  borneo: [0.9619, 114.5548],

  sumatra: [0.5897, 101.3431],

  balasore: [21.4942, 86.9270],

  nandankanan: [20.3974, 85.8067],

  // Illustrative transit locations.
  // These are NOT claimed to be actual routes.
  chennai: [13.0827, 80.2707],

  singapore: [1.3521, 103.8198],

  portKlang: [3.0000, 101.4000],

  colombo: [6.9271, 79.8612]

};


// ------------------------------------------------------------
// MAP INITIALIZATION
// ------------------------------------------------------------

const map = L.map("map", {
  zoomControl: true,
  minZoom: 3,
  maxZoom: 7
}).setView([10, 100], 4);


// Dark Carto basemap

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "© OpenStreetMap contributors © CARTO",
    subdomains: "abcd",
    maxZoom: 19
  }
).addTo(map);


// ------------------------------------------------------------
// ICONS
// ------------------------------------------------------------

function createIcon(emoji, type) {

  return L.divIcon({

    className: "",

    html: `
      <div class="${type}-marker">
        ${emoji}
      </div>
    `,

    iconSize: type === "orangutan"
      ? [32, 32]
      : [25, 25],

    iconAnchor: type === "orangutan"
      ? [16, 16]
      : [12.5, 12.5]

  });

}


const orangutanIcon =
  createIcon("🦧", "orangutan");

const homeIcon =
  createIcon("🌿", "home");


// ------------------------------------------------------------
// NATURAL HOME MARKERS
// ------------------------------------------------------------

const borneoMarker = L.marker(
  LOCATIONS.borneo,
  { icon: homeIcon }
)
.addTo(map)
.bindPopup(`
  <div class="popup-title">🌿 Borneo</div>
  <div class="popup-text">
    One of the natural homes of orangutans.
  </div>
`);


const sumatraMarker = L.marker(
  LOCATIONS.sumatra,
  { icon: homeIcon }
)
.addTo(map)
.bindPopup(`
  <div class="popup-title">🌿 Sumatra</div>
  <div class="popup-text">
    Another natural home of orangutans.
  </div>
`);


// ------------------------------------------------------------
// ODISHA MARKERS
// ------------------------------------------------------------

const balasoreMarker = L.marker(
  LOCATIONS.balasore,
  { icon: orangutanIcon }
)
.addTo(map)
.bindPopup(`
  <div class="popup-title">🦧 Balasore, Odisha</div>
  <div class="popup-text">
    Reported discovery location.
  </div>
`);


const zooMarker = L.marker(
  LOCATIONS.nandankanan,
  { icon: orangutanIcon }
)
.addTo(map)
.bindPopup(`
  <div class="popup-title">🦧 Nandankanan Zoo</div>
  <div class="popup-text">
    Reported destination for quarantine / care.
  </div>
`);


// ------------------------------------------------------------
// DISTANCE
// ------------------------------------------------------------

function distanceKm(a, b) {

  const R = 6371;

  const lat1 = a[0] * Math.PI / 180;
  const lat2 = b[0] * Math.PI / 180;

  const deltaLat =
    (b[0] - a[0]) * Math.PI / 180;

  const deltaLon =
    (b[1] - a[1]) * Math.PI / 180;

  const x =
    Math.sin(deltaLat / 2) *
    Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(deltaLon / 2) *
    Math.sin(deltaLon / 2);

  const y =
    2 * Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x)
    );

  return Math.round(R * y);
}


const borneoDistance =
  distanceKm(LOCATIONS.borneo, LOCATIONS.balasore);


// ------------------------------------------------------------
// ROUTE LAYERS
// ------------------------------------------------------------

let currentLines = [];


// Remove existing route lines

function clearRoutes() {

  currentLines.forEach(line => {
    map.removeLayer(line);
  });

  currentLines = [];
}


// ------------------------------------------------------------
// NATURAL DISPERSAL VIEW
// ------------------------------------------------------------

function showNatural() {

  clearRoutes();

  setActiveButton("naturalBtn");

  const line = L.polyline(
    [
      LOCATIONS.borneo,
      LOCATIONS.balasore
    ],
    {
      color: "#fb923c",
      weight: 3,
      opacity: 0.9,
      dashArray: "8 10",
      smoothFactor: 1.5
    }
  ).addTo(map);

  currentLines.push(line);


  const distance = distanceKm(
    LOCATIONS.borneo,
    LOCATIONS.balasore
  );


  updateInfo(`
    <div class="info-icon">🌿</div>

    <div>
      <h3>Natural dispersal?</h3>

      <p>
        Borneo is roughly
        <strong>${distance.toLocaleString()} km</strong>
        from the reported Odisha location.
        A direct natural journey of this scale would be highly
        implausible for orangutans.
      </p>

      <p style="margin-top:8px">
        The orange line is deliberately illustrative —
        it is <strong>not</strong> a confirmed animal route.
      </p>
    </div>
  `);


  fitRoute(
    [LOCATIONS.borneo, LOCATIONS.balasore]
  );

}


// ------------------------------------------------------------
// HUMAN-ASSISTED ROUTE VIEW
// ------------------------------------------------------------

function showHumanRoute() {

  clearRoutes();

  setActiveButton("humanBtn");


  // Possible illustrative maritime / human-mediated pathway.
  // Again: this is a visualization hypothesis, NOT evidence.

  const route = [

    LOCATIONS.borneo,

    LOCATIONS.singapore,

    LOCATIONS.colombo,

    LOCATIONS.chennai,

    LOCATIONS.balasore

  ];


  const line = L.polyline(
    route,
    {
      color: "#fb923c",
      weight: 4,
      opacity: 0.95,
      dashArray: "10 8",
      smoothFactor: 1.5
    }
  ).addTo(map);


  currentLines.push(line);


  // Add small transit points

  const transitPoints = [

    {
      location: LOCATIONS.singapore,
      title: "Singapore",
      text: "Illustrative transit point"
    },

    {
      location: LOCATIONS.colombo,
      title: "Colombo",
      text: "Illustrative transit point"
    },

    {
      location: LOCATIONS.chennai,
      title: "Chennai",
      text: "Illustrative transit point"
    }

  ];


  transitPoints.forEach(point => {

    const marker = L.circleMarker(
      point.location,
      {
        radius: 5,
        color: "#f97316",
        weight: 2,
        fillColor: "#0f172a",
        fillOpacity: 1
      }
    )
    .addTo(map)
    .bindPopup(`
      <div class="popup-title">
        ${point.title}
      </div>

      <div class="popup-text">
        ${point.text}
      </div>
    `);

    currentLines.push(marker);

  });


  updateInfo(`
    <div class="info-icon">🚢</div>

    <div>
      <h3>Possible human-mediated route</h3>

      <p>
        One hypothetical explanation is that the animals
        were transported through a human-controlled pathway,
        potentially involving maritime or commercial movement.
      </p>

      <p style="margin-top:8px">
        <strong>Important:</strong>
        this route is purely illustrative. It does not establish
        how these particular animals travelled.
      </p>
    </div>
  `);


  fitRoute(route);

}


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

function resetMap() {

  clearRoutes();

  setActiveButton(null);


  updateInfo(`
    <div class="info-icon">🧭</div>

    <div>
      <h3>What are we looking at?</h3>

      <p>
        Select an option above to explore possible explanations.
        The routes are <strong>illustrative hypotheses</strong>,
        not confirmed movements of these animals.
      </p>
    </div>
  `);


  map.setView(
    [10, 100],
    4,
    { animate: true }
  );

}


// ------------------------------------------------------------
// BUTTON STATE
// ------------------------------------------------------------

function setActiveButton(id) {

  document
    .querySelectorAll(".control-btn")
    .forEach(button => {
      button.classList.remove("active");
    });


  if (id) {

    document
      .getElementById(id)
      .classList.add("active");

  }

}


// ------------------------------------------------------------
// INFO CARD
// ------------------------------------------------------------

function updateInfo(html) {

  document
    .getElementById("info")
    .innerHTML = html;

}


// ------------------------------------------------------------
// FIT MAP TO ROUTE
// ------------------------------------------------------------

function fitRoute(points) {

  const bounds =
    L.latLngBounds(points);

  map.fitBounds(
    bounds,
    {
      padding: [55, 55],
      maxZoom: 5,
      animate: true,
      duration: 1
    }
  );

}


// ------------------------------------------------------------
// BUTTON EVENTS
// ------------------------------------------------------------

document
  .getElementById("naturalBtn")
  .addEventListener(
    "click",
    showNatural
  );


document
  .getElementById("humanBtn")
  .addEventListener(
    "click",
    showHumanRoute
  );


document
  .getElementById("resetBtn")
  .addEventListener(
    "click",
    resetMap
  );


// ------------------------------------------------------------
// INITIAL VIEW
// ------------------------------------------------------------

setTimeout(() => {

  map.invalidateSize();

}, 300);
