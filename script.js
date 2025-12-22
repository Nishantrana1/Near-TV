const STREAMS_API = "https://iptv-org.github.io/api/streams.json";
const CHANNELS_API = "https://iptv-org.github.io/api/channels.json";
const COUNTRIES_API = "https://iptv-org.github.io/api/countries.json";

const channelList = document.getElementById("channelList");
const video = document.getElementById("video");
const nowPlaying = document.getElementById("nowPlaying");

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const countrySelect = document.getElementById("countrySelect");
const categorySelect = document.getElementById("categorySelect");

let hls;
let channelsMap = {};
let countriesMap = {};
let allPlayableChannels = [];

/* Load all data */
async function loadData() {
  /* Countries */
  const countriesData = await (await fetch(COUNTRIES_API)).json();
  countriesData.forEach(c => {
    countriesMap[c.code] = c.name;
  });

  /* Channels */
  const channelsData = await (await fetch(CHANNELS_API)).json();
  const countryCodes = new Set();
  const categorySet = new Set();

  channelsData.forEach(ch => {
    channelsMap[ch.id] = ch;

    if (ch.country) countryCodes.add(ch.country);

    if (ch.categories && ch.categories.length > 0) {
      ch.categories.forEach(cat => categorySet.add(cat));
    }
  });

  /* Fill country dropdown */
  [...countryCodes].sort().forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = countriesMap[code] || code;
    countrySelect.appendChild(option);
  });

  /* Fill category dropdown */
  [...categorySet].sort().forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = capitalize(cat);
    categorySelect.appendChild(option);
  });

  /* Streams */
  const streamsData = await (await fetch(STREAMS_API)).json();

  allPlayableChannels = streamsData
    .filter(s => s.url && s.url.endsWith(".m3u8") && s.channel)
    .map(s => {
      const meta = channelsMap[s.channel];
      return {
        name: meta?.name || s.channel,
        countryCode: meta?.country || "",
        countryName: countriesMap[meta?.country] || "Unknown",
        categories: meta?.categories || [],
        url: s.url
      };
    });

  /* 🔥 Set default filters: India + Music */
countrySelect.value = "IN";
categorySelect.value = "music";

/* Apply default filter automatically */
applyFilters();

}

/* Render list */
function renderChannels(list) {
  channelList.innerHTML = "";

  list.forEach(ch => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${ch.name} (${ch.countryName})</span>`;
    li.addEventListener("click", () => {
      playChannel(ch.url, ch.name);

      // Remove active from all
      document.querySelectorAll(".sidebar li")
        .forEach(item => item.classList.remove("active"));

      // Add active to clicked one
      li.classList.add("active");
    });

    channelList.appendChild(li);
  });
}


/* Play channel */
function playChannel(url, name) {
  if (hls) {
    hls.destroy();
  }

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(() => {
        console.log("Autoplay blocked by browser");
      });
    });

  } else {
    video.src = url;
    video.play().catch(() => {
      console.log("Autoplay blocked by browser");
    });
  }

  nowPlaying.textContent = "Now Playing: " + name;
}




function applyFilters() {
  const text = searchInput.value.toLowerCase();
  const country = countrySelect.value;
  const category = categorySelect.value;

  const filtered = allPlayableChannels.filter(ch => {
    const matchName = ch.name.toLowerCase().includes(text);
    const matchCountry = country === "" || ch.countryCode === country;
    const matchCategory =
      category === "" || ch.categories.includes(category);

    return matchName && matchCountry && matchCategory;
  });

  renderChannels(filtered.slice(0, 200));
}


/* Search + Filter */
searchBtn.addEventListener("click", applyFilters);


/* Utility */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

loadData();
