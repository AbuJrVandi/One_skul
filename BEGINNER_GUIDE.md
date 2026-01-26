# Beginners Guide: Adding Subjects & Report Cards to One_SKul

Welcome! You've already built a great list of Schools and Districts. Now, we are going to make the system "smarter" by adding **Subjects**, **Students**, and **Report Cards**.

Think of this like building a house:
1. **Migrations** are the **Architect's Blueprints** (how the database looks).
2. **Models** are the **Light Switches** (how your code turns data on and off).

---

## Step 1: Running the Blueprints (Migrations)
I have already created 4 new blueprint files in your `database/migrations` folder. To actually "build" these tables in your database, you need to run a special command.

**What to do:**
Open your terminal inside the `One_SKul` folder and type:
```bash
php artisan migrate
```
**What this does:** 
It looks at the new files I made and creates the tables for Subjects, Students, and Report Cards. It won't delete your existing school data!

---

## Step 2: Understanding the "Centralized" System
In the old way, every school might type "Mathematics" differently (some might say "Maths", others "Math"). 

In our **New Way**:
1. We have a **Master List** of Subjects (The "Centralized" list).
2. Each **School** simply picks from that master list.
3. This is called a **Many-to-Many** relationship.

---

## Step 3: Meet the New "Employees" (Models)
I created several new files in `app/Models`. Here is what they do:

*   **Subject.php**: Represents a subject like "Physics" or "English".
*   **Student.php**: Represents a student. Each student belongs to one school.
*   **ReportCard.php**: This is like a folder for one student's results for a specific term (e.g., "Term 1 of 2024").
*   **Mark.php**: These are the actual scores (the numbers) inside the Report Card.

---

## Step 4: How the Data Flows
Here is the journey of a grade in our system:

1.  **Admin** adds "Mathematics" to the **Subject** list.
2.  **School A** says "We teach Mathematics" (Linked via `school_subject`).
3.  **Student John** is enrolled in **School A**.
4.  At the end of the term, we create a **Report Card** for **John**.
5.  Inside that report card, we add a **Mark** for **Mathematics**.

---

## Useful Commands for You
As you continue developing, keep these commands in your pocket:

*   `php artisan migrate`: Build the latest blueprints.
*   `php artisan make:controller SubjectController`: Create a brain to handle subject logic.
*   `php artisan tinker`: A magic window where you can talk to your database directly using code.

### What's Next?
Now that the database is ready, you can start building the **User Interface (UI)** so teachers can enter grades. I've already updated your `School.php` model so it knows how to talk to its new students!

**Happy Coding! 🚀**
