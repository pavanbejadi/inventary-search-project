async function handleSearch() {
  const q = document.getElementById("q").value.trim();
  const category = document.getElementById("category").value;
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;

  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (category) params.append("category", category);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  hideAll();

  try {
    const res = await fetch(`/search?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.message || "Something went wrong.");
      return;
    }

    if (data.results.length === 0) {
      showEmpty();
    } else {
      showResults(data.results);
    }
  } catch (err) {
    showError("Could not connect to server. Make sure the backend is running.");
  }
}

function handleClear() {
  document.getElementById("q").value = "";
  document.getElementById("category").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  hideAll();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  });
});

function showResults(items) {
  const section = document.getElementById("resultsSection");
  const container = document.getElementById("resultsContainer");
  const countEl = document.getElementById("resultsCount");

  countEl.textContent = `${items.length} item${items.length !== 1 ? "s" : ""} found`;

  const rows = items
    .map(
      (item) => `
    <tr>
      <td class="td-name">${escapeHtml(item.productName)}</td>
      <td class="td-category">${escapeHtml(item.category)}</td>
      <td class="td-price">₹${item.price.toLocaleString("en-IN")}</td>
      <td>${escapeHtml(item.supplier)}</td>
    </tr>
  `,
    )
    .join("");

  container.innerHTML = `
    <table class="results-table">
      <thead>
        <tr>
          <th>PRODUCT NAME</th>
          <th>CATEGORY</th>
          <th>PRICE</th>
          <th>SUPPLIER</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  section.style.display = "block";
}

function showEmpty() {
  document.getElementById("emptyState").style.display = "block";
}

function showError(msg) {
  document.getElementById("errorMsg").textContent = "⚠ " + msg;
  document.getElementById("errorState").style.display = "block";
}

function hideAll() {
  document.getElementById("resultsSection").style.display = "none";
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("errorState").style.display = "none";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
