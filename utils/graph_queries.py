

def count_student_has_cert():
    query = """
            MATCH (s:Student)-[:HAS_CERTIFICATE]->(:Certificate)
            RETURN s.student_id AS student_id
            """


# Find Master and Satellite Courses Offered by a University  
# List Universities Sharing Similar Courses
# Trace Student Enrollment Paths Across Universities
# Recommend Courses Based on Completed Certificates
# Assess Accessibility of AI Programs by Region
# Identify Regions for Expanding Remote Learning Resources
# Detect Clusters of Students for Targeted Program Development
# Streamline Administrative Tasks by Mapping Course Dependencies
# Analyze Certificate Completion Pathways