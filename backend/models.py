from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

# Remove 'from app import db'
# We will use this db instance which is linked in app.py
db = SQLAlchemy()

# Association Table
reservations = db.Table(
    'reservations',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True),
    db.Column('start_date', db.DateTime, default=datetime.utcnow),
    db.Column('end_date', db.DateTime, nullable=False)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-items.owner', '-reserved_items', '-_password_hash')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    items = db.relationship('Item', backref='owner', lazy=True)
    reserved_items = db.relationship('Item', secondary=reservations, backref='borrowers')

class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'
    serialize_rules = ('-owner.items', '-borrowers')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    is_available = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)