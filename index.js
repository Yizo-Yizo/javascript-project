//const rawdata = require('./data.js');

var paginatedProducts = [];
var allProducts = [];
var filteredProducts = [];

const productsPerPage = 23;
let currentPage = 1;
let toPage = 1;

let _filterType;
let selectedCategory;
let selectedPrice;

function showPage(page) {
  alert('count in showPage(): '+ page)
  toPage = page;
  let start = (page - 1) * productsPerPage;
  let end = start + productsPerPage;

  alert('Filter type in showPage: ' + _filterType);
  alert('Selected category: ' + selectedCategory);
  alert('Selected price: ' + selectedPrice);
  if ((_filterType == 'category' && selectedCategory != 0)|| (_filterType == 'price' && selectedPrice != 0)) {
    alert('In the if condition')
    paginatedProducts = filteredProducts;
  }
  else {
    alert('In the else statement ' + start +' , '+ end );
    if ( currentPage <= 1){
      start = 0;
      end = 23;
      paginatedProducts = rawdata.slice(start, end);
    }
    else {
      paginatedProducts = rawdata.slice(start, end);
    }
  }

  updateUI(paginatedProducts);
}

function filter(filterType) {
  _filterType = filterType;
  alert('Filter type in filterType: ' + filterType);
  var categorySelection = document.getElementById('categorySelection');
  selectedCategory = categorySelection.options[categorySelection.selectedIndex].value;

  var priceSelection = document.getElementById('priceSelection');
  selectedPrice = priceSelection.options[priceSelection.selectedIndex].value;

  let start = (toPage - 1) * productsPerPage;
  let end = start + productsPerPage;

  allProducts = [];
  filteredProducts = [];

  for (const data of rawdata)  {
    if (selectedCategory === '0' || data.categoryId == selectedCategory) {
      if (filterType === 'category' || (filterType === 'price' && checkPrice(data, selectedPrice))) {
        allProducts.push(data);
      }
    }
  }

  let products = [];
  if (allProducts.length < 23){
    products = allProducts;
  }
  else{
    products = allProducts.slice(start, end);
  }

  for (const product of products) {
    filteredProducts.push(product);
  }

  showPage(filteredProducts);

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
}


function updateUI(products) {

  let data = '<div class="row">';

  for (const product of products) {
    if (product.productMedia[0]){
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
  }
  else if (sort == 'descending'){
    paginatedProducts.sort((a, b) => b.price - a.price);
  }
  else {

  }
  updateUI(paginatedProducts);
}

showPage(currentPage);