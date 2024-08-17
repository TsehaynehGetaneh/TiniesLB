function changeImage(imageSrc) {
    document.getElementById('mainImage').src = imageSrc;
}

const shipOption = document.getElementById('ship');
const pickUpOption = document.getElementById('pick-up');
const pickupLocations = document.getElementById('pickup-locations');

const showButton = document.getElementById('showBlockButton');
const hideButton = document.getElementById('hideBlockButton');

if (shipOption) {
    shipOption.addEventListener('click', function () {
        shipOption.classList.add('checkout-selected');
        pickUpOption.classList.add('checkout-nonSelected');
        pickUpOption.classList.remove('checkout-selected');
        pickupLocations.style.display = 'none';
    });

    pickUpOption.addEventListener('click', function () {
        shipOption.classList.remove('checkout-selected');
        pickUpOption.classList.add('checkout-selected');
        pickUpOption.classList.remove('checkout-nonSelected');
        pickupLocations.style.display = 'block';
    });
} else {
    showButton.addEventListener('click', function () {
        hiddenBlock.style.display = 'block';
        // body.classList.add('blur-background');
    });

    hideButton.addEventListener('click', function () {
        hiddenBlock.style.display = 'none';
        // body.classList.remove('blur-background');
    });
}




document.addEventListener('DOMContentLoaded', function () {
    const showButton = document.getElementById('showBlockButton');
    const hideButton = document.getElementById('hideBlockButton');
    const hiddenBlock = document.getElementById('hiddenBlock');
    const selectedProductsSection = document.getElementById('selected-products');
    const totalPriceElement = document.getElementById('total-price');
    const detailİmgSrc = document.getElementById('mainImage');

    const shipOption = document.getElementById('ship');
    const pickUpOption = document.getElementById('pick-up');
    const pickupLocations = document.getElementById('pickup-locations');

    const shopingCart = document.querySelector('.shopping-cart');
    const cartQtyController = document.querySelector('.cart-items-list');

    const checkOutForm = document.getElementById('checkout-form')

    const openConfirmationButtons = document.querySelectorAll('.open-confirmation-popup');
    const cancelButtons = document.querySelectorAll('.cancel-add-to-cart');

    if (openConfirmationButtons) {
        openConfirmationButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const productId = button.getAttribute('data-menu-item');
                const popup = document.getElementById(`confirmation-popup-${productId}`);
                popup.style.display = 'block';
            });
        });

        cancelButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const popup = button.closest('.popup');
                popup.style.display = 'none';
            });
        });
    }

    if (shipOption & pickUpOption & pickupLocations) {
        shipOption.addEventListener('click', function () {
            shipOption.classList.add('checkout-selected');
            pickUpOption.classList.add('checkout-nonSelected');
            pickUpOption.classList.remove('checkout-selected');
            pickupLocations.style.display = 'none';
        });

        pickUpOption.addEventListener('click', function () {
            shipOption.classList.remove('checkout-selected');
            pickUpOption.classList.add('checkout-selected');
            pickUpOption.classList.remove('checkout-nonSelected');
            pickupLocations.style.display = 'block';
        });
    }

    if (selectedProductsSection) {
        function displaySelectedProducts(cart, total_price) {
            selectedProductsSection.innerHTML = '';

            if (Object.keys(cart).length === 0) {
                const emptyCartMessage = document.createElement('p');
                emptyCartMessage.textContent = 'Your cart is empty.';
                selectedProductsSection.appendChild(emptyCartMessage);
            } else {
                for (const itemId in cart) {
                    const item = cart[itemId];

                    const productElement = document.createElement('div');
                    productElement.classList.add('selected-product');

                    const productInfo = document.createElement('p');
                    productInfo.innerHTML = `
                        <div class="checkout-product">
                            <div class="checkout-product-img"><img src="${item.image}" alt="product"></div>
                                <div class="checkout-product-r">
                                    <div class="checkout-product-title">${item.name}</div>
                                    <div class="checkout-product-rb">
                                        <div class="checkout-product-price">$${item.price}</div>
                                        <div class="checkout-product-quantity">${item.quantity}</div>
                                    </div>
                                </div>
                        </div>
                    `;
                    productElement.appendChild(productInfo);

                    selectedProductsSection.appendChild(productElement);
                }

                // Display total price
                totalPriceElement.textContent = `$${total_price}`;
            }
        }
    }



    loadCartData();

    function updateCartItemQuantity(itemId, quantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[itemId].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }

    function addToCart(itemId, itemName, itemPrice, itemColor, itemImage) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[itemId]) {
            cart[itemId].quantity += 1;
        } else {
            cart[itemId] = {
                name: itemName,
                price: itemPrice,
                quantity: 1,
                color: itemColor,
                image: itemImage,
            };
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }


    function removeFromCart(itemId) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        delete cart[itemId];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }

    function loadCartData() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        var total_price = calculateTotalPrice(cart);

        if (displaySelectedProducts) {
            displaySelectedProducts(cart, total_price);
        } else {
            updateCartDisplay(cart);
        }


    }

    function calculateTotalPrice(cart) {
        // Your logic to calculate the total price based on cart data
        let total = 0;
        for (const itemId in cart) {
            const item = cart[itemId];
            total += item.price * item.quantity;
        }
        return total.toFixed(2);
    }

    function updateCartDisplay(cart) {
        var totalPriceElement = document.getElementById('total-price');
        var totalPrice = 0;
        var cartItemsList = document.getElementById('cart-products');

        cartItemsList.innerHTML = '';

        for (var itemId in cart) {
            var item = cart[itemId];
            var itemName = item.name;
            var itemPrice = item.price;
            var itemQuantity = item.quantity;
            var itemTotalPrice = (itemPrice * itemQuantity).toFixed(2);
            var itemColor = item.color;
            var itemImage = item.image;


            var cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-items-list', 'cart-product-item');
            cartItemElement.innerHTML = `
                <div class="cart-product-img"><img src="${itemImage}" alt="product"></div>
                <div class="cart-table">
                    <div class="inline-detail">
                        <div class="cart-product-company">  ${itemColor ? `<div class="cart-product-color" style="box-shadow: 0 0 10px ${itemColor};">Color: ${itemColor}</div>` : ''}</div>
                        <button class="delete-cart-item-btn" data-cart-item-id="${itemId}">x</button>
                    </div>
                    <div class="cart-product-title">${itemName}</div>
                </div>
                <div class="cart-product-price">$${itemPrice}</div>
                <div class="quantity-container cart-product-qty">
                    <button class="quantity-btn cart-decrement-btn" data-cart-item-id="${itemId}">-</button>
                    <span class="quantity" id="cartCount_${itemId}">${itemQuantity}</span>
                    <button class="quantity-btn cart-increment-btn" data-cart-item-id="${itemId}">+</button>
                </div>
                <div class="cart-product-total cart-product-item-price">$${itemTotalPrice}</div>
            `;
            cartItemsList.appendChild(cartItemElement);

            totalPrice += parseFloat(itemTotalPrice);
        }

        totalPriceElement.textContent = 'Total Price: $' + totalPrice;
    }

    document.querySelectorAll('.addToCartBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            var itemId = button.getAttribute('data-menu-item');
            var itemName, itemPrice, itemColor, itemImage;


            // Check if the button is on the product detail page
            var productDetail = button.closest('.product-info');
            if (productDetail) {
                itemName = productDetail.querySelector('.product-title-detail').textContent.trim();
                itemPrice = parseFloat(productDetail.querySelector('.product-price-detail').textContent.trim().replace('$', ''));

                // Check if the product has available colors
                var availableColors = productDetail.querySelectorAll('.detail-color');
                if (availableColors.length > 0) {
                    var selectedColor = productDetail.querySelector('.detail-color.selected');
                    if (selectedColor) {
                        itemColor = selectedColor.style.backgroundColor;
                    } else {
                        alert('Please select a color for the product.')
                        return;
                    }
                }

                itemImage = document.querySelector('.detail-img-main img').getAttribute('src');

            } else {
                // Assume the button is on the all products page
                var productBox = button.closest('.product-box');
                itemName = productBox.querySelector('.sellers-box-title').getAttribute('data-menu-item-name');
                itemPrice = parseFloat(productBox.querySelector('.sellers-box-price').textContent.trim());
                itemImage = productBox.querySelector('.sellers-box-img').style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
            }

            // Add to cart if both item name and price are valid
            if (itemName && itemPrice) {
                addToCart(itemId, itemName, itemPrice, itemColor, itemImage);
                const popup = document.getElementById(`confirmation-popup-${itemId}`);
                popup.style.display = 'none';
            } else {
                console.error('Failed to add item to cart. Item name or price is missing.');
            }
        });
    });


    // Toggle selected class for color selection
    document.querySelectorAll('.detail-color').forEach(function (color) {
        color.addEventListener('click', function () {
            // Deselect other colors
            color.parentNode.querySelectorAll('.detail-color').forEach(function (otherColor) {
                otherColor.classList.remove('selected');
            });
            // Select the clicked color
            color.classList.add('selected');
        });
    });


    if (shopingCart) {
        shopingCart.addEventListener('click', function (event) {
            if (event.target.classList.contains('delete-cart-item-btn')) {
                var itemId = event.target.getAttribute('data-cart-item-id');
                removeFromCart(itemId);
            }
        });
    }

    if (cartQtyController) {
        cartQtyController.addEventListener('click', function (event) {
            var target = event.target;
            if (target.classList.contains('cart-decrement-btn') || target.classList.contains('cart-increment-btn')) {
                var itemId = target.getAttribute('data-cart-item-id');
                var cart = JSON.parse(localStorage.getItem('cart')) || {};
                var currentQuantity = cart[itemId].quantity;
                if (target.classList.contains('cart-decrement-btn')) {
                    if (currentQuantity > 1) {
                        updateCartItemQuantity(itemId, currentQuantity - 1);
                    } else {
                        removeFromCart(itemId); // Remove item if quantity becomes zero
                    }
                } else {
                    updateCartItemQuantity(itemId, currentQuantity + 1);
                }
            }
        });

    }

    // Telegram send button 
    if (checkOutForm) {
        checkOutForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission
            sendTelegramData(); // Call your function to send data to Telegram
        });
    }

    function sendTelegramData() {
        var contactName = document.getElementById('first_name').value;
        var contactSurname = document.getElementById('last_name').value;
        var contactNumber = document.getElementById('phone').value;
        var contactAddress = document.getElementById('address').value;
        var contactApartment = document.getElementById('apartment').value;
        var contactCity = document.getElementById('city').value;
        var contactPostalCode = document.getElementById('postal_code').value;

        var contactDetails = {
            name: contactName,
            surname: contactSurname,
            number: contactNumber,
            address: contactAddress,
            apartment: contactApartment,
            city: contactCity,
            postal: contactPostalCode
        };

        console.log(contactDetails);

        var csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            var cart = JSON.parse(localStorage.getItem('cart')) || {};
            console.log(cart);

            var itemsArray = [];

            for (var itemId in cart) {
                var item = cart[itemId];
                var itemName = item.name;
                var itemPrice = item.price;
                var itemQuantity = item.quantity;
                var itemTotalPrice = itemPrice * itemQuantity;
                var itemColor = item.color;
                var itemImage = item.image;

                itemsArray.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    quantity: itemQuantity,
                    color: itemColor,
                    image: itemImage
                });
            }

            // Send both contact details and cart data to the server
            fetch('/send-to-telegram/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    contact: contactDetails,
                    cart: itemsArray,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Your order is accepted! Our manager will contact you soon :)');
                    } else {
                        alert('The order has not been sent. Contact us by phone (+994)00-000-12-12');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your order :(');
                });
        } else {
            console.error('CSRF token not found.');
        }
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }


    // -------------------------------------------------------------



    if (showButton & hideButton) {
        showButton.addEventListener('click', function () {
            hiddenBlock.style.display = 'block';
            // body.classList.add('blur-background');
        });

        hideButton.addEventListener('click', function () {
            hiddenBlock.style.display = 'none';
            // body.classList.remove('blur-background');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

});








