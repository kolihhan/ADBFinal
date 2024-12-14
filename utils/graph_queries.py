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

def get_university_ids_and_names():
    query = """
    MATCH (u:University)
    RETURN u.id AS university_id, u.name AS university_name
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


class unusedQueries:



    def find_master_and_satellite_courses():
        query = """
        MATCH (u:University)<-[:OFFERED_BY]-(program:Program)-[:PART_OF]->(c:Course)
        WHERE c.master_satellite IN ['Master', 'Satellite']
        RETURN u.name AS university, c.name AS course, c.master_satellite AS type
        """
        return query


    def list_universities_sharing_similar_courses():
        query = """
        MATCH (u1:University)<-[:OFFERED_BY]-(p1:Program)-[:PART_OF]->(c:Course)-[:PART_OF]->(p2:Program)-[:OFFERED_BY]->(u2:University)
        WHERE u1 <> u2
        RETURN 
            u1.name AS university1, 
            u2.name AS university2, 
            COLLECT(DISTINCT c.name) AS shared_courses
        """
        return query


    def trace_student_enrollment_paths_across_universities():
        query = """
        MATCH (s:Student)-[:ENROLLED_IN]->(c:Course)-[:PART_OF]->(p:Program)-[:OFFERED_BY]->(u:University)
        RETURN 
            s.id AS student, 
            COLLECT(DISTINCT u.name) AS university_path
        """
        return query


    def recommend_courses_based_on_completed_TAICA_Certifications():
        query = """
        MATCH (s:Student)-[:CERTIFIED_IN]->(p:Program)<-[:PART_OF]-(c:Course)
        WHERE NOT (s)-[:ENROLLED_IN]->(c)
        RETURN 
            s.id AS student, 
            COLLECT(DISTINCT c.name) AS recommended_courses
        """
        return query


    def streamline_administrative_tasks_by_mapping_course_dependencies():
        query = """
        MATCH (c1:Course)-[:REQUIRES]->(c2:Course)
        RETURN 
            c1.name AS course, 
            COLLECT(c2.name) AS dependencies
        """
        return query


    def analyze_TAICA_Certification_completion_pathways():
        query = """
        MATCH (s:Student)-[:CERTIFIED_IN]->(p:Program)
        RETURN 
            p.name AS TAICA_Certification, 
            COUNT(s) AS completion_count
        """
        return query

