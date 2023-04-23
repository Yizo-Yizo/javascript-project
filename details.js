
document.addEventListener('DOMContentLoaded', function(){
  
  const urlParams = new URLSearchParams(window.location.search);

  const productDescription = urlParams.get('productDescription');
  const productTitle = urlParams.get('productTitle');
  const productPrice = urlParams.get('productPrice');
  const productImage = urlParams.get('productImage')

  document.getElementById('productDescription').textContent = 'Description' + productDescription;
  document.getElementById('productTitle').textContent = productTitle;
  document.getElementById('productPrice').textContent = '$ ' + productPrice;
  document.getElementById('productImage').src = 'https://storage.googleapis.com/luxe_media/wwwroot/' + productImage;
});

