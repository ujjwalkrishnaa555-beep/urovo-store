UROVO V40 — Product Codes, Seller Display, Sharing and Order Detail Snapshots

FILES
- UROVO-V40-PRODUCT-CODE-SHARE-SELLER-ORDERS.html
  Complete single-file store frontend. Rename/copy this to index.html in your existing GitHub Pages repository.
- UROVO-V40-PRODUCT-CODE-ORDER-SNAPSHOTS.sql
  Incremental Supabase SQL migration for the new private product-code table, order snapshots, seller visibility and secure checkout integration.

BEFORE INSTALLING
1. Back up your current GitHub index.html and the Supabase database.
2. This is an incremental V40 migration for the existing UROVO/V39 database. It expects the existing products, orders, urovo_sellers, urovo_notifications, urovo_coupons and urovo_delivery_pincodes tables and the urovo_is_ceo() function to exist. Do not run it against an empty Supabase project.
3. In Supabase SQL Editor, run the entire V40 SQL file once. Review the results and stop if an error appears; do not publish the new HTML until the migration succeeds.
4. Replace the existing repository index.html with the contents of the V40 HTML file. Preserve your existing manifest.webmanifest, sw.js, icon-192.png, icon-512.png and urovo-config.js files.
5. Commit/push to GitHub Pages. Open UROVO and use the existing Update UROVO gate when it appears.

WHAT V40 ADDS
- Required product-code field for CEO and seller product submissions. Codes are unique and stored separately from the public products table.
- CEO-only Product Codes tab and product codes visible in CEO Product Approvals.
- Product approval calls a CEO-only database function; a listing cannot be approved without a code.
- Seller name appears on the product details page.
- Share Product Link creates a direct URL for the selected product; a visit to that URL opens the product details.
- Private order-item snapshots record product code, image, name, seller, quantity and price at checkout.
- CEO Order Management and the seller's own Seller Dashboard show order image/code, quantity, item total, customer contact/address, order ID/date and status/tracking.
- Order visibility is limited to the customer who owns the order, the active seller associated with the order, or the CEO. Product codes/order snapshots are not exposed on the public product row or customer-visible order JSON.
- Existing products without a code receive an auto-generated unique UROVO code during migration. The CEO or seller can change it later.
- Existing orders receive best-effort legacy snapshots based on data already saved in the order. Their code is added during migration and may not be the original code from the order date; the UI labels these legacy rows.
- The secure order function checks stock and calculates the total on the server, then saves private snapshots in the same transaction. Checkout remains Cash on Delivery; no payment gateway is added.

RECOMMENDED TEST
1. Sign in with an active Seller-badged account and add a product with a unique code.
2. Sign in as the CEO and open Product Approvals. Verify the product code and seller name show, then approve it.
3. Open the product publicly and verify it says “Sold by” and the Share Product Link opens the same product.
4. Place a test order for that product. Verify its seller sees only the associated order and sees the correct image/code/snapshot details; verify CEO can see all orders.
5. Confirm a normal customer cannot open the CEO Product Codes tab or read the private snapshot tables directly.

VALIDATION NOTE
The HTML's executable inline JavaScript blocks were syntax-checked successfully. The migration was prepared against the existing UROVO schema available in the working files, but it has not been executed against your live Supabase project from this chat. Back up first and stop if Supabase reports an error.

