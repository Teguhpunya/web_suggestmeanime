const navInfo = document.getElementById("nav-info");
const navAnimes = document.getElementById("nav-animes");
const aside = document.getElementById("aside");
const exitInfo = document.getElementById("exit-aside");
const animeDetail = document.getElementById("anime-detail");
const exitDetail = document.getElementById("exit-detail");
const animeDetailContent = document.getElementById("anime-detail-content");
const toTop = document.getElementById("to-top");

const content = document.getElementById("container-articles");

let list;

const animeDetailClose = () => {
  animeDetail.style.display = "none";
};

// Mouse events
navAnimes.onclick = () => {
  content.scrollIntoView({ behavior: "smooth" });
};

navInfo.onclick = () => {
  aside.style.display = "block";
  aside.scrollIntoView({ behavior: "smooth" });
};

exitInfo.onclick = () => {
  aside.style.display = "none";
};

exitDetail.onclick = animeDetailClose;
animeDetail.onmouseleave = animeDetailClose;

toTop.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
// Fetch content list
const loadJson = async () => {
  const requestURL = "./lists.json";
  const request = new Request(requestURL);
  const response = await fetch(request);

  // console.log("response", response);

  const json = await response.json();
  // console.log("json", json);
  return json;
};

// Container template
const containerAnime = (srcImg, title, episode, yearStart, yearEnd, rate) => {
  return `
    <img src=${srcImg} alt="">
    <div>
        <div class="item-title">
            <div>${title}</div>
        </div>
        <div class="item-episode flex-row">
            <div>Episode</div>
            <div>${episode}</div>
        </div>
        <div class="item-year flex-row">
            <div>Disiarkan</div>
            <div>${yearStart} - ${yearEnd}</div>
        </div>
        <div class="item-rate flex-row">
            <div>Rate</div>
            <div>${rate}</div>
        </div>
    </div>
    `;
};

const containerDetailAnime = (srcImg, desc) => {
  return `
      <img src=${srcImg} alt="">
      <div class="item-desc">
          ${desc}
      </div>
      `;
};

// Display recommended anime
const displayList = async () => {
  list = await loadJson();

  // remove duplicate
  const filtered = list.reduce((acc, current) => {
    const x = acc.find(
      (item) => item.mediaRecommendation.id === current.mediaRecommendation.id
    );

    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);
  list = filtered;

  // parse list
  filtered.forEach((item) => {
    // console.log(item);
    const _item = item.mediaRecommendation;
    if (_item.type == "ANIME") {
      const [srcImg, title, episode, rate, desc] = [
        _item.bannerImage,
        _item.title.english,
        _item.episodes ? _item.episodes : "ongoing",
        _item.meanScore,
        _item.description,
      ];
      const yearStart = `${_item.startDate.year}.${_item.startDate.month}.${_item.startDate.day}`;
      const yearEnd = `${_item.endDate.year}.${_item.endDate.month}.${_item.endDate.day}`;

      const newElement = document.createElement("article");
      newElement.id = _item.id;
      newElement.onclick = (event) => {
        animeDetailContent.innerHTML = containerDetailAnime(srcImg, desc);
        animeDetail.style.display = "block";
        animeDetail.style.left = `${event.pageX}px`;
        animeDetail.style.top = `${event.pageY}px`;
        // console.log(event.clientX);
        const offsetPos = event.pageY - 40;
        window.scrollTo({
          top: `${offsetPos}`,
          behavior: "smooth",
        });
      };
      newElement.innerHTML = containerAnime(
        srcImg,
        title,
        episode,
        yearStart,
        yearEnd.includes("null") ? "ongoing" : yearEnd,
        rate
      );
      content.appendChild(newElement);
    }
  });
};
displayList();
