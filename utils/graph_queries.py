def get_student_details():
    query = """
    // Step 1: Match the student and their associated university
    MATCH (student:Student {id: "112000099"})-[:STUDIES_AT]->(university:University)
    
    // Step 2: Optionally match courses the student is enrolled in that are part of the 'TAICA' program
    OPTIONAL MATCH (student)-[enr:ENROLLED_IN]->(course:Course)-[:PART_OF]->(program:Program)
    
    // Step 3: Pass along the matched variables for aggregation
    WITH 
        student, 
        university,
        enr,
        course,
        program
    
    // Step 4: Perform aggregations
    WITH 
        student, 
        university,
        // Calculate total TAICA credits from completed courses (status 'P')
        SUM(
            CASE 
                WHEN enr.status = 'P' THEN course.credits 
                ELSE 0 
            END
        ) AS taica_credits,
        
        // Collect completed courses (status 'P')
        COLLECT(
            DISTINCT CASE 
                WHEN enr.status = 'P' THEN {
                    course_id: course.id, 
                    course_name: course.name, 
                    credits: course.credits
                } 
                ELSE NULL 
            END
        ) AS completed_courses,
        
        // Collect undone courses (status 'F' or 'W')
        COLLECT(
            DISTINCT CASE 
                WHEN enr.status IN ['F', 'W'] THEN {
                    course_id: course.id, 
                    course_name: course.name, 
                    credits: course.credits
                } 
                ELSE NULL 
            END
        ) AS undone_courses
    
    // Step 5: Return the desired student details along with aggregated data
    RETURN 
        student.name AS name,
        student.id AS student_id,
        university.name AS university_name,
        student.year_level AS year_level,
        student.degree_level AS degree_level,
        student.degree_program AS degree_program,
        program.name as TAICA_program,
        taica_credits,
        [c IN completed_courses WHERE c IS NOT NULL] AS completed_courses,
        [c IN undone_courses WHERE c IS NOT NULL] AS undone_courses
    """
    return query




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


def count_students_with_TAICA_Certifications():
    query = """
    MATCH (s:Student)-[:CERTIFIED_IN]->(:Program)
    RETURN COUNT(DISTINCT s.id) AS student_count
    """
    return query
