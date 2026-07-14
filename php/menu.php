<?php
require __DIR__ . '/db.php';

$sql = "SELECT menu_items.*, categories.name AS category_name 
        FROM menu_items 
        JOIN categories ON menu_items.category_id = categories.id 
        ORDER BY menu_items.id ASC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu | CampusBite</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/menu.css">
</head>
<body>

    <!-- NAVBAR -->
    <header class="navbar">
        <div class="navbar-container">
            <a href="index.html" class="navbar-logo">CampusBite</a>
            <nav class="navbar-links">
                <a href="index.html">Home</a>
                <a href="menu.php">Menu</a>
                <a href="cart.html">Cart</a>
                <a href="orders.html">My Orders</a>
            </nav>
            <a href="login.php" class="navbar-btn">Login</a>
        </div>
    </header>

    <!-- PAGE HEADER -->
    <section class="page-header">
        <div class="section-container">
            <h1 class="page-title">Today's Menu</h1>
            <p class="page-subtitle">Fresh items updated daily — check availability before you order</p>
        </div>
    </section>

    <!-- MENU FILTER + GRID -->
    <section class="menu-page">
        <div class="section-container">

            <div class="menu-filter">
                <button class="filter-btn active" onclick="filterMenu('all', this)">All</button>
                <button class="filter-btn" onclick="filterMenu('rice', this)">Rice Items</button>
                <button class="filter-btn" onclick="filterMenu('snacks', this)">Snacks</button>
                <button class="filter-btn" onclick="filterMenu('drinks', this)">Drinks</button>
                <button class="filter-btn" onclick="filterMenu('desserts', this)">Desserts</button>
            </div>

            <div class="menu-grid" id="menu-grid">

                <?php while ($item = $result->fetch_assoc()): ?>
                    <?php
                        // Turn category name into a simple lowercase slug for filtering
                        // e.g. "Rice Items" -> "rice", "Snacks" -> "snacks"
                        $categorySlug = strtolower(explode(' ', $item['category_name'])[0]);
                    ?>
                    <div class="menu-card" data-category="<?php echo $categorySlug; ?>">
                        <img src="images/<?php echo htmlspecialchars($item['image']); ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                        <div class="menu-card-info">
                            <h3><?php echo htmlspecialchars($item['name']); ?></h3>
                            <p class="menu-desc"><?php echo htmlspecialchars($item['description']); ?></p>
                            <div class="menu-card-footer">
                                <span class="menu-price">৳<?php echo number_format($item['price'], 0); ?></span>
                                <?php if ($item['is_available']): ?>
                                    <span class="menu-status available">Available</span>
                                <?php else: ?>
                                    <span class="menu-status sold-out">Sold Out</span>
                                <?php endif; ?>
                            </div>
                            <?php if ($item['is_available']): ?>
                                <button class="add-cart-btn">Add to Cart</button>
                            <?php else: ?>
                                <button class="add-cart-btn" disabled>Sold Out</button>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endwhile; ?>

            </div>

        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-brand">
                <h3 class="footer-logo">CampusBite</h3>
                <p class="footer-tagline">Canteen ordering made simple for SMUCT students.</p>
            </div>
            <div class="footer-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="menu.php">Menu</a></li>
                    <li><a href="cart.html">Cart</a></li>
                    <li><a href="orders.html">My Orders</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h4>Contact</h4>
                <p>SMUCT Campus, Uttara, Dhaka</p>
                <p>canteen@smuct.ac.bd</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 CampusBite. All rights reserved.</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>