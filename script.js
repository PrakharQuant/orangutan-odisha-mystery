// ============================================================
// THE ODISHA ORANGUTAN MYSTERY
// ============================================================

console.log("🦧 Orangutan map script starting...");


// ------------------------------------------------------------
// LOCATIONS
// ------------------------------------------------------------

const LOCATIONS = {
  borneo: [0.9619, 114.5548],
  sumatra: [0.5897, 101.3431],
  balasore: [21.4942, 86.9270],
  nandankanan: [20.3974, 85.8067],

  // Illustrative human-mediated route only
  singapore: [1.3521, 103.8198],
  colombo: [6.9271, 79.8612],
  chennai: [13.0827, 80.2707]
};


// ------------------------------------------------------------
// WAIT UNTIL LEAFLET IS AVAILABLE
// ------------------------------------------------------------

function startMap() {

  if (typeof L === "undefined") {
    console.error("Leaflet has not loaded.");
    return;
  }

  console.log("Leaflet loaded:", L.version);


  // ----------------------------------------------------------
  // MAP
  // ----------------------------------------------------------

  const map = L.map("map", {
    zoomControl: true,
    minZoom: 3,
    maxZoom: 8
  }).setView([10, 100], 4);


  // ----------------------------------------------------------
  // BASEMAP
  // ----------------------------------------------------------

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        "&copy; OpenStreetMap contributors &copy; CARTO",

      subdomains: "abcd",

      maxZoom: 19
    }
  ).addTo(map);


  // ----------------------------------------------------------
  // CUSTOM ICONS
  // ----------------------------------------------------------

  function orangutanIcon() {

    return L.divIcon({
      className: "",
      html: `
        <div style="
          width:32px;
          height:32px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#f97316;
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 0 0 4px rgba(249,115,22,.25);
          font-size:17px;
        ">
          🦧
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

  }


  function homeIcon() {

    return L.divIcon({
      className: "",
      html: `
        <div style="
          width:26px;
          height:26px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#475569;
          border:2px solid #cbd5e1;
          border-radius:50%;
          box-shadow:0 0 0 4px rgba(148,163,184,.12);
          font-size:13px;
        ">
          🌿
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

  }


  // ----------------------------------------------------------
  // NATURAL RANGE
  // ----------------------------------------------------------

  L.marker(
    LOCATIONS.borneo,
    { icon: homeIcon() }
  )
  .addTo(map)
  .bindPopup(`
    <strong>🌿 Borneo</strong><br>
    Natural home of orangutans.
  `);


  L.marker(
    LOCATIONS.sumatra,
    { icon: homeIcon() }
  )
  .addTo(map)
  .bindPopup(`
    <strong>🌿 Sumatra</strong><br>
    Natural home of orangutans.
  `);


  // ----------------------------------------------------------
  // ODISHA
  // ----------------------------------------------------------

  L.marker(
    LOCATIONS.balasore,
    { icon: orangutanIcon() }
  )
  .addTo(map)
  .bindPopup(`
    <strong>🦧 Balasore, Odisha</strong><br>
    Reported discovery location.
  `);


  L.marker(
    LOCATIONS.nandankanan,
    { icon: orangutanIcon() }
  )
  .addTo(map)
  .bindPopup(`
    <strong>🦧 Nandankanan Zoo</strong><br>
    Reported destination for care/quarantine.
  `);


  // ----------------------------------------------------------
  // ROUTES
  // ----------------------------------------------------------

  let routeLayers = [];


  function clearRoutes() {

    routeLayers.forEach(layer => {
      map.removeLayer(layer);
    });

    routeLayers = [];

  }


  // ----------------------------------------------------------
  // NATURAL ROUTE
  // ----------------------------------------------------------

  function showNatural() {

    clearRoutes();

    setActive("naturalBtn");


    const route = L.polyline(
      [
        LOCATIONS.borneo,
        LOCATIONS.balasore
      ],
      {
        color: "#fb923c",
        weight: 4,
        opacity: 0.9,
        dashArray: "8 10"
      }
    ).addTo(map);


    routeLayers.push(route);


    updateInfo(`
      <div class="info-icon">🌿</div>

      <div>
        <h3>Natural dispersal?</h3>

        <p>
          Borneo is roughly
          <strong>3,000+ km</strong>
          from the reported Odisha location.
          A direct natural journey of this scale would be
          highly implausible for orangutans.
        </p>

        <p style="margin-top:8px">
          The orange line is illustrative and
          <strong>not a confirmed animal route.</strong>
        </p>
      </div>
    `);


    fitRoute([
      LOCATIONS.borneo,
      LOCATIONS.balasore
    ]);

  }


  // ----------------------------------------------------------
  // HUMAN ROUTE
  // ----------------------------------------------------------

  function showHuman() {

    clearRoutes();

    setActive("humanBtn");


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
        dashArray: "10 8"
      }
    ).addTo(map);


    routeLayers.push(line);


    // Transit points

    [
      ["Singapore", LOCATIONS.singapore],
      ["Colombo", LOCATIONS.colombo],
      ["Chennai", LOCATIONS.chennai]
    ].forEach(point => {

      const marker = L.circleMarker(
        point[1],
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
        <strong>${point[0]}</strong><br>
        <span style="color:#94a3b8">
          Illustrative transit point
        </span>
      `);


      routeLayers.push(marker);

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
          this route is illustrative only.
          It does not establish how these animals travelled.
        </p>
      </div>
    `);


    fitRoute(route);

  }


  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

  function resetMap() {

    clearRoutes();

    setActive(null);


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


  // ----------------------------------------------------------
  // BUTTONS
  // ----------------------------------------------------------

  document
    .getElementById("naturalBtn")
    .addEventListener("click", showNatural);


  document
    .getElementById("humanBtn")
    .addEventListener("click", showHuman);


  document
    .getElementById("resetBtn")
    .addEventListener("click", resetMap);


  // ----------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------

  function setActive(id) {

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


  function updateInfo(html) {

    document
      .getElementById("info")
      .innerHTML = html;

  }


  function fitRoute(points) {

    const bounds = L.latLngBounds(points);

    map.fitBounds(
      bounds,
      {
        padding: [50, 50],
        maxZoom: 5,
        animate: true
      }
    );

  }


  // ----------------------------------------------------------
  // FORCE MAP RESIZE
  // ----------------------------------------------------------

  setTimeout(() => {
    map.invalidateSize();
  }, 500);


  console.log("🦧 Orangutan map initialized successfully.");

}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

// Leaflet is loaded before this script in index.html,
// so normally this runs immediately.

if (typeof L !== "undefined") {

  startMap();

} else {

  console.error(
    "Leaflet is missing. Check the Leaflet <script> in index.html."
  );

}
