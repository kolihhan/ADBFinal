from flask import Flask
from routes import GetAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(GetAPI.bp)


if __name__ == '__main__':
    app.run(debug=True)
