// 1. Initial Setup & Translations
// Safety check: only call applyTranslations if it exists
if (typeof applyTranslations === 'function') {
    applyTranslations();
} else {
    console.warn("applyTranslations is not defined. Make sure translations.js is loaded.");
}

async function loadDashboardData() {
    try {
        // 2. Fetch Recent Sales
        const historyRes = await fetch('http://localhost:3000/api/sales/history');
        if (!historyRes.ok) throw new Error('Failed to fetch sales history');
        
        const sales = await historyRes.json();
        
        // Ensure sales is an array before rendering
        if (Array.isArray(sales)) {
            renderRecentSales(sales.slice(0, 5));
        }

        // 3. Fetch Products for Low Stock Alerts
        const productRes = await fetch('http://localhost:3000/api/products');
        if (!productRes.ok) throw new Error('Failed to fetch products');
        
        const products = await productRes.json();

        // Ensure products is an array before filtering
        if (Array.isArray(products)) {
            const lowStock = products.filter(p => (p.stock_quantity || 0) <= 5);
            const lowStockElement = document.getElementById('lowStockCount');
            
            if (lowStockElement) {
                lowStockElement.innerText = `${lowStock.length} Items`;
            }
        }

    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        // Optional: Show a message to the user on the UI
    }
}

function renderRecentSales(sales) {
    const tbody = document.querySelector('#recentSalesTable tbody');
    if (!tbody) return;

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No recent sales found</td></tr>';
        return;
    }

    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>#${sale.id || 'N/A'}</td>
            <td>ZMW ${sale.total_amount || '0.00'}</td>
            <td>${sale.payment_method || 'Cash'}</td>
            <td>${sale.timestamp ? new Date(sale.timestamp).toLocaleDateString() : 'N/A'}</td>
        </tr>
    `).join('');
}

// Start the dashboard
loadDashboardData();
