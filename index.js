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


let _filterType;
let selectedCategory;
let selectedPrice;


function showPage(page) {
  console.log("Clicked chevron")
  console.log('Inside showPage() page = ' + page)
  console.log('currentPage = ' + currentPage)
  console.log('Typeof: ' + typeof(page))
  var items = productsWithMedia();

  console.log('Items: ' + items.length)
  toPage = page;
  let start = (page - 1) * productsPerPage;
  let end = start + productsPerPage;
  console.log('start: ' + start)
  console.log('end: ' + end)

  let select = document.getElementById("categorySelection");
  rawdata[0].prodType.productCategory.forEach(product => {
    const option = document.createElement("option");
    option.value = product.categoryId;
    option.text = product.categoryName;
    select.add(option);
  });

  if ((_filterType == 'category' && selectedCategory != 0)|| (_filterType == 'price' && selectedPrice != 0)) {
    paginatedProducts = filteredProducts;
  }
  else {
    if (page <= 1){
      start = 0;
      end = 12;
      paginatedProducts = [];
      paginatedProducts = items.slice(start, end);
    }

    paginatedProducts = [];
    paginatedProducts = items.slice(start, end);
    console.log('PaginatedProducts: ' + paginatedProducts.length)
  }

  for (const product of paginatedProducts){
    console.log(product.title)
  }
  console.log('Before updateUI(paginatedProducts): ' + paginatedProducts.length)

  updateUI(paginatedProducts);
}

function filter(filterType) {
  _filterType = filterType;
  var categorySelection = document.getElementById('categorySelection');
  selectedCategory = categorySelection.options[categorySelection.selectedIndex].value;

  var priceSelection = document.getElementById('priceSelection');
  selectedPrice = priceSelection.options[priceSelection.selectedIndex].value;

  let start = (toPage - 1) * productsPerPage;
  let end = start + productsPerPage;

  allProducts = [];
  filteredProducts = [];

  var items = productsWithMedia();
  var uniqueItems = [...new Set(items)];
  for (const data of uniqueItems)  {
    if (selectedCategory === '0' || data.categoryId == selectedCategory) {
      if ((filterType === 'category' && checkPrice(data, selectedPrice)) || (filterType === 'price' && checkPrice(data, selectedPrice))) {
        allProducts.push(data);
      }
    }
  }

  console.log('allProducts.legnth: ' + allProducts.length);

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

  updateUI(filteredProducts);
  
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
  console.log("In the updateUI")
  let data = '<div class="row">';

  for (const product of products) {
    console.log(product.title)
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

function nextPage() {
  currentPage++;
  showPage(currentPage);
}

function prevPage() {
  currentPage--;
  showPage(currentPage);
}

function sort(sort) {
  if (sort == 'ascending'){
    paginatedProducts.sort((a, b) => a.price - b.price);
    updateUI(paginatedProducts);
  }
  else if (sort == 'descending'){
    paginatedProducts.sort((a, b) => b.price - a.price);
    updateUI(paginatedProducts);
  }
  else {
    location.reload(true);
  }
  
}

const ul = document.querySelector('ul');

function pagination(allPages, currentPage) {
  
  let li = '';

  let beforePages = currentPage - 1;
  let afterPages = currentPage + 1;
  let liActive;

  if (currentPage > 1) {
    li += `<li class="btn" onclick="pagination(${allPages}, ${currentPage-1})"><i class="bi bi-chevron-left"></i></li>`;
  }

  for (let productsPerPage = beforePages; productsPerPage <= afterPages; productsPerPage++){

    if (productsPerPage > allPages){
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

    li += `<li class="numb ${liActive}" onclick="pagination(${allPages}, ${productsPerPage})"><span>${productsPerPage}</span></li>`;
  }

  if (currentPage < allPages){
    li += `<li class="btn" onclick="pagination(${allPages}, ${currentPage+1})"><i class="bi bi-chevron-right"></i></li>`;
  }

  ul.innerHTML = li;
  console.log('Last part: ' + currentPage);
  showPage(currentPage);
}

//showPage(currentPage);
pagination(allPages, currentPage);

