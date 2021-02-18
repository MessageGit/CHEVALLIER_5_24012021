var max_products = 0;
var option_selected = 1;
var cart_price = 0;

function Init_products_data() { // Init. list of products (index.php)
    fetch('http://localhost:3001/api/cameras/')
        .then(response => response.json())
        .catch((error) => {
            document.getElementsByClassName('catalog-content')[0].style.height = "400px";
            document.getElementById('db-error').style.display = "block";
        })
        .then(function(api_data) { let i = 0; max_products = api_data.length;
            while(i < api_data.length) {
                var product_x = document.createElement("a");
                var img_x = document.createElement("img");
                var price_x = document.createElement("div");
                var price_int = api_data[i]['price']/100;
                var txt_x = document.createElement("div");
                var buy_x = document.createElement("div");
                // Create item of new product
                product_x.classList.add("product-item");
                product_x.href = "product.html?id=" + api_data[i]['_id']; // Update link for view this product
                document.querySelector('.product-list').appendChild(product_x);
                product_x.style.animationDelay = "0." + i*2 + "s"; // Animation stylé ;)
                // Create and attach img of new product
                img_x.classList.add("product-img");
                img_x.src = api_data[i]['imageUrl']; // Update link of img
                product_x.appendChild(img_x);
                // Create and attach price of new product
                price_x.classList.add("product-price");
                price_x.innerHTML = price_int + ".00€";
                product_x.appendChild(price_x);
                // Create, define and attach description of new product
                txt_x.classList.add("product-desc");
                txt_x.innerHTML = "<b>" + api_data[i]['name'] + "</b><br />" + api_data[i]['description'];
                product_x.appendChild(txt_x);
                // Create and attach 'Add to cart' button
                buy_x.classList.add("product-buybtn");
                buy_x.innerHTML = "Ajouter au panier";
                product_x.appendChild(buy_x);
                i++;
            }
        });
}

function getProductOfViewPage() { return window.location.search.substr(4); }
function viewProductId() { // Init. data of product viewer (product.html)
    fetch('http://localhost:3001/api/cameras/' + getProductOfViewPage())
        .then(function(response) { return response.json(); })
        .catch((error) => { // Echec de la méthode fetch
            alert('Un problème est survenu lors de la récupération des données..');
        })
        .then(function(api_data) {
            if(!api_data['_id']) { // L'ID ne correspond à aucune caméra
                alert('Un problème est survenu lors de la récupération des données..');
            } else { // L'ID renseigné dans l'URL correspond à une caméra
                document.getElementById('view-name').innerHTML = api_data['name'];
                document.getElementById('view-img').src = api_data['imageUrl'];
                document.getElementById('view-img').style.opacity = 1;
                document.getElementById('view-img').style.transform = "scale(1.0)";
                document.getElementById('view-desc').innerHTML = api_data['description'];
                document.getElementById('item-price').innerHTML = api_data['price']/100 + ".00€";
                // Gestion des options
                let i = 0;
                while(i < api_data['lenses'].length) { i ++;
                    document.getElementById('item-option-' + i).innerHTML = api_data['lenses'][i-1];
                    document.getElementsByClassName('item-option')[i-1].style.display = "block";
                }
            }
        });
}

function productOption(option_id) { // Select option of product
    // Old selected option
    document.getElementById('item-checked-' + option_selected).style.display = "none";
    document.getElementsByClassName('item-option')[option_selected-1].style.backgroundColor = "#c5c5c5"; 
    // New selected option
    document.getElementById('item-checked-' + option_id).style.display = "block";
    document.getElementsByClassName('item-option')[option_id-1].style.backgroundColor = "#333"; 
    option_selected = option_id;
}

function addToCart() { // Add product to cart
    if(!localStorage.getItem('cart')) { // Cart is empty
        var cart_data = {products: [getProductOfViewPage()]}; // Insert product in variable (JS Object)
        var option_data = {options: [option_selected-1]}; // Insert option id for this product
    } else { // Items exists in cart
        var cart_data = JSON.parse(localStorage.getItem('cart')); // Get cart products in 'cart' item (localStorage)
        cart_data.products.push(getProductOfViewPage()); // Add this new product in my JSON object
        var option_data = JSON.parse(localStorage.getItem('option')); // Get options (id) in array for all products saveds
        option_data.options.push(option_selected-1); // Add new option (id) for this new product
    }
    // Convert to string format and save in localStorage
    localStorage.setItem('cart', JSON.stringify(cart_data));
    localStorage.setItem('option', JSON.stringify(option_data));
    // Visual effect for client
    document.getElementById('manage-item').style.opacity = "0";
    setTimeout(function() { document.getElementById('manage-item').style.display = "none"; }, 1050);
    setTimeout(function() {
        document.getElementById('success-item').style.display = "block";
        setTimeout(function() { document.getElementById('success-item').style.opacity = "1"; }, 50);
    }, 250);
}

function viewMyCart() { // Visualize my cart (items refresh)
    var cart_data = JSON.parse(localStorage.getItem('cart'));
    var option_data = JSON.parse(localStorage.getItem('option'));
    document.getElementsByClassName('my-cart')[0].style.display = "block"; // Show main content
    setTimeout(function() { document.getElementsByClassName('my-cart')[0].style.opacity = "1"; }, 250);
    if(cart_data) {
        let i = 0;
        while(i < cart_data.products.length) {
            var option_id = option_data.options[i]; // Get option for this product
            displayCartProduct(cart_data.products[i], option_id); // Show product in my cart
            i ++;
        }
        // Display count of my products
        document.getElementById('cart-info').innerHTML = i + " article(s) dans votre panier";
        // Show content
        document.getElementsByClassName('cart-section')[0].style.display = "block";
        document.getElementsByClassName('cart-section')[1].style.display = "block";
        // Final price
        setTimeout(function() { document.getElementById('total-count').innerHTML = cart_price + ",00€"; }, 250);
    } else {
        // Show content
        document.getElementById('empty-cart').style.display = "block";
    }
}

function displayCartProduct(product_id, option_id) {
    fetch('http://localhost:3001/api/cameras/' + product_id)
        .then(function(response) { return response.json(); })
        .catch((error) => { // Echec de la méthode fetch
            alert('Un problème est survenu lors de la récupération des données..');
        })
        .then(function(api_data) {
            var product_x = document.createElement("div");
            var img_x = document.createElement("img");
            var price_x = document.createElement("div");
            var price_int = api_data['price']/100;
            cart_price += price_int;
            var txt_x = document.createElement("div");
            var option_x = document.createElement("div");
            var name_x = document.createElement("div");
            var point_x = document.createElement("div");
            // Create item of product
            product_x.classList.add("cart-x-item");
            document.querySelector('.cart-details').appendChild(product_x);
            // Create and attach img of product
            img_x.src = api_data['imageUrl']; // Update link of img
            product_x.appendChild(img_x);
            // Create and attach price of product
            price_x.classList.add("cart-x-price");
            price_x.innerHTML = price_int + ".00€";
            product_x.appendChild(price_x);
            // Create, define and attach description of product
            txt_x.classList.add("cart-x-desc");
            txt_x.innerHTML = api_data['description'];
            product_x.appendChild(txt_x);
            // Create, define and attach specific option of product
            option_x.classList.add("cart-x-option");
            option_x.innerHTML = "<b>Option:</b> " + api_data['lenses'][option_id];
            product_x.appendChild(option_x);
            // Create, define and attach name of product
            name_x.classList.add("cart-x-name");
            name_x.innerHTML = api_data['name'];
            product_x.appendChild(name_x);
            // Attach visual element
            point_x.classList.add("cart-x-point");
            product_x.appendChild(point_x);
        });
}

// Delete my cart and refresh
function clearCart() {
    localStorage.clear();
    window.location.reload();
}

// Shortcut (Press ENTER and send form)
document.onkeypress = function(event) { 
    if(event.keyCode == 13 && document.getElementsByClassName('cart-content')[0] != null) { validCommand(); } 
}

// Send form and valid command
function validCommand() {
    const first_name = document.getElementById('firstName-input').value;
    const last_name = document.getElementById('lastName-input').value;
    const address = document.getElementById('address-input').value;
    const city = document.getElementById('city-input').value;
    const email = document.getElementById('email-input').value;
    if(first_name.length != 0 && last_name.length != 0 && address.length != 0 && city.length != 0 && email.length != 0) {
        if(/^[a-zA-ZÀ-ÿ]+(?:[\s-][a-zA-Z]+)*$/.test(first_name) && /^[a-zA-ZÀ-ÿ]+(?:[\s-][a-zA-Z]+)*$/.test(last_name)) {
            if(/^[a-zA-ZÀ-ÿ]+(?:[\s-][a-zA-Z]+)*$/.test(city)) {
                if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {

                    var cart_data = JSON.parse(localStorage.getItem('cart'));
                    const data = {
                        contact: {"firstName": first_name, "lastName": last_name, "address": address, "city": city, "email": email},
                        products: cart_data.products
                    };

                    fetch('http://localhost:3001/api/cameras/order', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    .catch((error) => { // Echec de la méthode fetch
                        alert('Un problème est survenu lors de la récupération des données..');
                    })
                    .then(response => response.json())
                    .then(function(api_response) {
                        let i = 0; var new_total = 0;
                        while(i < api_response.products.length) {
                            new_total += api_response.products[i].price/100;
                            i ++;
                        }
                        window.location.href = "thanks.html?order_id=" + api_response.orderId + "&amount=" + new_total;
                    });

                } else { alert('L\'adresse mail semble incorrect.'); }
            } else { alert('La ville saisie semble introuvable.'); }
        } else { alert('Votre nom et prénom doivent être au bon format.'); }
    } else { alert('Tous les champs du formulaire doivent être renseignés.'); }
}

function getOrderInfos() {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const url = new URLSearchParams(window.location.search);
    const order_id = url.get("order_id");
    const total_price = url.get("amount");
    document.getElementById('thanks-infos').innerHTML = "Référence de votre commande <b>n°" + order_id + "</b>.<br />Date & heure de votre commande: <b>" + date + " (" + time + ")</b>.<br />Montant total de votre commande: <b>" + total_price + ".00€</b>.";
}