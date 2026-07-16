/* ============================
   CAMPUSBITE - MAIN JS
   Shared across all pages
   ============================ */

// ---- REGISTER PAGE: form submit ----
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorBox = document.getElementById('register-error');
        errorBox.style.display = 'none';

        const formData = new FormData(registerForm);
        const body = new URLSearchParams(formData).toString();

        fetch('php/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'login.html?registered=1';
            } else {
                errorBox.textContent = data.error;
                errorBox.style.display = 'block';
            }
        })
        .catch(() => {
            errorBox.textContent = 'Something went wrong. Please try again.';
            errorBox.style.display = 'block';
        });
    });
});

// ---- LOGIN PAGE: form submit + registered message ----
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    // Show "Registration Successful" if redirected here with ?registered=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
        document.getElementById('registered-msg').style.display = 'block';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorBox = document.getElementById('login-error');
        errorBox.style.display = 'none';

        const formData = new FormData(loginForm);
        const body = new URLSearchParams(formData).toString();

        fetch('php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = (data.role === 'admin') ? 'admin.html' : 'index.html';
            } else {
                errorBox.textContent = data.error;
                errorBox.style.display = 'block';
            }
        })
        .catch(() => {
            errorBox.textContent = 'Something went wrong. Please try again.';
            errorBox.style.display = 'block';
        });
    });
});

// ---- MENU PAGE: Filter by category ----
function filterMenu(category, btn) {
    const cards = document.querySelectorAll('.menu-card');
    const buttons = document.querySelectorAll('.menu-filter .filter-btn');

    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ---- ADD TO CART: Real backend call ----
document.addEventListener('click', (e) => {
    const button = e.target.closest('.add-cart-btn');
    if (!button || button.disabled) return;

    const itemId = button.dataset.id;
    if (!itemId) return;

    fetch('PHP/cart_add.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'item_id=' + itemId
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const originalText = button.textContent;
            button.textContent = 'Added ✓';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1200);
        } else {
            alert(data.message || 'Could not add item.');
        }
    });
});

// ---- CART PAGE: quantity + remove buttons ----
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.qty-btn, .remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.id;
            let action = 'remove';
            if (btn.classList.contains('plus')) action = 'increase';
            if (btn.classList.contains('minus')) action = 'decrease';

            // Updated path: removed php/ prefix
            fetch('cart_update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'item_id=' + itemId + '&action=' + action
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) location.reload();
            });
        });
    });
});

// ---- ADMIN ORDERS: status update ----
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.status-select[data-order-id]').forEach(select => {
        select.addEventListener('change', () => {
            const orderId = select.dataset.orderId;
            const status = select.value;

            // Updated path: removed admin/ prefix
            fetch('update_order_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status })
            })
            .then(res => res.json())
            .then(data => {
                if (!data.success) alert(data.error || 'Failed to update status.');
                else {
                    const row = select.closest('tr');
                    const badge = row.querySelector('.status-badge');
                    badge.textContent = status;
                    badge.className = 'status-badge ' + status.toLowerCase();
                }
            });
        });
    });
});

// ---- ADMIN ORDERS: filter tabs ----
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.order-filter .filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.textContent.trim();
            document.querySelectorAll('#orders-tbody tr').forEach(row => {
                row.style.display = (filter === 'All' || row.dataset.status === filter) ? '' : 'none';
            });
        });
    });
});

// ---- ADMIN ITEMS: modal CRUD ----
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('item-modal');
    if (!modal) return;

    const form = document.getElementById('item-form');
    const title = document.getElementById('item-modal-title');
    const addBtn = document.getElementById('add-item-btn');
    const cancelBtn = document.getElementById('item-cancel-btn');

    function openModal(mode, data = {}) {
        form.reset();
        document.getElementById('item-id').value = data.id || '';
        document.getElementById('item-name').value = data.name || '';
        document.getElementById('item-description').value = data.description || '';
        document.getElementById('item-price').value = data.price || '';
        document.getElementById('item-image').value = data.image || '';
        document.getElementById('item-available').checked = data.available === undefined ? true : data.available === '1';
        if (data.category) document.getElementById('item-category').value = data.category;

        title.textContent = mode === 'edit' ? 'Edit Item' : 'Add New Item';
        modal.style.display = 'flex';
    }

    function closeModal() { modal.style.display = 'none'; }

    addBtn.addEventListener('click', () => openModal('add'));
    cancelBtn.addEventListener('click', closeModal);

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('edit', {
                id: btn.dataset.id,
                name: btn.dataset.name,
                description: btn.dataset.description,
                price: btn.dataset.price,
                category: btn.dataset.category,
                available: btn.dataset.available,
                image: btn.dataset.image
            });
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!confirm('Delete this item?')) return;
            
            // Updated path: removed admin/ prefix
            fetch('item_actions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: btn.dataset.id })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) location.reload();
                else alert(data.error || 'Delete failed.');
            });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            action: 'save',
            id: document.getElementById('item-id').value,
            name: document.getElementById('item-name').value.trim(),
            description: document.getElementById('item-description').value.trim(),
            price: document.getElementById('item-price').value,
            category_id: document.getElementById('item-category').value,
            image: document.getElementById('item-image').value.trim(),
            is_available: document.getElementById('item-available').checked
        };

        // Updated path: removed admin/ prefix
        fetch('item_actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) location.reload();
            else alert(data.error || 'Save failed.');
        });
    });
});

// ---- ADMIN CATEGORIES: modal CRUD ----
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('category-modal');
    if (!modal) return;

    const form = document.getElementById('category-form');
    const title = document.getElementById('category-modal-title');
    const addBtn = document.getElementById('add-category-btn');
    const cancelBtn = document.getElementById('category-cancel-btn');

    function openModal(mode, data = {}) {
        form.reset();
        document.getElementById('category-id').value = data.id || '';
        document.getElementById('category-name').value = data.name || '';
        title.textContent = mode === 'edit' ? 'Edit Category' : 'Add New Category';
        modal.style.display = 'flex';
    }

    function closeModal() { modal.style.display = 'none'; }

    addBtn.addEventListener('click', () => openModal('add'));
    cancelBtn.addEventListener('click', closeModal);

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('edit', { id: btn.dataset.id, name: btn.dataset.name });
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (parseInt(btn.dataset.count) > 0) {
                alert('This category still has menu items. Reassign or delete them first.');
                return;
            }
            if (!confirm('Delete this category?')) return;

            // Updated path: removed admin/ prefix
            fetch('category_actions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: btn.dataset.id })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) location.reload();
                else alert(data.error || 'Delete failed.');
            });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Updated path: removed admin/ prefix
        fetch('category_actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                id: document.getElementById('category-id').value,
                name: document.getElementById('category-name').value.trim()
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) location.reload();
            else alert(data.error || 'Save failed.');
        });
    });
});

// ---- MENU PAGE: load items from menu_data.php ----
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    fetch('PHP/menu_data.php')
        .then(res => res.json())
        .then(items => {
            grid.innerHTML = '';

            const grouped = {};
            items.forEach(item => {
                if (!grouped[item.category_name]) grouped[item.category_name] = [];
                grouped[item.category_name].push(item);
            });

            Object.keys(grouped).forEach(categoryName => {
                const section = document.createElement('div');
                section.className = 'menu-category-section';
                section.innerHTML = `<h2 class="menu-category-title">${categoryName}</h2>`;

                const sectionGrid = document.createElement('div');
                sectionGrid.className = 'menu-grid';

                grouped[categoryName].forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'menu-card';
                    card.innerHTML = `
                        <img src="images/${item.image}" alt="${item.name}">
                        <div class="menu-card-info">
                            <h3>${item.name}</h3>
                            <p class="menu-desc">${item.description}</p>
                            <div class="menu-card-footer">
                                <span class="menu-price">৳${parseInt(item.price)}</span>
                                <span class="menu-status ${item.is_available == 1 ? 'available' : 'sold-out'}">
                                    ${item.is_available == 1 ? 'Available' : 'Sold Out'}
                                </span>
                            </div>
                            <button class="add-cart-btn" data-id="${item.id}" ${item.is_available == 1 ? '' : 'disabled'}>
                                ${item.is_available == 1 ? 'Add to Cart' : 'Sold Out'}
                            </button>
                        </div>
                    `;
                    sectionGrid.appendChild(card);
                });

                section.appendChild(sectionGrid);
                grid.appendChild(section);
            });
        })
        .catch(() => {
            grid.innerHTML = '<p>Could not load menu. Please try again later.</p>';
        });
});

// ---- CART PAGE: load items from cart_data_json.php ----
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsBox = document.getElementById('cart-items');
    if (!cartItemsBox) return;

    fetch('PHP/cart_data_json.php')
        .then(res => res.json())
        .then(data => {
            const items = data.items;
            const ids = Object.keys(items);

            if (ids.length === 0) {
                cartItemsBox.innerHTML = '<p>Your cart is empty. <a href="menu.html">Go add something tasty.</a></p>';
                return;
            }

            cartItemsBox.innerHTML = '';
            ids.forEach(id => {
                const item = items[id];
                const row = document.createElement('div');
                row.className = 'cart-item';
                row.dataset.id = id;
                row.innerHTML = `
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">৳${parseInt(item.price)}</p>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-id="${id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${id}">+</button>
                    </div>
                    <div class="cart-item-subtotal">৳${parseInt(item.price) * item.quantity}</div>
                    <button class="remove-btn" data-id="${id}" title="Remove item">✕</button>
                `;
                cartItemsBox.appendChild(row);
            });

            document.getElementById('cart-subtotal').textContent = '৳' + parseInt(data.subtotal);
            document.getElementById('cart-service').textContent = '৳' + parseInt(data.service_charge);
            document.getElementById('cart-total').textContent = '৳' + parseInt(data.total);
            document.getElementById('cart-summary').style.display = 'block';

            // Hook up qty/remove buttons now that they exist
            document.querySelectorAll('.qty-btn, .remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const itemId = btn.dataset.id;
                    let action = 'remove';
                    if (btn.classList.contains('plus')) action = 'increase';
                    if (btn.classList.contains('minus')) action = 'decrease';

                    fetch('PHP/cart_update.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'item_id=' + itemId + '&action=' + action
                    })
                    .then(res => res.json())
                    .then(d => { if (d.success) location.reload(); });
                });
            });
        })
        .catch(() => {
            cartItemsBox.innerHTML = '<p>Could not load cart.</p>';
        });
});

// ---- CHECKOUT PAGE: load summary + submit order ----
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    fetch('PHP/checkout_data_json.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'login.html';
                return;
            }
            if (Object.keys(data.items).length === 0) {
                window.location.href = 'cart.html';
                return;
            }

            const itemsBox = document.getElementById('checkout-items');
            itemsBox.innerHTML = '';
            Object.values(data.items).forEach(item => {
                const row = document.createElement('div');
                row.className = 'checkout-item';
                row.innerHTML = `<span>${item.name} x${item.quantity}</span><span>৳${item.price * item.quantity}</span>`;
                itemsBox.appendChild(row);
            });

            document.getElementById('checkout-subtotal').textContent = '৳' + parseInt(data.subtotal);
            document.getElementById('checkout-service').textContent = '৳' + parseInt(data.service_charge);
            document.getElementById('checkout-total').textContent = '৳' + parseInt(data.total);
        });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const body = new URLSearchParams(formData).toString();

        fetch('PHP/place_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'orders.html';
            } else {
                alert(data.error || 'Could not place order.');
            }
        });
    });
});

// ---- ORDERS PAGE: load from orders_data_json.php ----
document.addEventListener('DOMContentLoaded', () => {
    const ordersPage = document.getElementById('orders-page');
    if (!ordersPage) return;

    fetch('PHP/orders_data_json.php')
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'login.html';
                return;
            }

            if (data.orders.length === 0) {
                ordersPage.innerHTML = '<div class="section-container"><p>You haven\'t placed any orders yet. <a href="menu.html">Browse the menu.</a></p></div>';
                return;
            }

            const container = document.createElement('div');
            container.className = 'section-container';

            data.orders.forEach(order => {
                const itemLines = order.items.map(i => `${i.item_name} x${i.quantity}`).join(', ');
                const orderNum = String(order.id).padStart(4, '0');
                const date = new Date(order.created_at).toLocaleString();

                const card = document.createElement('div');
                card.className = 'order-card';
                card.innerHTML = `
                    <div class="order-card-header">
                        <div>
                            <h3>Order #CB${orderNum}</h3>
                            <p class="order-date">${date}</p>
                        </div>
                        <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="order-items"><p>${itemLines}</p></div>
                    <div class="order-card-footer">
                        <span class="order-total">Total: ৳${parseInt(order.total)}</span>
                    </div>
                `;
                container.appendChild(card);
            });

            ordersPage.innerHTML = '';
            ordersPage.appendChild(container);
        });
});

// ---- ADMIN DASHBOARD: load stats ----
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('admin-content');
    if (!content || !document.querySelector('.admin-logo')) return;
    if (!window.location.pathname.endsWith('admin.html')) return;

    fetch('PHP/admin_dashboard_data.php')
        .then(res => res.json())
        .then(data => {
            if (data.success === false) {
                window.location.href = 'login.html';
                return;
            }

            let rows = '';
            data.recent_orders.forEach(order => {
                const orderNum = String(order.id).padStart(4, '0');
                rows += `
                    <tr>
                        <td>#CB${orderNum}</td>
                        <td>${order.student_name}</td>
                        <td>${order.items_summary}</td>
                        <td>৳${parseInt(order.total)}</td>
                        <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                    </tr>
                `;
            });

            content.innerHTML = `
                <div class="stat-grid">
                    <div class="stat-card"><p class="stat-label">Today's Orders</p><p class="stat-value">${data.today_orders}</p></div>
                    <div class="stat-card"><p class="stat-label">Pending Orders</p><p class="stat-value">${data.pending_orders}</p></div>
                    <div class="stat-card"><p class="stat-label">Menu Items</p><p class="stat-value">${data.menu_items_count}</p></div>
                    <div class="stat-card"><p class="stat-label">Sold Out Items</p><p class="stat-value">${data.sold_out_count}</p></div>
                </div>
                <div class="admin-panel">
                    <h2>Recent Orders</h2>
                    <table class="admin-table">
                        <thead><tr><th>Order ID</th><th>Student</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        });
});

// ---- ADMIN LOGOUT ----
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('admin-logout');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('PHP/logout.php').finally(() => window.location.href = 'login.html');
    });
});


// ---- ADMIN CATEGORIES: load + CRUD ----
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('categories-tbody');
    if (!tbody) return;

    function loadCategories() {
        fetch('PHP/admin_categories_data.php')
            .then(res => res.json())
            .then(cats => {
                if (cats.success === false) { window.location.href = 'login.html'; return; }
                tbody.innerHTML = '';
                cats.forEach(cat => {
                    const row = document.createElement('tr');
                    row.dataset.id = cat.id;
                    row.innerHTML = `
                        <td>${cat.name}</td>
                        <td>${cat.item_count}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${cat.id}" data-name="${cat.name}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${cat.id}" data-count="${cat.item_count}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                attachCategoryButtons();
            });
    }

    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('category-modal-title');

    function openModal(mode, data = {}) {
        form.reset();
        document.getElementById('category-id').value = data.id || '';
        document.getElementById('category-name').value = data.name || '';
        title.textContent = mode === 'edit' ? 'Edit Category' : 'Add New Category';
        modal.style.display = 'flex';
    }
    function closeModal() { modal.style.display = 'none'; }

    document.getElementById('add-category-btn').addEventListener('click', () => openModal('add'));
    document.getElementById('category-cancel-btn').addEventListener('click', closeModal);

    function attachCategoryButtons() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal('edit', { id: btn.dataset.id, name: btn.dataset.name }));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (parseInt(btn.dataset.count) > 0) {
                    alert('This category still has menu items. Reassign or delete them first.');
                    return;
                }
                if (!confirm('Delete this category?')) return;
                fetch('PHP/category_actions.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete', id: btn.dataset.id })
                })
                .then(res => res.json())
                .then(data => { if (data.success) loadCategories(); else alert(data.error || 'Delete failed.'); });
            });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        fetch('PHP/category_actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                id: document.getElementById('category-id').value,
                name: document.getElementById('category-name').value.trim()
            })
        })
        .then(res => res.json())
        .then(data => { if (data.success) { closeModal(); loadCategories(); } else alert(data.error || 'Save failed.'); });
    });

    loadCategories();
});

// ---- ADMIN ITEMS: load + CRUD ----
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('items-tbody');
    if (!tbody) return;

    const categorySelect = document.getElementById('item-category');

    function loadItems() {
        fetch('PHP/admin_items_data.php')
            .then(res => res.json())
            .then(data => {
                if (data.success === false) { window.location.href = 'login.html'; return; }

                categorySelect.innerHTML = '';
                data.categories.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    categorySelect.appendChild(opt);
                });

                tbody.innerHTML = '';
                data.items.forEach(item => {
                    const row = document.createElement('tr');
                    row.dataset.id = item.id;
                    row.innerHTML = `
                        <td><img src="images/${item.image || 'placeholder-food.jpg'}" class="item-thumb"></td>
                        <td>${item.name}</td>
                        <td>${item.category_name}</td>
                        <td>৳${parseInt(item.price)}</td>
                        <td><span class="status-badge ${item.is_available == 1 ? 'completed' : 'pending'}">${item.is_available == 1 ? 'Available' : 'Sold Out'}</span></td>
                        <td>
                            <button class="action-btn edit-btn"
                                data-id="${item.id}" data-name="${item.name}"
                                data-description="${item.description || ''}" data-price="${item.price}"
                                data-category="${item.category_id}" data-available="${item.is_available}"
                                data-image="${item.image || ''}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                attachItemButtons();
            });
    }

    const modal = document.getElementById('item-modal');
    const form = document.getElementById('item-form');
    const title = document.getElementById('item-modal-title');

    function openModal(mode, data = {}) {
        form.reset();
        document.getElementById('item-id').value = data.id || '';
        document.getElementById('item-name').value = data.name || '';
        document.getElementById('item-description').value = data.description || '';
        document.getElementById('item-price').value = data.price || '';
        document.getElementById('item-image').value = data.image || '';
        document.getElementById('item-available').checked = data.available === undefined ? true : data.available == '1';
        if (data.category) categorySelect.value = data.category;
        title.textContent = mode === 'edit' ? 'Edit Item' : 'Add New Item';
        modal.style.display = 'flex';
    }
    function closeModal() { modal.style.display = 'none'; }

    document.getElementById('add-item-btn').addEventListener('click', () => openModal('add'));
    document.getElementById('item-cancel-btn').addEventListener('click', closeModal);

    function attachItemButtons() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal('edit', {
                id: btn.dataset.id, name: btn.dataset.name, description: btn.dataset.description,
                price: btn.dataset.price, category: btn.dataset.category,
                available: btn.dataset.available, image: btn.dataset.image
            }));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!confirm('Delete this item?')) return;
                fetch('PHP/item_actions.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete', id: btn.dataset.id })
                })
                .then(res => res.json())
                .then(data => { if (data.success) loadItems(); else alert(data.error || 'Delete failed.'); });
            });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            action: 'save',
            id: document.getElementById('item-id').value,
            name: document.getElementById('item-name').value.trim(),
            description: document.getElementById('item-description').value.trim(),
            price: document.getElementById('item-price').value,
            category_id: categorySelect.value,
            image: document.getElementById('item-image').value.trim(),
            is_available: document.getElementById('item-available').checked
        };
        fetch('PHP/item_actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => { if (data.success) { closeModal(); loadItems(); } else alert(data.error || 'Save failed.'); });
    });

    loadItems();
});



// ---- ADMIN ORDERS: load + status update + filter ----
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    function loadOrders() {
        fetch('PHP/admin_orders_data.php')
            .then(res => res.json())
            .then(orders => {
                if (orders.success === false) { window.location.href = 'login.html'; return; }

                tbody.innerHTML = '';
                orders.forEach(order => {
                    const orderNum = String(order.id).padStart(4, '0');
                    const status = order.status;
                    const row = document.createElement('tr');
                    row.dataset.status = status;
                    row.innerHTML = `
                        <td>#CB${orderNum}</td>
                        <td>${order.student_name}</td>
                        <td>${order.items_summary}</td>
                        <td>৳${parseInt(order.total)}</td>
                        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
                        <td>
                            <select class="status-select" data-order-id="${order.id}">
                                <option ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option ${status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                                <option ${status === 'Ready' ? 'selected' : ''}>Ready</option>
                                <option ${status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                attachStatusSelects();
            });
    }

    function attachStatusSelects() {
        document.querySelectorAll('.status-select[data-order-id]').forEach(select => {
            select.addEventListener('change', () => {
                const orderId = select.dataset.orderId;
                const status = select.value;
                fetch('PHP/update_order_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId, status })
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) { alert(data.error || 'Failed to update status.'); return; }
                    const row = select.closest('tr');
                    row.dataset.status = status;
                    const badge = row.querySelector('.status-badge');
                    badge.textContent = status;
                    badge.className = 'status-badge ' + status.toLowerCase();
                });
            });
        });
    }

    document.querySelectorAll('.order-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.textContent.trim();
            document.querySelectorAll('#orders-tbody tr').forEach(row => {
                row.style.display = (filter === 'All' || row.dataset.status === filter) ? '' : 'none';
            });
        });
    });

    loadOrders();
});


// ---- NAVBAR: show login/logout state ----
document.addEventListener('DOMContentLoaded', () => {
    const authBox = document.getElementById('navbar-auth');
    if (!authBox) return;

    fetch('PHP/session_check.php')
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                authBox.innerHTML = `
                    <span style="margin-right:16px; font-weight:600;">Hi, ${data.name}</span>
                    <a href="#" id="navbar-logout" class="navbar-btn">Log Out</a>
                `;
                document.getElementById('navbar-logout').addEventListener('click', (e) => {
                    e.preventDefault();
                    fetch('PHP/logout.php').finally(() => window.location.href = 'index.html');
                });
            } else {
                authBox.innerHTML = `<a href="login.html" class="navbar-btn">Login</a>`;
            }
        });
});