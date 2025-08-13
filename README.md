Goal Tracker - NestJS PostgreSQL Project
A goal tracking application built with NestJS and PostgreSQL, designed to handle hierarchical goal structures with robust data integrity and advanced querying capabilities.

🎯 Project Overview
This project implements a goal tracking system that allows users to create, manage, and track their goals with support for nested sub-goals (up to 2 levels deep). The application emphasizes data integrity, performance, and scalability.

📦 Tech Stack Summary
Backend Framework: NestJS — Modular architecture for scalability and maintainability.

Language: TypeScript — Type safety and cleaner code.

Database: PostgreSQL — Reliable relational storage with advanced SQL features.

ORM: TypeORM — Simplifies database access, migrations, and relationships.

Configuration: @nestjs/config — Environment-based configuration management.

Validation: class-validator / class-transformer — Input validation and DTO transformation.

API Docs: postman — Interactive API documentation.

📊 Database Choice: PostgreSQL
Why PostgreSQL?
I selected **PostgreSQL** over MongoDB for several strategic reasons:

#### ✅ **Structured Data Model**
- Goals and users have clear relational links (user → goals → child goals)
- Predictable schema that benefits from relational constraints
- Well-defined relationships between entities

#### ✅ **Data Integrity**
- Foreign keys prevent orphaned records
- Constraints can enforce the max 2-level nesting requirement
- ACID compliance ensures data consistency

#### ✅ **Advanced Querying**
- Powerful SQL capabilities for sorting, filtering, and analytics
- Easy ordering of public goals by creation date
- Complex joins and aggregations for reporting

#### ✅ **Future-proofing**
- Excellent support for reports, statistics, and dashboards
- Handles complex analytical queries efficiently
- Scalable for enterprise-level applications

#### ✅ **Industry Standard**
- Many large-scale goal-tracking and task-management tools use relational databases
- Predictable performance characteristics
- Mature ecosystem and tooling

### Why Not MongoDB?

While MongoDB excels in flexible, schema-less designs, our use case has specific requirements:

- **Predictable Data Structure**: Our data model is well-defined and benefits from relational constraints
- **Nesting Enforcement**: The 2-level nesting rule is easier to enforce with database constraints rather than application-level checks
- **Query Complexity**: SQL provides more straightforward solutions for our analytical needs

⚙️ Setup Instructions
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/goal-tracker.git
cd goal-tracker
2. Install dependencies
bash
Copy
Edit
npm install
3. Configure environment variables
Create a .env file in the root directory:

env
Copy
Edit
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=goaltracker
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/goaltracker
4. Run the database
If using Docker:

bash
Copy
Edit
docker run --name goaltracker-db -e POSTGRES_PASSWORD=your_password_here -e POSTGRES_DB=goaltracker -p 5432:5432 -d postgres
5. Start the application
bash
Copy
Edit
npm run start:dev
6. Access the API
API runs at: http://localhost:3000

🗝️ Key Decisions and Trade-offs
Database Type (PostgreSQL over MongoDB)
Chosen for relational integrity, strict schema, and better analytical querying.
Trade-off: Less flexibility in schema changes compared to MongoDB.

ORM (TypeORM)
Simplifies migrations and relationships, integrates tightly with NestJS.
Trade-off: Slightly more overhead compared to raw SQL queries.

2-Level Goal Nesting Limit
Enforced at the Server level for simplicity and data consistency.
Trade-off: Less flexibility for future deeper nesting without schema changes.

🚧 Known Limitations / Pending Features
Pagination and filtering for large goal datasets.

Unit tests for all services and controllers.

CI/CD pipeline setup.

Caching for frequently accessed queries.

Deployment configuration (Docker Compose for prod).
})
```
