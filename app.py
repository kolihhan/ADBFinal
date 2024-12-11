from flask import Flask
from routes import GetAPI

app = Flask(__name__)


# Register Blueprints
app.register_blueprint(GetAPI.bp)


if __name__ == '__main__':
    app.run(debug=True)
