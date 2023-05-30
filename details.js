//const rawdata = require("./data");

document.addEventListener('DOMContentLoaded', function () {

  const urlParams = new URLSearchParams(window.location.search);

  const prodId = urlParams.get('prodId');

  console.log(`prodId: ${prodId}`);

  const selectedProduct = rawdata.find(product => product.prodId === parseInt(prodId));

  const productImages = selectedProduct.productMedia;

  const title = selectedProduct.title;
  const description = selectedProduct.description;
  const price = selectedProduct.price;

  document.getElementById('productTitle').textContent = title;
  document.getElementById('productPrice').textContent = '$ ' + price;
  document.getElementById('productDescription').textContent = 'Description' + description;

  console.log(`Title: ${title} \n Description: ${description} \n Price: ${price}`);

  //const desiredProduct = rawdata.find(product => product.prodId === prodIdToFind);

  console.log(productImages);
  const carouselInner = document.querySelector('.carousel-inner');

  // 2. Generate HTML for each product
  const productsHTML = productImages.map((product, index) => {
    const isActive = index === 0 ? 'active' : ''; // Add 'active' class to the first item

    return `
    <div class="carousel-item ${isActive}">
    <img src="https://storage.googleapis.com/luxe_media/wwwroot/${product.url}" class="d-block w-100" >
    </div>
    `;
  });

  // 3. Append the generated HTML to the carousel inner container
  carouselInner.innerHTML = productsHTML.join('');

  // 4. Get the carousel control buttons
  const prevButton = document.querySelector('.carousel-control-prev');
  const nextButton = document.querySelector('.carousel-control-next');

  // 5. Add event listeners to the buttons
  prevButton.addEventListener('click', function () {
    // Slide to the previous item
    const activeItem = document.querySelector('.carousel-item.active');
    const prevItem = activeItem.previousElementSibling || carouselInner.lastElementChild;
    activeItem.classList.remove('active');
    prevItem.classList.add('active');
  });

  nextButton.addEventListener('click', function () {
    // Slide to the next item
    const activeItem = document.querySelector('.carousel-item.active');
    const nextItem = activeItem.nextElementSibling || carouselInner.firstElementChild;
    activeItem.classList.remove('active');
    nextItem.classList.add('active');
  });

});

function goBack() {
  window.history.back();
}