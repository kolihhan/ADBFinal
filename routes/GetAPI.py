from flask import Blueprint, json, render_template, request, jsonify
from utils import spatial_queries, graph_queries
from config import drop_all_constraints,execute_pg_query, execute_neo4j_query

bp = Blueprint('GetAPI', __name__)

"""
Only GET API here

"""

@bp.route("/universities", methods=["GET"])
def get_universities():
    """
    Get All Universities and Count Student(With and without cert) as a GeoJSON FeatureCollection
    """
    query = spatial_queries.get_all_uni_geom()
    results = execute_pg_query(query)
    
    features = []
    for row in results:
        name,count, geom = row
        features.append({
            "type": "Feature",
            "properties": {"name": name,"count":count},
            "geometry": json.loads(geom) 
        })
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return jsonify(geojson)


@bp.route("/count_student", methods=["GET"])
def get_count_student_per_region():
    """
    Get Total Student Per Region as a GeoJSON FeatureCollection
    """
    query = spatial_queries.count_student_per_region()
    results = execute_pg_query(query)
    
    features = []
    for row in results:
        name, student_count, geom = row
        features.append({
            "type": "Feature",
            "properties": {"name": name, "student_count": student_count},
            "geometry": json.loads(geom) 
        })
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return jsonify(geojson)

@bp.route("/count_low_student", methods=["GET"])
def get_count_low_student_region():
    """
    Get most Low coverage student region as a GeoJSON FeatureCollection
    """
    query = spatial_queries.count_low_student_region()
    results = execute_pg_query(query)
    
    features = []
    for row in results:
        name, student_count, geom = row
        features.append({
            "type": "Feature",
            "properties": {"name": name, "student_count": student_count},
            "geometry": json.loads(geom) 
        })
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return jsonify(geojson)


@bp.route("/random_student_uni", methods=["GET"])
def get_random_student_nearest_uni():
    """
    Get nearest distance between a random student and university as a GeoJSON FeatureCollection
    """
    query = spatial_queries.find_nearest_taica_uni_from_random_student()
    results = execute_pg_query(query)
    
    features = []
    for row in results:
        name, student_id, student_geom, uni_geom , distance = row

        
    features.append({
        "type": "Feature",
        "properties": {"name": student_id, "distance": distance},
        "geometry": json.loads(student_geom)
    })
    
    features.append({
        "type": "Feature",
        "properties": {"name": name, "distance": distance},
        "geometry": json.loads(uni_geom)
    })
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return jsonify(geojson)


@bp.route("/get_student_cert", methods=["GET"])
def get_student_with_cert():
    """
    Get student details that have certification based on university as a GeoJSON FeatureCollection.
    """
    # Step 1: Get student IDs and university IDs from Neo4j
    neo_query = graph_queries.count_students_with_TAICA_Certifications()
    neo_result = execute_neo4j_query(neo_query)
    
    student_uni_pairs = [(record["student_id"], record["university_id"]) for record in neo_result]

    if not student_uni_pairs:
        return jsonify({
            "type": "FeatureCollection",
            "features": [],
            "message": "No certified students found."
        }), 200

    placeholders = ','.join(['(%s, %s)'] * len(student_uni_pairs))
    query = spatial_queries.count_student_has_cert().format(
        placeholders=placeholders
    )
    
    query_params = [value for pair in student_uni_pairs for value in pair]
    results = execute_pg_query(query, query_params)

    features = []
    for row in results:
        name, total_student, geom = row

        features.append({
            "type": "Feature",
            "properties": {"name": name, "count_student": total_student},
            "geometry": json.loads(geom)
        })

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(geojson)


@bp.route("/get_program_courses_with_their_prerequisites", methods=["GET"])
def get_program_courses_with_their_prerequisites():
    """
    Get program_courses with their prerequisites
    """
    neo_query = graph_queries.program_courses_with_their_prerequisites()
    neo_result = execute_neo4j_query(neo_query)
    
    return jsonify(neo_result)



@bp.route("/get_ai_program_outreach_accessibility", methods=["GET"])
def get_ai_program_outreach_accessibility():
    """
    Assess the accessibility of a particular TAICA (AI) program across different regions. 
    This query aggregates how many students from various universities/locations are pursuing or certified in the TAICA program, which can help identify underserved areas.
    
    """
    # Step 1: Get student IDs and university IDs from Neo4j
    neo_query = graph_queries.ai_program_outreach_accessibility()
    neo_result = execute_neo4j_query(neo_query)
    
    student_uni_pairs = [(record["student_id"], record["university_id"]) for record in neo_result]

    if not student_uni_pairs:
        return jsonify({
            "type": "FeatureCollection",
            "features": [],
            "message": "No certified students found."
        }), 200

    placeholders = ','.join(['(%s, %s)'] * len(student_uni_pairs))
    query = spatial_queries.count_student_has_cert().format(
        placeholders=placeholders
    )
    
    query_params = [value for pair in student_uni_pairs for value in pair]
    results = execute_pg_query(query, query_params)

    features = []
    for row in results:
        name, total_student, geom = row

        features.append({
            "type": "Feature",
            "properties": {"name": name, "count_student": total_student},
            "geometry": json.loads(geom)
        })

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(geojson)


@bp.route("/get_illustrate_relationship_between_universities", methods=["GET"])
def get_illustrate_relationship_between_universities():
    """
    Illustrate the relationship between universities, master course and satellite course.
    """
    neo_query = graph_queries.illustrate_relationship_between_universities()
    neo_result = execute_neo4j_query(neo_query)
    
    return jsonify(neo_result)




@bp.route('/')
def index():
    return render_template('index.html')


@bp.route("/clear_all", methods=["GET"])
def testing():
    
    drop_all_constraints()
    
    return "Done!"

class UnusedQueries:
    
    @bp.route("/get_execute_ai_accessibility", methods=["GET"])
    def execute_ai_accessibility():

        query = spatial_queries.get_universities_by_region()
        results = execute_pg_query(query)

        university_ids = results.get('university_id', [])

        neo_query = graph_queries.assess_accessibility_of_ai_programs(university_ids)
        neo_result = [record["ai_university_count"]  for record in execute_neo4j_query(neo_query)]

        return jsonify(neo_result)

