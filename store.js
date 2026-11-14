const search = document.querySelector("#search");
const filters = document.querySelector("#filters");
const grid = document.querySelector("#apps");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const card = document.querySelector("#card");

let activeCategory = "";
const categories = [...new Set(apps.map(app => app.category))]
  .sort((first, second) => first.localeCompare(second, "sv"));

function normalize(value) {
  return value.toLocaleLowerCase("sv").normalize("NFD").replace(/\p{M}/gu, "");
}

function render() {
  const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  const visibleApps = apps.filter(app => {
    const content = normalize([app.name, app.category, app.description].join(" "));
    return (!activeCategory || app.category === activeCategory) &&
      words.every(word => content.includes(word));
  });

  grid.replaceChildren(...visibleApps.map(app => {
    const fragment = card.content.cloneNode(true);
    const icon = fragment.querySelector(".app-icon");
    icon.textContent = app.icon;
    icon.dataset.color = app.color;
    const link = fragment.querySelector(".open");
    link.href = app.url;
    link.setAttribute("aria-label", `Öppna ${app.name}`);
    fragment.querySelector(".category").textContent = app.category;
    fragment.querySelector("h3").textContent = app.name;
    fragment.querySelector(".description").textContent = app.description;
    return fragment;
  }));

  count.textContent = visibleApps.length === 1 ? "1 app" : `${visibleApps.length} appar`;
  empty.hidden = visibleApps.length > 0;
  empty.textContent = apps.length ? "Inga appar matchar. Prova en annan sökning eller kategori." : "Inga appar har lagts till ännu.";
}

for (const category of ["", ...categories]) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = category || "Alla appar";
  button.setAttribute("aria-pressed", String(!category));
  button.addEventListener("click", () => {
    activeCategory = category;
    for (const filter of filters.children) {
      filter.setAttribute("aria-pressed", String(filter === button));
    }
    render();
  });
  filters.append(button);
}

search.addEventListener("input", render);
render();
