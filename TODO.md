# TODO

1. ~~Add branch relation on specific table~~
2. ~~Create seeder for~~
    - ~~items~~
    - ~~products~~
    - ~~productsItems~~
3. Create order table and all related table to it
4. Create accounting table
5. ~~Location Schema~~
6. ~~Location route~~
7. ~~Location controller~~
8. ~~Tes location (unit/e2e test?)~~
9. ~~Improve auth, save token to db~~
10. ~~Restructure folder~~
11. ~~Finish product.test~~
12. ~~create item crud~~
13. create item test
14. ~~debug with all test~~
15. make category and unit name unique
16. handle SQL error

## WHO

1. Superadmin: Who control all app
   - Can access all features in the app
   - Can see app log? (if it any)
   - Create new user
   - Confirm new user request (Owner, Employee, Customer, Agent)
   - Confirm new item request (Owner)
2. Admin: Who control app in a specific branch
   - Can access all features of the app in specific branch
   - Can see branch's app log? (if it any)
   - Create new user
   - Confirm new user request (Owner, Employee, Customer, Agent)
   - Confirm new item request (Owner)
3. Owner: Who own items for rent
   - Manage items
   - See their items rent history
   - See their total income or per items
   - See their income per order
   - See their graphic income
   - Handle their items availability status
   - Handle their broken items
   - Handle their item mutations
4. Employee: Who deliver and handle items on site
   - See their order schedule
   - See their task each day/week/month
   - See their income per order
   - See their income total
   - See their income per period
5. Customer: Who rent items
   - See their order schedule
   - See their order status
   - See their order history
6. Agent: Who give recommendation to customer
   - See their order schedule
   - See their order status
   - See their order history
