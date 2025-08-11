# Goal Tracker - NestJS PostgreSQL Project

A goal tracking application built with NestJS and PostgreSQL, designed to handle hierarchical goal structures with robust data integrity and advanced querying capabilities.

## 🎯 Project Overview

This project implements a goal tracking system that allows users to create, manage, and track their goals with support for nested sub-goals (up to 2 levels deep). The application emphasizes data integrity, performance, and scalability.

## 📊 Database Choice: PostgreSQL

### Why PostgreSQL?

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

## 🔧 Technical Setup

### ORM Configuration

**Chosen ORM:** TypeORM

Our TypeORM setup includes:
- Environment variable configuration using `@nestjs/config`
- Async database connection via `TypeOrmModule.forRootAsync`
- Automatic entity loading with `autoLoadEntities`
- Development-friendly schema synchronization

### Environment Variables

Create a `.env` file in your project root:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=goaltracker
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/goaltracker
```

### Database Connection Setup

Add this configuration to your `app.module.ts`:

```
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: true, // For development only - disable in production!
  }),
})
```