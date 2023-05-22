//const rawdata = require('./data.js');

var paginatedProducts = [];
var allProducts = [];
var filteredProducts = [];
var allProductsWithMedia = [];

const productsPerPage = 12;
let currentPage = 1;
let toPage = 1;
let mediaProducts = productsWithMedia().length;
let allPages = Math.ceil(mediaProducts / productsPerPage);
let numbOfPages = allPages;
let isFiltered = false;
//let selectedSort = '';

const ul = document.querySelector('ul');

let _filterType;

pagination(numbOfPages, currentPage);

function updateQueryParams(selectedSort, selectedCategory, selectedPrice) {
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);

  const existingCategory = queryParams.get('categoryId');
  const newCategory = selectedCategory !== '0' && selectedCategory !== undefined ? selectedCategory : existingCategory;

  let newPriceRange = selectedPrice !== '0' && selectedPrice !== undefined ? selectedPrice : null;

  if (newPriceRange !== null) {
    queryParams.set('priceRange', newPriceRange);
  } else {
    queryParams.delete('priceRange');
  }

  if (newCategory !== null) {
    queryParams.set('categoryId', newCategory);
  } else {
    queryParams.delete('categoryId');
  }

  if (selectedSort) {
    queryParams.set('sort', selectedSort);
  } else {
    queryParams.delete('sort');
  }

  url.search = queryParams.toString();
  window.history.pushState({}, '', url.toString());
  console.log(`url.search = queryParams.toString(): ${url.search}`);
}


function showPage(page) {

  const url = new URL(window.location.href);
  const queryParams = url.searchParams;

  const selectedCategory = queryParams.get('categoryId') || '0';
  const selectedPrice = queryParams.get('priceRange') || '0';
  const selectedSort = queryParams.get('sort') || '';
  // console.log(`url: ${url}`);
  // console.log(`queryParams: ${queryParams}`);
  // console.log(`selectedCategory: ${selectedCategory}`);
  // console.log(`selectedPrice: ${selectedPrice}`);
  // console.log(`selectedSort: ${selectedSort}`);

  document.getElementById('categorySelection').value = selectedCategory;
  document.getElementById('priceSelection').value = selectedPrice;

  updateQueryParams(selectedSort, selectedCategory, selectedPrice)

  var items = productsWithMedia();

  toPage = page;
  let start = (page - 1) * productsPerPage;
  let end = start + productsPerPage;

  let select = document.getElementById("categorySelection");
  rawdata[0].prodType.productCategory.forEach(product => {
    const option = document.createElement("option");
    option.value = product.categoryId;
    option.text = product.categoryName;
    select.add(option);
  });

  if ((_filterType == 'category')|| (_filterType == 'price')) {
    if (page <= 1){
      start = 0; 
      end = 12;
      paginatedProducts = []
      paginatedProducts = allProducts.slice(start, end);
    }else {
      paginatedProducts = [];
      paginatedProducts = allProducts.slice(start, end);
    }
  }
  else {
    if (page <= 1){
      start = 0;
      end = 12;
      paginatedProducts = [];
      paginatedProducts = items.slice(start, end);
    }else{
      paginatedProducts = [];
      paginatedProducts = items.slice(start, end);
    }

  }

  updateUI(paginatedProducts);

  if (selectedSort == 'ascending' || selectedSort == 'descending' || selectedSort == 'reset'){
    filter(selectedSort);
  }
}

function filter(filterType) {
  isFiltered = true;
  _filterType = filterType;
  var categorySelection = document.getElementById('categorySelection');
  let selectedCategory = categorySelection.options[categorySelection.selectedIndex].value;

  var priceSelection = document.getElementById('priceSelection');
  let selectedPrice = priceSelection.options[priceSelection.selectedIndex].value;

  let selectedSort;
  if (_filterType == 'category' || _filterType == 'price') {
    selectedSort = '';
    updateQueryParams(selectedSort, selectedCategory, selectedPrice);
  } else {
    selectedSort = _filterType;
    updateQueryParams(selectedSort, selectedCategory, selectedPrice);
  }

  let start = (toPage - 1) * productsPerPage;
  let end = start + productsPerPage;

  allProducts = [];
  filteredProducts = [];

  if (filterType == 'category' || filterType == 'price'){
    var items = productsWithMedia();
    var uniqueItems = [...new Set(items)];
    for (const data of uniqueItems)  {
      if (selectedCategory === '0' || data.categoryId == selectedCategory) {
        if ((filterType === 'category' && checkPrice(data, selectedPrice)) || (filterType === 'price' && checkPrice(data, selectedPrice))) {
          allProducts.push(data);
        }
      }
    }

    let products = [];
    if (allProducts.length < 12){
      products = allProducts;
    }
    else {
      if (isNaN(start)){
        products = allProducts.slice(0, 12);
      }
      else {
        products = allProducts.slice(start, end);
      }
    }

    for (const product of products) {
      filteredProducts.push(product);
    }

    if (selectedCategory != 0 || selectedPrice != 0){
      numbOfPages = Math.ceil(allProducts.length / productsPerPage);
    }else {
      numbOfPages = allPages;
    }
    pagination(numbOfPages, currentPage);
  }
  else if (filterType == 'ascending' || filterType == 'descending' || filterType == 'reset') {
    if (filterType == 'ascending') {
      selectedSort = 'ascending';
      paginatedProducts.sort((a, b) => a.price - b.price);
      updateUI(paginatedProducts);
    } else if (filterType == 'descending') {
      selectedSort = 'descending';
      paginatedProducts.sort((a, b) => b.price - a.price);
      updateUI(paginatedProducts);
    } else if (filterType == 'reset'){
      selectedSort = '';
      updateQueryParams(selectedSort, selectedCategory, selectedPrice);
      let c = document.URL.replace(window.location.search, '')
      window.history.replaceState(history.state, '', c)
      window.location.reload()
      //showPage(toPage);
    }
  }
}

function productsWithMedia() {
  for (const data of rawdata) {
    if (data.productMedia[0]) {
      allProductsWithMedia.push(data);
    }
  }

  return allProductsWithMedia;
}

function checkPrice(data, selectedPrice) {
  switch(selectedPrice) {
    case '0':
      return true;
    case '1':
      return data.price > 0 && data.price <= 100;
    case '2':
      return data.price > 100 && data.price <= 500;
    case '3':
      return data.price > 500 && data.price <= 1000;
    case '4':
      return data.price > 1000;
    default:
      return false;
  }
}

function updateUI(products) {

  let data = '<div class="row">';

  for (const product of products) {
    data += 
      `<div class="col-md-3">
        <a href="./details.html?productDescription=${product.description}&productTitle=${product.title}&productPrice=${product.price}&productImage=${product.productMedia[0].url}" style="max-width: 261px">
          <img src="https://storage.googleapis.com/luxe_media/wwwroot/${product.productMedia[0].url}" alt="" style="width: 100%">
          <p>${product.title}</p>
          <p>$ ${product.price}</p>
        </a>
        <hr/>
      </div>
      `;
  }

  data += '</div>';

  document.getElementById('target').innerHTML = data;
}

// function pagination(numbOfPages, currentPage) {
  
//   let li = '';

//   let beforePages = currentPage - 5;
//   let afterPages = currentPage + 5;
//   let liActive;

//   if (currentPage > 1) {
//     li += `<li class="btn" onclick="pagination(${numbOfPages}, ${currentPage-1})"><i class="bi bi-chevron-left"></i></li>`;
//   }

//   for (let productsPerPage = beforePages; productsPerPage <= afterPages; productsPerPage++){
    
//     if (productsPerPage > numbOfPages){
//       continue;
//     }
//     if (productsPerPage == 0){
//       productsPerPage = productsPerPage + 1;
//     }

//     if (currentPage == productsPerPage){
//       liActive = 'active';
//     }else {
//       liActive = '';
//     }

//     li += `<li class="numb ${liActive}" onclick="pagination(${numbOfPages}, ${currentPage})"><span>${productsPerPage}</span></li>`;
//   }

//   if (currentPage < numbOfPages){
//     li += `<li class="btn" onclick="pagination(${numbOfPages}, ${currentPage+1})"><i class="bi bi-chevron-right"></i></li>`;
//   }

//   ul.innerHTML = li;
//   showPage(currentPage);
// }

function pagination(numbOfPages, currentPage) {
  
  let li = '';
  let beforePages;

  if (currentPage < 5){
    beforePages = currentPage - 1;
  }else {
    beforePages = currentPage - 5;
  }
  let afterPages = currentPage + 5;
  let liActive;

  if (currentPage > 1) {
    li += `<li class="btn" onclick="pagination(${numbOfPages}, ${currentPage-1})"><i class="bi bi-chevron-left"></i></li>`;
  }

  for (let productsPerPage = beforePages; productsPerPage <= afterPages; productsPerPage++){

    if (productsPerPage > numbOfPages){
      continue;
    }
    if (productsPerPage == 0){
      productsPerPage = productsPerPage + 1;
    }

    if (currentPage == productsPerPage){
      liActive = 'active';
    }else {
      liActive = '';
    }

    li += `<li class="numb ${liActive}" onclick="pagination(${numbOfPages}, ${productsPerPage})"><span>${productsPerPage}</span></li>`;
  }

  if (currentPage < numbOfPages){
    li += `<li class="btn" onclick="pagination(${numbOfPages}, ${currentPage+1})"><i class="bi bi-chevron-right"></i></li>`;
  }

  ul.innerHTML = li;
  showPage(currentPage);
}


window.addEventListener('load', function () {
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  let para = url.search.substring(1)

  const selectedCategory = queryParams.get('categoryId') || '0';
  const selectedPrice = queryParams.get('priceRange') || '0';
  const selectedSort = queryParams.get('sort') || '';

  console.log(`url: ${url}`);
  console.log(`queryParams: ${queryParams}`);
  console.log(`para: ${para}`);

  document.getElementById('categorySelection').value = selectedCategory;
  document.getElementById('priceSelection').value = selectedPrice;

  if (selectedCategory !== '0' || selectedPrice !== '0') {
    filter(selectedCategory !== '0' ? 'category' : 'price');
  }
  
  if (selectedSort) {
    filter(selectedSort);
  }
});

