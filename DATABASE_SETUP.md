# Database Setup Instructions

Before running the application, you need to add two columns to your `users` table to track login information.

## SQL Commands

Run these SQL commands in your PostgreSQL database (`auth_db`):

```sql
-- Add login_count column (tracks total number of logins)
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Add last_login column (tracks the timestamp of the last login)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
```

## How to Run

### Option 1: Using psql CLI

```bash
psql -U postgres -d auth_db -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;"
psql -U postgres -d auth_db -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;"
```

### Option 2: Using pgAdmin or DBeaver
1. Connect to your `auth_db` database
2. Open a Query window
3. Paste the above SQL commands
4. Execute

---

## Verify the changes

To verify the columns were added correctly, run:

```sql
SELECT * FROM users;
```

You should see `login_count` and `last_login` columns in the output.

---

## Starting the Application

### Backend Server (API)
```bash
npm start
```
This runs on `http://localhost:3000`

### Frontend Server (React)
```bash
cd frontend
npm run dev
```
This runs on `http://localhost:5173`

Then open `http://localhost:5173` in your browser!
