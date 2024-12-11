from flask import Blueprint, json, render_template, request, jsonify
from utils import spatial_queries, graph_queries
from config import execute_pg_query

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




@bp.route('/')
def index():
    return render_template('index.html')