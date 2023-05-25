//const rawdata = require("./data");

document.addEventListener('DOMContentLoaded', function () {

  const urlParams = new URLSearchParams(window.location.search);

  const prodId = urlParams.get('prodId');

  console.log(`prodId: ${prodId}`);

  const selectedProduct = rawdata.find(product => product.prodId === parseInt(prodId));

  const productsCategory = selectedProduct.prodType.productCategory;

  //const desiredProduct = rawdata.find(product => product.prodId === prodIdToFind);

  console.log(productsCategory);
  const carouselInner = document.querySelector('.carousel-inner');

  // 2. Generate HTML for each product
  const productsHTML = productsCategory.map((product, index) => {
    const isActive = index === 0 ? 'active' : ''; // Add 'active' class to the first item

    return `
    <div class="carousel-item ${isActive}">
      <h3>${product.categoryName}</h3>
      <!-- Add other product details as needed -->
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