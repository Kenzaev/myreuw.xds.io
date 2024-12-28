document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');

    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productPrice = document.getElementById('product-price').value;
        const productImage = document.getElementById('product-image').value;
        const productVideo = document.getElementById('product-video').value;

        const newProduct = {
            name: productName,
            price: productPrice,
            image: productImage,
            video: productVideo
        };

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            alert('Товар добавлен успешно!');
            productForm.reset();
        } else {
            alert('Ошибка при добавлении товара');
        }
    });
});
