const STREAMS_API = "https://iptv-org.github.io/api/streams.json";
const CHANNELS_API = "https://iptv-org.github.io/api/channels.json";
const COUNTRIES_API = "https://iptv-org.github.io/api/countries.json";

const channelList = document.getElementById("channelList");
const video = document.getElementById("video");
const nowPlaying = document.getElementById("nowPlaying");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const countrySelect = document.getElementById("countrySelect");

let hls;
let channelsMap = {};
let countriesMap = {};
let allPlayableChannels = [];

/* Load all data */
async function loadData() {
  // Countries
  const countriesRes = await fetch(COUNTRIES_API);
  const countriesData = await countriesRes.json();
  countriesData.forEach(c => {
    countriesMap[c.code] = c.name;
  });

  // Channels metadata
  const channelsRes = await fetch(CHANNELS_API);
  const channelsData = await channelsRes.json();

  const countryCodes = new Set();

  channelsData.forEach(ch => {
    channelsMap[ch.id] = ch;
    if (ch.country) countryCodes.add(ch.country);
  });

  // Fill dropdown with full country names
  [...countryCodes].sort().forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = countriesMap[code] || code;
    countrySelect.appendChild(option);
  });

  // Streams
  const streamsRes = await fetch(STREAMS_API);
  const streamsData = await streamsRes.json();

  allPlayableChannels = streamsData
    .filter(s => s.url && s.url.endsWith(".m3u8") && s.channel)
    .map(s => {
      const meta = channelsMap[s.channel];
      return {
        name: meta?.name || s.channel,
        countryCode: meta?.country || "XX",
        countryName: countriesMap[meta?.country] || "Unknown",
        url: s.url
      };
    });

  renderChannels(allPlayableChannels.slice(0, 200));
}

/* Render list */
function renderChannels(list) {
  channelList.innerHTML = "";
  list.forEach(ch => {
    const li = document.createElement("li");
    li.textContent = `${ch.name} (${ch.countryName})`;
    li.onclick = () => playChannel(ch.url, ch.name);
    channelList.appendChild(li);
  });
}

/* Play */
function playChannel(url, name) {
  if (hls) hls.destroy();

  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }

  nowPlaying.textContent = "Now Playing: " + name;
}

/* Search */
searchBtn.addEventListener("click", () => {
  const text = searchInput.value.toLowerCase();
  const countryCode = countrySelect.value;

  const filtered = allPlayableChannels.filter(ch => {
    const matchName = ch.name.toLowerCase().includes(text);
    const matchCountry =
      countryCode === "" || ch.countryCode === countryCode;
    return matchName && matchCountry;
  });

  renderChannels(filtered.slice(0, 200));
});

loadData();

