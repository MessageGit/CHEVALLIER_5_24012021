var max_products = 0;

function Init_products_data() { // Init. list of products (index.php)

    fetch('http://localhost:3001/api/cameras/')
        .then(function(response) { return response.json(); })
        .then(function(api_data) { let i = 0; max_products = api_data.length;
            while(i < api_data.length) {

                var product_x = document.createElement("div");
                var img_x = document.createElement("img");
                var price_x = document.createElement("div");
                var txt_x = document.createElement("div");
                var buy_x = document.createElement("div");

                // Create item of new product
                product_x.classList.add("product-item");
                document.querySelector('.product-list').appendChild(product_x);

                // Create and attach img of new product
                img_x.classList.add("product-img");
                img_x.src = api_data[i]['imageUrl']; // Update link of img
                product_x.appendChild(img_x);

                // Create and attach price of new product
                price_x.classList.add("product-price");
                price_x.innerHTML = api_data[i]['price'];
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
            // Update all products prices formats
            setTimeout(function() { updateProductPrice(); }, 50);
        });
}

function updateProductPrice() {
    let i = 0;
    while(i < max_products) {
        var final_price = "0€";
        var init_price = document.getElementsByClassName('product-price')[i].innerHTML;
        final_price = init_price.substr(0, init_price.length-2);
        document.getElementsByClassName('product-price')[i].innerHTML = final_price + ",00€";
        i++;
    }
}