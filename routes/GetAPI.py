from flask import Blueprint, json, render_template, request, jsonify
from utils import spatial_queries, graph_queries
from config import execute_pg_query, execute_neo4j_query

bp = Blueprint('GetAPI', __name__)

"""
Only GET API here

"""

@bp.route("/universities", methods=["GET"])
def get_universities():
    """
    Get All Universities as a GeoJSON FeatureCollection
    """
    query = spatial_queries.get_all_uni_geom()
    results = execute_pg_query(query)
    
    features = []
    for row in results:
        name, geom = row
        features.append({
            "type": "Feature",
            "properties": {"name": name},
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
    query = spatial_queries.find_nearest_taica_uni_from_student()
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
    Get student details that has certification based on university as a GeoJSON FeatureCollection
    """
    neo_query = graph_queries.count_student_has_cert()
    neo_result = [record["student_id"] for record in execute_neo4j_query(neo_query)]
    
    query = spatial_queries.count_student_has_cert()
    results = execute_pg_query(query, neo_result)
    
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



@bp.route('/')
def index():
    return render_template('index.html')