# Firestore Security Specification

## Data Invariants
1. A **User** document path must match their `request.auth.uid`.
2. A **Product** can only be created/updated by an **Admin**.
3. An **Order** must have a `userId` that matches the creator's `uid`.
4. Users can only read their own orders. Admins can read all orders.
5. Reviews can only be created by signed-in users, and updated/deleted by the author or admin.
6. A review MUST have a valid `productId` that exists.
7. Orders are immutable once reached terminal state (e.g., 'delivered' or 'cancelled') except by Admin.

## The Dirty Dozen Payloads (Rejection Tests)
1. Creating a user profile with `uid` different from `request.auth.uid`.
2. Updating `role` to 'admin' in user profile from client.
3. Creating a product as a standard user.
4. Injecting a 2MB string into product description.
5. Updating `price` of a product as a standard user.
6. Creating an order with `userId` different from current user.
7. Reading someone else's order list.
8. Deleting a product as a non-admin.
9. Creating a review with a rating of 10 (valid is 1-5).
10. Creating a document with a 1KB string as an ID (max length guard).
11. Updating `createdAt` field on an existing document.
12. Creating a review for a non-existent product.

## Rules Draft Strategy
- Use `isValidId` and `isValid[Entity]` helpers.
- Use `isAdmin` check via lookup in `users` collection.
- Split update logic into actions.
