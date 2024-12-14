def get_all_uni_geom():
    query = """
    SELECT 
        u.name,
        COUNT(s.student_id) AS student_count,
        ST_AsGeoJSON(u.geom) 
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    GROUP BY 
        u.name, u.geom;
    """
    return query

def count_student_per_region():
    query = """
    SELECT 
        r.chinese_name,
        COUNT(s.student_id) AS student_count,
        ST_AsGeoJSON(r.geom) 
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    JOIN 
        regions r ON ST_Contains(r.geom, u.geom)
    GROUP BY 
        r.chinese_name, r.geom;
    """
    return query

def count_low_student_region():
    query = """
    SELECT 
        r.chinese_name,
        COUNT(s.student_id) AS student_count,
        ST_AsGeoJSON(r.geom) 
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    JOIN 
        regions r ON ST_Contains(r.geom, u.geom)
    GROUP BY 
        r.chinese_name,r.geom
	ORDER BY
		student_count ASC
    LIMIT 1
    """
    return query

def find_nearest_taica_uni_for_student(student_id):
    query = f"""
    WITH specific_student AS (
        SELECT 
            student_id, 
            ST_SetSRID(geom, 4326) AS geom
        FROM 
            students
        WHERE
            student_id = {student_id}
    )
    
    SELECT 
        u.name,
        s.student_id,
        ST_AsGeoJSON(s.geom) AS student_geom,
        ST_AsGeoJSON(u.geom) AS university_geom,
        ST_Distance(s.geom, ST_SetSRID(u.geom, 4326)) AS distance
    FROM 
        universities u,
        specific_student s
    ORDER BY 
        ST_Distance(s.geom, ST_SetSRID(u.geom, 4326))
    LIMIT 1;
    """
    return query


def find_nearest_taica_uni_from_random_student():
    query = """
    WITH random_student AS (
        SELECT 
            student_id, 
            ST_SetSRID(geom, 4326) AS geom
        FROM 
            students
        ORDER BY 
            RANDOM()
        LIMIT 1
    )
	
    SELECT 
        u.name,
		r.student_id,
		ST_AsGeoJSON(r.geom) AS student_geom,
        ST_AsGeoJSON(u.geom) AS university_geom,
        ST_Distance(r.geom, ST_SetSRID(u.geom, 4326)) AS distance
    FROM 
        universities u,
        random_student r
    ORDER BY 
        ST_Distance(r.geom, ST_SetSRID(u.geom, 4326))
    LIMIT 1;
    """
    return query


def count_student_has_cert():
    query = """
            SELECT 
                u.name,
                COUNT(s.student_id) AS taica_certified_students,
                ST_AsGeoJSON(u.geom)
            FROM 
                students s
            JOIN 
                universities u ON s.university_id = u.university_id
            WHERE 
                s.student_id IN ({placeholders})
            GROUP BY 
                u.name,u.geom;
        """
    return query


def get_universities_by_region():
    query = """
    SELECT r.chinese_name, u.id AS university_id, ST_AsGeoJSON(r.geom)
    FROM regions r
    JOIN universities u ON ST_Within(u.geom, r.geom)
    """
    return query


def get_regions_with_few_universities():
    sql_query = f"""
    SELECT r.chinese_name, COUNT(u.id) AS university_count
    FROM regions r
    LEFT JOIN universities u ON ST_Within(u.geom, r.geom)
    GROUP BY r.region
    HAVING COUNT(u.id) < 5
    """
    return sql_query

