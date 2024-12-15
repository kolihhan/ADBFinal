
### Setup Neo4J Database Script

```
// Neo4j Database Setup Script

// ========================================
// Step 1: Clear Existing Database
// ========================================
MATCH (n)
DETACH DELETE n;

// ========================================
// Step 2: Create Constraints and Indexes
// ========================================

// Ensure uniqueness for key node identifiers
CREATE CONSTRAINT IF NOT EXISTS FOR (u:University)
REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS FOR (p:Program)
REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS FOR (c:Committee)
REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS FOR (course:Course)
REQUIRE course.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS FOR (sem:Semester)
REQUIRE sem.id IS UNIQUE;

// ========================================
// Step 3: Load University Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///University.csv' AS row
MERGE (university:University {id: row.Univ_ID})
SET university.name = row.University_name,
    university.location = row.City;

// ========================================
// Step 4: Load TAICA Program Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///TAICA_program.csv' AS row
MERGE (program:Program {id: row.Program_ID})
SET program.name = row.Program_name
WITH program, row
MATCH (university:University {id: row.Univ_ID})
MERGE (program)-[:OFFERED_BY]->(university);

// ========================================
// Step 5: Load Committee Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Committee.csv' AS row
MERGE (committee:Committee {id: row.Committee_ID})
SET committee.university_id = row.Univ_ID,
    committee.appointed_person = row.Appointed_person;

// ========================================
// Step 6: Load Student Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Student.csv' AS row
MERGE (student:Student {id: row.Student_ID})
SET student.name = row.Name,
    student.university_id = row.University_ID,
    student.year_level = toInteger(row.Year_level),
    student.degree_level = row.Degree_level,
    student.degree_program = row.Degree_program
WITH student, row
MATCH (university:University {id: row.University_ID})
MERGE (student)-[:STUDIES_AT]->(university);

// ========================================
// Step 7: Load Course Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Course.csv' AS row
MERGE (course:Course {id: row.Course_ID})
SET course.university_id = row.Univ_ID,
    course.name = row.Course_name,
    course.credits = toInteger(row.Credit_count),
    course.master_satellite = row.Master_satellite,
    course.master_university_id = row.Master_univ_ID;

// ========================================
// Step 8: Load Semester Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Semester.csv' AS row
MERGE (semester:Semester {id: row.Sem_ID})
SET semester.start_date = date(row.Start_Date),
    semester.end_date = date(row.End_Date)
WITH semester, row
MATCH (university:University {id: row.Univ_ID})
MERGE (university)-[:HAS_SEMESTER]->(semester);

// ========================================
// Step 9: Load TAICA Curriculum Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///TAICA_curriculum.csv' AS row
MATCH (course:Course {id: row.Course_ID})
MATCH (program:Program {id: row.Program_ID})
MERGE (course)-[:PART_OF]->(program);

// ========================================
// Step 10: Load TAICA Certification Data
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///TAICA_Certification.csv' AS row
MATCH (student:Student {id: row.Student_ID})
MATCH (program:Program {id: row.Program_ID})
MERGE (student)-[:CERTIFIED_IN]->(program);

// ========================================
// Step 11: Create Relationships Between Committee and University
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Committee.csv' AS row
MATCH (committee:Committee {id: row.Committee_ID})
MATCH (university:University {id: row.Univ_ID})
MERGE (committee)-[:BELONGS_TO]->(university);

// ========================================
// Step 12: Load Enrollment Relationships
// ========================================
LOAD CSV WITH HEADERS FROM 'file:///Enrollment.csv' AS row
MATCH (student:Student {id: row.Student_ID})
MATCH (course:Course {id: row.Course_ID})
MERGE (student)-[:ENROLLED_IN {
    university_id: row.Univ_ID,
    semester_id: row.Sem_ID,
    status: row.Status,
    grade: row.Grade
}]->(course);

// ========================================
// Step 13: Sample prerequisite_for data
// ========================================

MATCH (c1:Course {id: "7"}), (c2:Course {id: "2"}), (c3:Course {id: "3"})
MERGE (c1)-[:PREREQUISITE_FOR]->(c2)
MERGE (c1)-[:PREREQUISITE_FOR]->(c3)
RETURN c1, c2, c3;

// Create prerequisites for Probability -> Machine Learning
MATCH (c4:Course {id: "6"}), (c5:Course {id: "1"}), (c6:Course {id: "16"})
MERGE (c4)-[:PREREQUISITE_FOR]->(c5)
RETURN c4, c5;

MATCH (u:University)
MATCH (course:Course {university_id: u.id})
MERGE (u)-[:OFFERS]->(course);


MATCH (course:Course)
WHERE course.master_satellite = 'Satellite'
MERGE (masterU:University { university_id: course.master_university_id })
MERGE (course)-[:AFFILIATED_WITH]->(masterU);




```

## `Things to aware`

- Remember to put CSV File into the import folder of NEO4J `/var/lib/neo4j/import`
