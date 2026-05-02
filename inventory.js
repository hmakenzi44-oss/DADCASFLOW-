let html5QrCode;

// 1. Washa Scanner
function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 150 } };
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            document.getElementById('productName').value = decodedText;
            html5QrCode.stop();
            alert("Barcode Imesomwa!");
        }
    ).catch(err => alert("Kamera imekataa: " + err));
}

// 2. Hifadhi Bidhaa (Ikiwemo Picha)
async function saveProduct() {
    const name = document.getElementById('productName').value;
    const stock = document.getElementById('productStock').value;
    const price = document.getElementById('productPrice').value;
    const fileInput = document.getElementById('productImage');
    
    if (!name || !stock || !price) return alert("Jaza fomu yote!");

    let imageData = "";
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.onload = () => {
            imageData = reader.result;
            sendData({ name, stock, price, image: imageData });
        };
    } else {
        sendData({ name, stock, price, image: "" });
    }
}

// 3. Tuma data kwenye Backend (Node.js)
async function sendData(data) {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Bidhaa imehifadhiwa!");
            location.reload(); 
        }
    } catch (error) {
        document.getElementById('dbError').style.display = 'block';
    }
}

// 4. Pakia Bidhaa kwenye Jedwali (Fetch Data)
async function loadInventory() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        const container = document.getElementById('productContainer');
        
        container.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.image || 'assets/no-image.png'}" class="product-img-preview"></td>
                <td>${p.name}</td>
                <td>${p.stock}</td>
                <td>${p.price}</td>
                <td><button onclick="deleteProduct(${p.id})" style="background:red">Futa</button></td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('dbError').style.display = 'block';
    }
}

window.onload = loadInventory;
