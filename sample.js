const rawdata = require('./data.js');

// for (const data of rawdata) {
//   if (data.price > 0 && data.price <= 100) {
//     console.log(data.price);
//   }
// }

// function filter(filterType) {

//   let start = (toPage - 1) * productsPerPage;
//   let end = start + productsPerPage;

  
//   var categorySelection = document.getElementById('categorySelection');
//   var selectedCategory = categorySelection.options[categorySelection.selectedIndex].value;

//   var priceSelection = document.getElementById('priceSelection');
//   var selectedPrice = priceSelection.options[priceSelection.selectedIndex].value;

//   let products = rawdata.slice(start, end);
//   var filteredProducts = [];
//   //var items = paginationProducts;

//   for (var i = 0; i < products.length; i++) {
//     var product = products[i];

//     if (filterType === 'category') {
//       if (selectedCategory === '0' || product.categoryId == selectedCategory) {
//         filteredProducts.push(product);
//       }
//     }

//     else if (filterType === 'price') {
//       if (selectedPrice === '0' || item.price <= parseFloat(selectedPrice)) {
//         filteredProducts.push(product);
//       }
//     }
//   }
//   updateUI(filteredProducts);
// }

// function filter(filterType) {

//   var categorySelection = document.getElementById('categorySelection');
//   var selectedCategory = categorySelection.options[categorySelection.selectedIndex].value;

//   var priceSelection = document.getElementById('priceSelection');
//   var selectedPrice = priceSelection.options[priceSelection.selectedIndex].value;

//   //alert('Selected Price: ' + selectedPrice)
//   //alert('Selected Categoty ' + selectedCategory)
//   let start = (toPage - 1) * productsPerPage;
//   let end = start + productsPerPage;

//   var allProducts = [];
//   var filteredProducts = [];

//   for (const data of rawdata)  {
//     if (filterType === 'category') {
//       if (selectedCategory === '0' || data.categoryId == selectedCategory) {
//         allProducts.push(data);
//       }
//     }
//     else if (filterType === 'price') {
//       switch(filterType) {
//         case 'price':
//           switch(selectedPrice) {
//             case '0':
//               allProducts.push(data);
//               break;
//             case '1':
//               if (data.price > 0 && data.price <= 100) {
//                 allProducts.push(data);
//               }
//               break;
//             case '2':
//               if (data.price > 100 && data.price <= 500) {
//                 allProducts.push(data);
//               }
//               break;
//             case '3':
//               if (data.price > 500 && data.price <= 1000) {
//                 allProducts.push(data);
//               }
//               break;
//             case '4':
//               if (data.price > 1000) {
//                 allProducts.push(data);
//               }
//               break;
//             default:
//               break;
//           }
//           break;
//         default:
//           break;
//       }
//     }
//   }

//   //alert('All Products length: ' + allProducts.length)

//   let products = [];
//   if (allProducts.length < 23){
//     products = allProducts;
//   }
//   else{
//     products = allProducts.slice(start, end);
//   }

//   //alert('Sliced products: ' + products.length);

//   for (const product of products) {
//     filteredProducts.push(product);
//   }

//   updateUI(filteredProducts);
// }
let allProductsWithMedia = [];
const productsPerPage = 12;
let mediaProducts = productsWithMedia().length;

function productsWithMedia() {
  for (const data of rawdata) {
    if (data.productMedia[0]) {
      allProductsWithMedia.push(data);
    }
  }

  return allProductsWithMedia;
}

let allPages = Math.ceil(mediaProducts / productsPerPage);
console.log(allPages);