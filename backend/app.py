import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

# Import db and models from the models file
from models import db, User, Item

load_dotenv()

app = Flask(__name__)

# --- PRODUCTION CONFIGURATION ---
# Render provides DATABASE_URL. We ensure it starts with 'postgresql://' for SQLAlchemy 1.4+
database_uri = os.environ.get('DATABASE_URL')
if database_uri and database_uri.startswith("postgres://"):
    database_uri = database_uri.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri or 'sqlite:///neighbourly.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'super-secret-key-change-in-prod'

db.init_app(app)

migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
ma = Marshmallow(app)

# Permissive CORS to make absolutely sure the handshake works
CORS(app, resources={r"/*": {"origins": "*"}}) 

# AUTOMATIC DATABASE INITIALIZATION FOR FREE TIER
with app.app_context():
    try:
        db.create_all()
        print("Database tables verified/created successfully!")
    except Exception as e:
        print(f"Error initializing data: {e}")
# --- ROUTES ---

@app.route('/')
def home():
    return {"message": "Welcome to the Neighbourly API", "status": "Online"}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"error": "Username already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    new_user = User(username=data.get('username'), email=data.get('email'), _password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and bcrypt.check_password_hash(user._password_hash, data.get('password')):
        # Convert user.id to string for JWT identity
        access_token = create_access_token(identity=str(user.id)) 
        return jsonify(access_token=access_token), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

@app.route('/items', methods=['POST'])
@jwt_required()
def add_item():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_item = Item(
        name=data.get('name'),
        description=data.get('description'),
        category=data.get('category'),
        user_id=current_user_id
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    item_id = data.get('item_id')
    end_date_str = data.get('end_date')

    try:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    if not item.is_available:
        return jsonify({"error": "Item is already reserved"}), 400

    from models import reservations 
    
    new_res_query = reservations.insert().values(
        user_id=current_user_id,
        item_id=item_id,
        end_date=end_date,
        start_date=datetime.utcnow()
    )
    
    db.session.execute(new_res_query)
    item.is_available = False
    db.session.commit()
    
    return jsonify({"message": f"Successfully reserved {item.name} until {end_date_str}"}), 201

@app.route('/user/reservations', methods=['GET'])
@jwt_required()
def get_user_reservations():
    current_user_id = get_jwt_identity()
    from models import reservations
    
    query = db.select(Item, reservations.c.end_date).join(
        reservations, Item.id == reservations.c.item_id
    ).where(reservations.c.user_id == current_user_id)
    
    results = db.session.execute(query).all()
    
    user_rentals = []
    for item, end_date in results:
        item_dict = item.to_dict()
        item_dict['end_date'] = end_date.strftime('%Y-%m-%d') if end_date else None
        user_rentals.append(item_dict)
        
    return jsonify(user_rentals), 200

@app.route('/user/items', methods=['GET'])
@jwt_required()
def get_user_items():
    current_user_id = get_jwt_identity()
    my_items = Item.query.filter_by(user_id=current_user_id).all()
    return jsonify([item.to_dict() for item in my_items]), 200

if __name__ == '__main__':
    # Use environment port for deployment, fallback to 5555
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port)