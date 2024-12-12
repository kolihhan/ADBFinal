from flask import Flask
from flask_cors import CORS
from routes import GetAPI

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(GetAPI.bp)


if __name__ == '__main__':
    app.run(debug=True)
