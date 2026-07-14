/* ============================
   CAMPUSBITE - MAIN JS
   Shared across all pages
   ============================ */

// ---- MENU PAGE: Filter by category ----
function filterMenu(category, btn) {
    const cards = document.querySelectorAll('.menu-card');
    const buttons = document.querySelectorAll('.menu-filter .filter-btn');

    // Highlight the clicked button, un-highlight the rest
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide cards based on category
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ---- ADD TO CART: Basic click feedback (no real cart logic yet) ----
document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-cart-btn:not([disabled])');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.menu-card, .highlight-card');
            const itemName = card ? card.querySelector('h3').textContent : 'Item';

            const originalText = button.textContent;
            button.textContent = 'Added ✓';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1200);

            console.log(`${itemName} added to cart (temporary — no real cart yet)`);
        });
    });
});