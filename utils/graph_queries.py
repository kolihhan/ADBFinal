def get_student_details():
    query = """
    MATCH (student:Student {id: $studentId})-[:STUDIES_AT]->(university:University {id: $uniID })
    OPTIONAL MATCH (student)-[:CERTIFIED_IN]->(taicaProgram:Program)
    OPTIONAL MATCH (requiredCourse:Course)-[:PART_OF]->(taicaProgram)
    OPTIONAL MATCH (student)-[enr:ENROLLED_IN]->(requiredCourse)
    WITH 
      student,
      university,
      taicaProgram,
      SUM(CASE WHEN enr.status = 'P' THEN requiredCourse.credits ELSE 0 END) AS taica_credits,
      COLLECT(
        CASE 
          WHEN enr.status = 'P' THEN {
            course_id: requiredCourse.id, 
            course_name: requiredCourse.name, 
            credits: requiredCourse.credits
          }
          ELSE NULL 
        END
      ) AS completed_courses,
      COLLECT(
        CASE 
          WHEN enr.status <> 'P' OR enr IS NULL THEN {
            course_id: requiredCourse.id, 
            course_name: requiredCourse.name, 
            credits: requiredCourse.credits
          }
          ELSE NULL 
        END
      ) AS undone_courses
    RETURN
      student.name AS name,
      student.id AS student_id,
      university.name AS university_name,
      student.year_level AS year_level,
      student.degree_level AS degree_level,
      student.degree_program AS degree_program,
      taicaProgram.name AS TAICA_program,
      taica_credits,
      [c IN completed_courses WHERE c IS NOT NULL] AS completed_courses,
      [c IN undone_courses WHERE c IS NOT NULL] AS undone_courses


    """
    return query


def count_students_with_TAICA_Certifications():
    query = """
    MATCH (s:Student)-[:CERTIFIED_IN]->(:Program)
    OPTIONAL MATCH (s)-[:CERTIFIED_IN]->(taicaProgram:Program)
    OPTIONAL MATCH (requiredCourse:Course)-[:PART_OF]->(taicaProgram)
    OPTIONAL MATCH (s)-[enr:ENROLLED_IN]->(requiredCourse)
    WITH 
        s,
        SUM(CASE WHEN enr.status = 'P' THEN requiredCourse.credits ELSE 0 END) AS total_credits
    WHERE total_credits = 15
    RETURN DISTINCT s.id AS student_id, s.university_id as university_id
    """
    return query
  

def program_courses_with_their_prerequisites():
  query = """

  MATCH (prerequisites:Course)-[:PREREQUISITE_FOR]->(Course:Course)
  OPTIONAL MATCH (Course)-[:PART_OF]->(program:Program)
  RETURN Course, prerequisites, program

  """
  
  return query

def specific_courses_prerequisities():

  query = """

  // Find all courses and their prerequisites within a specific program
  MATCH (p:Program {id: $id})<-[:PART_OF]-(c:Course)
  OPTIONAL MATCH (c)-[:PREREQUISITE_FOR]->(prereq:Course)
  RETURN c.name AS Course, prereq.name AS Prerequisite
  ORDER BY Course;
  """
  return query

def determing_cert_pathway():
  query = """
  // Replace "PROGRAM_ID" with the actual program ID you want to analyze.
  MATCH (p:Program {id: $id})<-[:PART_OF]-(requiredCourse:Course)
  WITH p, collect(requiredCourse) AS requiredCourses

  // Find students who are not yet certified in the program
  MATCH (s:Student)
  WHERE (s)-[:CERTIFIED_IN]->(p)
  WITH s, p, requiredCourses

  // Identify courses the student has completed in this program
  OPTIONAL MATCH (s)-[en:ENROLLED_IN]->(c:Course)-[:PART_OF]->(p)
  WHERE en.status = "P"
  WITH s, p, requiredCourses, collect(DISTINCT c) AS completedCourses

  // Determine which required courses are still missing
  WITH s, p,
       [course IN requiredCourses WHERE NOT course IN completedCourses] AS missingCourses

  RETURN 
         s.id  AS student_id,
         s.name AS student_name,
         p.name AS program_name,
         missingCourses AS needed_courses,
         size(missingCourses) AS courses_remaining
  ORDER BY courses_remaining ASC;
  """
  return query

def ai_program_outreach_accessibility():
    query = """
    MATCH (s:Student)-[:CERTIFIED_IN]->(:Program)

    RETURN DISTINCT s.id AS student_id, s.university_id as university_id
    """
    return query


def illustrate_relationship_between_universities():
  query = """
  MATCH (taica:University)-[:OFFERS]->(course:Course { master_satellite: 'Satellite' })
      -[:AFFILIATED_WITH]->(masterU:University)
  RETURN taica   AS SatelliteSchool,
       course  AS SatelliteCourse,
       masterU AS MasterSchool;
  """
  
  return query
