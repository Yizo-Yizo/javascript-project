//const rawdata = require("./data");

//const rawdata = require('./data.js');
const productsPerPage = 12;
let currentPage = 1;
let selectedCategory = '0';
let selectedPrice = '0';
let selectedSort = '';

const ul = document.querySelector('.pagination');
const productList = document.getElementById('product-list');
const categorySelection = document.getElementById('categorySelection');
const priceSelection = document.getElementById('priceSelection');
const filterButtons = document.querySelectorAll('.filter-btn');
const resetFilterButton = document.querySelector('.reset-filter-btn');

function updateQueryParams() {
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);

  if (selectedCategory !== '0') {
    queryParams.set('categoryId', selectedCategory);
  } else {
    queryParams.delete('categoryId');
  }

  if (selectedPrice !== '0') {
    queryParams.set('priceRange', selectedPrice);
  } else {
    queryParams.delete('priceRange');
  }

  if (selectedSort !== '') {
    queryParams.set('sort', selectedSort);
  } else {
    queryParams.delete('sort');
  }

  url.search = queryParams.toString();
  window.history.pushState({}, '', url.toString());
}


function updateFilterSelections() {
  categorySelection.value = selectedCategory;
  priceSelection.value = selectedPrice;
}

function filterProducts() {
  let isCategoryMatch;
  let isPriceMatch; 
  let filteredProducts = rawdata.filter(product => {
    if (!product.productMedia || product.productMedia.length === 0) {
      return false; // Skip products without media
    }

    if (product.productMedia[0]){

      isCategoryMatch = selectedCategory === '0' || product.categoryId === parseInt(selectedCategory);
      isPriceMatch = checkPrice(product, selectedPrice);
    }
    

    return isCategoryMatch && isPriceMatch;
  });

  if (selectedSort === 'ascending') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'descending') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  return filteredProducts;
}



function checkPrice(product, selectedPrice) {
  const price = product.price;
  switch (selectedPrice) {
    case '0':
      return true;
    case '1':
      return price > 0 && price <= 100;
    case '2':
      return price > 100 && price <= 500;
    case '3':
      return price > 500 && price <= 1000;
    case '4':
      return price > 1000;
    default:
      return false;
  }
}

function renderProduct(product) {
  
  return `
    <div class="col-md-3">
      <a href="./details.html?prodId=${product.prodId}" style="max-width: 261px">
        <img src="https://storage.googleapis.com/luxe_media/wwwroot/${product.productMedia[0].url}" alt="" style="width: 100%">
        <p>${product.title}</p>
        <p>$ ${product.price}</p>
      </a>
      <hr/>
    </div>
  `;
}

function renderProducts(products) {
  let html = '<div class="row">';
  products.forEach((product, index) => {
    html += renderProduct(product);
    if ((index + 1) % 4 === 0) {
      html += '</div><div class="row">';
    }
  });
  html += '</div>';
  productList.innerHTML = html;
}


function renderPagination(numbOfPages, currentPage) {
  let html = '';

  const maxButtonsToShow = 5;
  const halfMaxButtonsToShow = Math.floor(maxButtonsToShow / 2);

  let startPage = currentPage - halfMaxButtonsToShow;
  let endPage = currentPage + halfMaxButtonsToShow;

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(numbOfPages, startPage + maxButtonsToShow - 1);
  }

  if (endPage > numbOfPages) {
    endPage = numbOfPages;
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  if (startPage > 1) {
    html += `<li class="btn" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></li>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<li class="numb ${currentPage === i ? 'active' : ''}" data-page="${i}"><span>${i}</span></li>`;
  }

  if (endPage < numbOfPages) {
    html += `<li class="btn" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></li>`;
  }

  ul.innerHTML = html;
}


function handlePageClick(event) {
  const page = parseInt(event.target.dataset.page);
  if (!isNaN(page) && page !== currentPage) {
    currentPage = page;
    showPage();
  }
}

function handleCategoryChange(event) {
  selectedCategory = event.target.value;
  currentPage = 1;
  showPage();
}

function handlePriceChange(event) {
  selectedPrice = event.target.value;
  currentPage = 1;
  showPage();
}

function handleFilterButtonClick(event) {
  selectedSort = event.target.dataset.filter;
  currentPage = 1;
  showPage();
}

function handleResetFilterButtonClick() {
  selectedCategory = '0';
  selectedPrice = '0';
  selectedSort = '';
  currentPage = 1;
  updateFilterSelections();
  showPage();
}

function showPage() {
  
  updateQueryParams();
  
  const filteredProducts = filterProducts();
  const numbOfPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  renderProducts(currentProducts);
  renderPagination(numbOfPages, currentPage);
}

function populateCategoryDropdown() {
  const select = document.getElementById("categorySelection");
  const categories = rawdata[0].prodType.productCategory;
  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.categoryId;
    option.text = category.categoryName;
    select.add(option);
  });
}

function initialize() {

  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('categoryId');
  const priceRange = urlParams.get('priceRange');
  const sort = urlParams.get('sort');

  selectedCategory = categoryId || '0';
  selectedPrice = priceRange || '0';
  selectedSort = sort || '';

  populateCategoryDropdown();
  updateFilterSelections();

  categorySelection.addEventListener('change', handleCategoryChange);
  priceSelection.addEventListener('change', handlePriceChange);
  filterButtons.forEach(btn => btn.addEventListener('click', handleFilterButtonClick));
  resetFilterButton.addEventListener('click', handleResetFilterButtonClick);
  ul.addEventListener('click', handlePageClick);

  showPage();
}

initialize();
