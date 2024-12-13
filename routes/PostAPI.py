from flask import Blueprint, json, render_template, request, jsonify
from utils import spatial_queries, graph_queries
from config import execute_pg_query, execute_neo4j_query


bp = Blueprint('PostAPI', __name__)

"""
Only Post API here

"""

@bp.route('/post_query_student', methods=['POST'])
def post_query_student():
    try:
        # Get the data from the form
        student_id = request.form.get('student-id')

        # Validate input
        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        student_info = graph_queries.get_student_details()
        result = execute_neo4j_query(student_info, {"student_id": student_id})
        
        
        if not student_info:
            return jsonify({'error': 'Student not found'}), 404

        return jsonify({'student_id': student_id, 'info': result}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500