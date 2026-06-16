# Stitch 2 Coverage

This build is based on the uploaded Stitch 2 package and maps the screens into a single functional Supabase React app.

Included modules/screens:
- Executive ERP Dashboard
- Company Master Dashboard / Company Directory / Company Profile / Add Company
- Contract Management Dashboard / Contract Directory / Contract Details / Add or Renew Contract
- Camp Master Dashboard / Camp Directory / Add Camp
- Room Master Dashboard / Room Directory / Add Room
- Tenant Directory / Tenant Profile / Add Tenant
- Allocation Directory / New Allocation Flow
- Rent Collection Dashboard / Rent Collection Directory / Add Collection / Receipt View
- Expense Management Dashboard / Expense Directory / Add Expense / Expense Details
- Cheque Management Dashboard / Cheque Inventory / Add Cheque / Update Cheque Status
- Settings and Support

Functional requirements:
- Supabase Auth login only
- No dummy seed data in the app
- All KPIs, tables, views, exports, and reports use live Supabase rows
- Import CSV, Export CSV, New Entry, Edit, View, Delete row, and Delete Data controls are available where applicable
- Rent flow: create charge/due first, then record payment against it
- Payment updates charge paid amount, balance, status, and receipt number
- Expense flow supports invoice upload to Supabase Storage bucket `invoices`
