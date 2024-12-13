from flask import Flask
from routes import GetAPI, PostAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(GetAPI.bp)
app.register_blueprint(PostAPI.bp)

if __name__ == '__main__':
    app.run(debug=True)
