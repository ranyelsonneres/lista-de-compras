const form = document.querySelector("#item-form");
const nameInput = document.querySelector("#item-name");
const qtyInput = document.querySelector("#item-qty");
const categoryInput = document.querySelector("#item-category");
const list = document.querySelector("#shopping-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearDoneButton = document.querySelector("#clear-done");
const filterButtons = document.querySelectorAll(".filter-button");

let items = [];
let activeFilter = "all";

function createItem(name, quantity, category) {
  return {
    id: crypto.randomUUID(),
    name,
    quantity,
    category,
    done: false,
  };
}

function getFilteredItems() {
  if (activeFilter === "pending") {
    return items.filter((item) => !item.done);
  }

  if (activeFilter === "done") {
    return items.filter((item) => item.done);
  }

  return items;
}

function updateCounter() {
  const totalPending = items.filter((item) => !item.done).length;
  remainingCount.textContent = totalPending;
}

function updateEmptyState(visibleItems) {
  const hasItems = items.length > 0;
  const hasVisibleItems = visibleItems.length > 0;

  if (!hasItems) {
    emptyState.textContent = "Sua lista ainda esta vazia. Adicione o primeiro item para comecar.";
  } else {
    emptyState.textContent = "Nenhum item encontrado neste filtro.";
  }

  emptyState.classList.toggle("hidden", hasVisibleItems);
}

function renderItems() {
  const visibleItems = getFilteredItems();

  list.innerHTML = "";

  visibleItems.forEach((item) => {
    const row = document.createElement("li");
    row.className = `shopping-item${item.done ? " done" : ""}`;
    row.dataset.id = item.id;

    const checkButton = document.createElement("button");
    checkButton.className = "check-button";
    checkButton.type = "button";
    checkButton.dataset.action = "toggle";
    checkButton.setAttribute("aria-label", `Marcar ${item.name} como ${item.done ? "pendente" : "comprado"}`);
    checkButton.textContent = item.done ? "✓" : "";

    const content = document.createElement("div");
    content.className = "item-content";

    const title = document.createElement("span");
    title.className = "item-title";
    title.textContent = item.name;

    const meta = document.createElement("span");
    meta.className = "item-meta";
    meta.innerHTML = `<span>${item.quantity} un.</span><span class="tag">${item.category}</span>`;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.textContent = "Remover";

    content.append(title, meta);
    row.append(checkButton, content, removeButton);
    list.append(row);
  });

  updateCounter();
  updateEmptyState(visibleItems);
}

function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  renderItems();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const quantity = Math.max(1, Number(qtyInput.value) || 1);
  const category = categoryInput.value;

  if (!name) {
    nameInput.focus();
    return;
  }

  items = [createItem(name, quantity, category), ...items];

  form.reset();
  qtyInput.value = "1";
  categoryInput.value = "Mercado";
  nameInput.focus();
  setFilter("all");
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const itemId = button.closest(".shopping-item").dataset.id;

  if (button.dataset.action === "toggle") {
    items = items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item));
  }

  if (button.dataset.action === "remove") {
    items = items.filter((item) => item.id !== itemId);
  }

  renderItems();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

clearDoneButton.addEventListener("click", () => {
  items = items.filter((item) => !item.done);
  renderItems();
});

renderItems();
