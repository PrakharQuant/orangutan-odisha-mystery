/* =========================================================
   THE ORANGUTAN MYSTERY
   Interactive investigation logic
========================================================= */


/* =========================================================
   1. MAP SETUP
========================================================= */

// Approximate locations used for storytelling.
// Route lines are illustrative hypotheses, NOT confirmed routes.

const discoveryPoint = [21.47, 87.27];
const southeastAsiaPoint = [0.8, 114.0];
const nandankananPoint = [20.39, 85.82];/* =========================================================
   THE ORANGUTAN MYSTERY
   Interactive investigation logic
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MAP SETUP
  ========================================================= */

  // Approximate locations used for storytelling.
  // Route lines are illustrative hypotheses,
  // NOT confirmed routes.

  const discoveryPoint = [21.47, 87.27];
  const southeastAsiaPoint = [0.8, 114.0];
  const nandankananPoint = [20.39, 85.82];


  /* ---------------------------------------------------------
     Make sure Leaflet is available
  --------------------------------------------------------- */

  if (typeof L === "undefined") {
    console.error(
      "Leaflet failed to load. Map interactions cannot start."
    );
    return;
  }


  /* ---------------------------------------------------------
     Initialize map
  --------------------------------------------------------- */

  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([12, 101], 4);


  /* =========================================================
     OPENSTREETMAP
  ========================================================= */

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      maxZoom: 19
    }
  ).addTo(map);


  /* =========================================================
     2. CUSTOM MARKERS
  ========================================================= */

  const originIcon = L.divIcon({
    className: "",
    html: `
      <div class="case-marker origin-marker">
        🌿
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });


  const discoveryIcon = L.divIcon({
    className: "",
    html: `
      <div class="case-marker">
        🦧
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });


  const zooIcon = L.divIcon({
    className: "",
    html: `
      <div class="case-marker">
        +
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });


  /* ---------------------------------------------------------
     Origin marker
  --------------------------------------------------------- */

  const originMarker = L.marker(
    southeastAsiaPoint,
    {
      icon: originIcon
    }
  )
    .addTo(map)
    .bindPopup(`
      <strong>Natural range</strong><br>
      Borneo / Sumatra region
      <br><br>
      <small>
        Orangutans are native to Southeast Asia.
      </small>
    `);


  /* ---------------------------------------------------------
     Discovery marker
  --------------------------------------------------------- */

  const discoveryMarker = L.marker(
    discoveryPoint,
    {
      icon: discoveryIcon
    }
  )
    .addTo(map)
    .bindPopup(`
      <strong>Discovery area</strong><br>
      Bhograi, Balasore, Odisha
      <br><br>
      <small>
        Five juvenile orangutans were reportedly found here.
      </small>
    `);


  /* ---------------------------------------------------------
     Nandankanan marker
  --------------------------------------------------------- */

  const zooMarker = L.marker(
    nandankananPoint,
    {
      icon: zooIcon
    }
  )
    .addTo(map)
    .bindPopup(`
      <strong>Nandankanan Zoo</strong><br>
      Odisha
      <br><br>
      <small>
        Reported destination for care and quarantine.
      </small>
    `);


  /* =========================================================
     3. ROUTE HYPOTHESES
  ========================================================= */

  const routeData = {

    natural: {

      kicker: "HYPOTHESIS 01",

      title: "Natural dispersal",

      description:
        "Could five young orangutans have reached Odisha without human assistance?",

      verdict:
        "HIGHLY UNLIKELY",

      reason:
        "Orangutans are forest-dwelling apes native to Borneo and Sumatra. There is no natural land corridor connecting their native range with Odisha.",

      status:
        "EXPLORING NATURAL RANGE",

      line: [
        southeastAsiaPoint,
        [5, 111],
        [10, 105],
        [15, 99],
        [18, 94],
        discoveryPoint
      ],

      style: {
        dashArray: "8 10",
        weight: 2,
        opacity: 0.7
      }

    },


    road: {

      kicker: "HYPOTHESIS 02",

      title: "Road / overland transport",

      description:
        "Could the animals have been moved through a multi-leg human transportation network?",

      verdict:
        "INVESTIGATIVE LEAD",

      reason:
        "A human transportation scenario would fit the basic geographic problem, but the actual route, vehicles and movements would need independent evidence such as CCTV, travel records or witness accounts.",

      status:
        "EXAMINING LAND ROUTES",

      line: [
        southeastAsiaPoint,
        [5, 111],
        [12, 105],
        [17, 99],
        [20, 93],
        discoveryPoint
      ],

      style: {
        dashArray: "3 8",
        weight: 3,
        opacity: 0.85
      }

    },


    sea: {

      kicker: "HYPOTHESIS 03",

      title: "Maritime transport",

      description:
        "Could a maritime route explain how the animals crossed the region?",

      verdict:
        "INVESTIGATIVE LEAD",

      reason:
        "The discovery occurred in coastal Odisha, making maritime movement a hypothesis worth examining. Coast Guard, port and coastal CCTV evidence would be needed to establish such a route.",

      status:
        "EXAMINING SEA ROUTES",

      line: [
        southeastAsiaPoint,
        [0, 110],
        [1, 103],
        [5, 98],
        [10, 94],
        [16, 91],
        discoveryPoint
      ],

      style: {
        dashArray: "12 8",
        weight: 3,
        opacity: 0.85
      }

    },


    air: {

      kicker: "HYPOTHESIS 04",

      title: "Air transport",

      description:
        "Could the animals have been transported by air before reaching Odisha?",

      verdict:
        "POSSIBLE — NEEDS EVIDENCE",

      reason:
        "Air travel could theoretically bridge the geographic distance quickly. Relevant airport CCTV, cargo records, customs documentation and animal-transport records would be important evidence.",

      status:
        "EXAMINING AIR ROUTES",

      line: [
        southeastAsiaPoint,
        [7, 110],
        [13, 104],
        [18, 97],
        discoveryPoint
      ],

      style: {
        dashArray: "2 7",
        weight: 3,
        opacity: 0.85
      }

    }

  };


  /* =========================================================
     4. DRAW ROUTE
  ========================================================= */

  let currentRoute = null;


  function drawRoute(routeName) {

    const route = routeData[routeName];

    if (!route) {
      console.warn(
        "Unknown route:",
        routeName
      );
      return;
    }


    /* -------------------------------------------------------
       Remove previous route
    ------------------------------------------------------- */

    if (currentRoute) {
      map.removeLayer(currentRoute);
    }


    /* -------------------------------------------------------
       Draw new route
    ------------------------------------------------------- */

    currentRoute = L.polyline(
      route.line,
      {
        color: "#d6b36a",
        ...route.style
      }
    ).addTo(map);


   


    /* -------------------------------------------------------
       Update analysis text
    ------------------------------------------------------- */

    const routeKicker =
      document.getElementById("routeKicker");

    const routeTitle =
      document.getElementById("routeTitle");

    const routeDescription =
      document.getElementById("routeDescription");

    const routeVerdict =
      document.getElementById("routeVerdict");

    const routeReason =
      document.getElementById("routeReason");

    const routeStatus =
      document.getElementById("routeStatus");


    if (routeKicker) {
      routeKicker.textContent =
        route.kicker;
    }

    if (routeTitle) {
      routeTitle.textContent =
        route.title;
    }

    if (routeDescription) {
      routeDescription.textContent =
        route.description;
    }

    if (routeVerdict) {
      routeVerdict.textContent =
        route.verdict;
    }

    if (routeReason) {
      routeReason.textContent =
        route.reason;
    }

    if (routeStatus) {
      routeStatus.textContent =
        route.status;
    }


    /* -------------------------------------------------------
       Zoom to route
    ------------------------------------------------------- */

    const bounds =
      L.latLngBounds(route.line);

    map.fitBounds(
      bounds,
      {
        padding: [55, 55],
        maxZoom: 5,
        animate: true,
        duration: 0.7
      }
    );

  }


  /* =========================================================
     5. ROUTE BUTTONS
  ========================================================= */

  const routeTabs =
    document.querySelectorAll(".route-tab");


  routeTabs.forEach((button) => {

    button.addEventListener("click", () => {

      const routeName =
        button.dataset.route;


      /* Remove active state */

      routeTabs.forEach((tab) => {
        tab.classList.remove("active");
      });


      /* Activate selected tab */

      button.classList.add("active");


      /* Draw selected route */

      drawRoute(routeName);

    });

  });


  /* ---------------------------------------------------------
     Initial route
  --------------------------------------------------------- */

  drawRoute("natural");


  /* =========================================================
     6. MOTHER REVEAL
  ========================================================= */

  const motherRevealButton =
    document.getElementById("motherReveal");

  const motherRevealPanel =
    document.getElementById("motherRevealPanel");


  let motherRevealed = false;


  if (
    motherRevealButton &&
    motherRevealPanel
  ) {

    motherRevealButton.addEventListener(
      "click",
      () => {

        motherRevealed =
          !motherRevealed;


        if (motherRevealed) {

          motherRevealPanel.style.display =
            "block";

          motherRevealButton.innerHTML =
            `HIDE INVESTIGATIVE LOGIC <span>↑</span>`;

        } else {

          motherRevealPanel.style.display =
            "none";

          motherRevealButton.innerHTML =
            `REVEAL THE INVESTIGATIVE LOGIC <span>→</span>`;

        }

      }
    );

  }


  /* =========================================================
     7. INVESTIGATION CHECKLIST
  ========================================================= */

  const investigationItems =
    document.querySelectorAll(
      ".investigation-item input"
    );


  investigationItems.forEach(
    (checkbox) => {

      checkbox.addEventListener(
        "change",
        () => {

          const parent =
            checkbox.closest(
              ".investigation-item"
            );


          if (!parent) {
            return;
          }


          if (checkbox.checked) {

            parent.style.background =
              "rgba(135,169,141,0.08)";

            parent.style.borderColor =
              "rgba(135,169,141,0.25)";

          } else {

            parent.style.background =
              "";

            parent.style.borderColor =
              "";

          }

        }
      );

    }
  );


  /* =========================================================
     8. THEORY SELECTOR
  ========================================================= */

  const theoryButtons =
    document.querySelectorAll(
      ".theory-option"
    );

  const theoryResult =
    document.getElementById(
      "theoryResult"
    );

  const theoryResultTitle =
    document.getElementById(
      "theoryResultTitle"
    );

  const theoryResultText =
    document.getElementById(
      "theoryResultText"
    );


  const theoryMessages = {

    trafficking: {

      title:
        "Wildlife trafficking is a plausible theory.",

      text:
        "The geographic distance, the animals' young age and the absence of their mothers make human involvement a serious investigative possibility. But the available evidence does not establish trafficking as fact."

    },


    abandoned: {

      title:
        "Displacement is another possibility.",

      text:
        "The animals may have been transported or held by people and later abandoned. This remains a hypothesis until investigators establish where they came from and how they reached Odisha."

    },


    unknown: {

      title:
        "Keeping the case open is rational.",

      text:
        "The evidence currently available cannot establish a definitive explanation. Good investigation means resisting the temptation to turn an intriguing clue into a conclusion."

    }

  };


  theoryButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const theory =
            button.dataset.theory;

          const result =
            theoryMessages[theory];


          if (!result) {
            return;
          }


          /* Remove previous selection */

          theoryButtons.forEach(
            (item) => {
              item.classList.remove(
                "selected"
              );
            }
          );


          /* Select current theory */

          button.classList.add(
            "selected"
          );


          /* Update result */

          if (theoryResultTitle) {
            theoryResultTitle.textContent =
              result.title;
          }

          if (theoryResultText) {
            theoryResultText.textContent =
              result.text;
          }

          if (theoryResult) {

            theoryResult.classList.add(
              "visible"
            );


            /* Scroll result into view */

            setTimeout(
              () => {

                theoryResult.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest"
                });

              },
              100
            );

          }

        }
      );

    }
  );


  /* =========================================================
     9. SIMPLE SCROLL REVEAL
  ========================================================= */

  const revealElements =
    document.querySelectorAll(
      ".evidence-card, .timeline-item, .investigation-item, .clue-card, .status-card"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.style.opacity =
                "1";

              entry.target.style.transform =
                "translateY(0)";


              revealObserver.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.08
        }
      );


    revealElements.forEach(
      (element) => {

        element.style.opacity =
          "0";

        element.style.transform =
          "translateY(15px)";

        element.style.transition =
          "opacity 0.55s ease, transform 0.55s ease";

        revealObserver.observe(
          element
        );

      }
    );

  }


  /* =========================================================
     10. MAP RESIZE
  ========================================================= */

  // Helps Leaflet render correctly after
  // the page loads.

  setTimeout(
    () => {
      map.invalidateSize();
    },
    400
  );


  /* ---------------------------------------------------------
     Recalculate when window changes size
  --------------------------------------------------------- */

  window.addEventListener(
    "resize",
    () => {
      map.invalidateSize();
    }
  );


  /* =========================================================
     11. CONSOLE SIGNATURE
  ========================================================= */

  console.log(
    "%cCASE FILE 001",
    "font-size:20px;font-weight:bold;"
  );

  console.log(
    "The Odisha Orangutan Mystery"
  );

  console.log(
    "Routes shown on the map are illustrative hypotheses — not confirmed routes."
  );
   /* =========================================================
   LIVE CASE NEWS
========================================================= */

async function loadCaseNews() {
  const newsTrack = document.getElementById("heroNewsTrack");

  if (!newsTrack) return;

  try {
    const response = await fetch("news.json?" + Date.now());

    if (!response.ok) {
      throw new Error("News feed unavailable");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      newsTrack.innerHTML = `
        <div class="news-loading">
          No recent reports found.
        </div>
      `;
      return;
    }

    newsTrack.innerHTML = data.items
      .slice(0, 6)
      .map((item) => {
        const date = new Date(item.published);

        const formattedDate = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short"
        }).toUpperCase();

        return `
          <a
            href="${item.link}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>${formattedDate}</span>

            <div>
              ${escapeNewsText(item.title)}

              <small>
                ${escapeNewsText(item.source || "NEWS REPORT")}
              </small>
            </div>
          </a>
        `;
      })
      .join("");

    startNewsTicker();

  } catch (error) {

    console.error("Could not load case news:", error);

    newsTrack.innerHTML = `
      <div class="news-loading">
        Latest reports unavailable.
      </div>
    `;
  }
}


function escapeNewsText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


function startNewsTicker() {
  const track = document.getElementById("heroNewsTrack");

  if (!track) return;

  const items = Array.from(track.querySelectorAll("a"));

  if (!items.length) return;

  // Make a second copy for a seamless horizontal loop
  items.forEach((item) => {
    track.appendChild(item.cloneNode(true));
  });

  // Force horizontal scrolling
  track.style.display = "flex";
  track.style.flexDirection = "row";
  track.style.flexWrap = "nowrap";
  track.style.width = "max-content";
  track.style.transform = "translateX(0)";

  const distance = track.scrollWidth / 2;

  track.animate(
    [
      {
        transform: "translateX(0)"
      },
      {
        transform: `translateX(-${distance}px)`
      }
    ],
    {
      duration: 45000,
      iterations: Infinity,
      easing: "linear"
    }
  );
}


loadCaseNews();

});



