from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from flasgger import Swagger


app = Flask(__name__)

CORS(app)


# ============================================================
# BLUEPRINTS
# ============================================================

from routes.auth import auth_bp
from routes.field import field_bp
from routes.booking import booking_bp
from routes.customer_booking import customer_booking_bp
from routes.user import get_my_profile, user_bp


swagger = Swagger(
    app,
    template_file="swagger.yaml"
)


app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)


app.register_blueprint(
    field_bp,
    url_prefix="/api/fields"
)


app.register_blueprint(
    booking_bp,
    url_prefix="/api/bookings"
)


app.register_blueprint(
    customer_booking_bp,
    url_prefix="/api/customer-bookings"
)


app.register_blueprint(
    user_bp,
    url_prefix="/api/users"
)


# Legacy profile path retained for the login/profile integration contract.
app.add_url_rule(
    "/api/user/profile",
    endpoint="user_profile_legacy",
    view_func=get_my_profile,
    methods=["GET"],
)


@app.route("/")
def home():

    return {
        "message":
            "Backend running"
    }


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
