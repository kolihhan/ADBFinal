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
        r.region_name,
        COUNT(s.student_id) AS student_count
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    JOIN 
        regions r ON ST_Contains(r.geom, u.geom)
    WHERE 
        u.program_type = 'TAICA'
    GROUP BY 
        r.region_name;
    """
    return query

def count_student_has_cert():
    query = """
    SELECT 
        u.university_name,
        COUNT(s.student_id) AS taica_certified_students
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    WHERE 
        s.has_taica_certificate = TRUE
    GROUP BY 
        u.university_name;
    """
    return query

def count_low_student_region():
    query = """
    SELECT 
        r.region_name,
        COUNT(s.student_id) AS enrolled_students
    FROM 
        students s
    JOIN 
        universities u ON s.university_id = u.university_id
    JOIN 
        regions r ON ST_Contains(r.geom, u.geom)
    WHERE 
        u.program_type = 'TAICA'
    GROUP BY 
        r.region_name
    HAVING 
        COUNT(s.student_id) < 100;
    """
    return query

def find_nearest_taica_uni_from_student():
    query = """
    WITH random_student AS (
        SELECT 
            student_id, 
            ST_SetSRID(location_geom, 4326) AS geom
        FROM 
            students
        ORDER BY 
            RANDOM()
        LIMIT 1
    )
    SELECT 
        u.university_name,
        u.geom AS university_geom,
        r.student_id,
        ST_Distance(r.geom, u.geom) AS distance
    FROM 
        universities u,
        random_student r
    WHERE 
        u.program_type = 'TAICA'
    ORDER BY 
        ST_Distance(r.geom, u.geom)
    LIMIT 1;
    """
    return query