from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/todos', methods=['GET'])
def get_todos():
    todos = ToDo.query.all()
    return jsonify([{"id": t.id, "title": t.title, "completed": t.completed} for t in todos])

@app.route('/todos', methods=['POST'])
def create_todo():
    data = request.json
    new_todo = ToDo(title=data['title'], completed=False)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"id": new_todo.id, "title": new_todo.title, "completed": new_todo.completed}), 201

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    data = request.json
    todo = ToDo.query.get(id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404
    todo.title = data.get("title", todo.title)
    todo.completed = data.get("completed", todo.completed)
    db.session.commit()
    return jsonify({"id": todo.id, "title": todo.title, "completed": todo.completed})

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = ToDo.query.get(id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
