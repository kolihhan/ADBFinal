def get_all_uni_geom():
    query = """
    SELECT name, ST_AsGeoJSON(geom) 
    FROM public."universities" 
    ORDER BY gid ASC;
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

def find_nearest_taica_uni_from_student():
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
                u.university_name,
                COUNT(s.student_id) AS taica_certified_students,
                ST_AsGeoJSON(u.geom)
            FROM 
                students s
            JOIN 
                universities u ON s.university_id = u.university_id
            WHERE 
                s.student_id = ANY(%s)
            GROUP BY 
                u.university_name,u.geom;
        """
    return query