"""
EXERCISE: Cross-Language Translation
This is a Python Flask version of a Task API.
Use Copilot to translate this to idiomatic Node.js Express code.
"""

from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from typing import Optional
from dataclasses import dataclass, field, asdict
from enum import Enum
import uuid


class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Status(Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"


@dataclass
class Task:
    title: str
    description: str = ""
    priority: Priority = Priority.MEDIUM
    status: Status = Status.TODO
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    tags: list = field(default_factory=list)
    subtasks: list = field(default_factory=list)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now().isoformat())


app = Flask(__name__)
tasks_db: dict[str, Task] = {}


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    try:
        priority = Priority(data.get("priority", "medium"))
    except ValueError:
        return jsonify({"error": f"Invalid priority. Must be one of: {[p.value for p in Priority]}"}), 400

    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        priority=priority,
        assignee=data.get("assignee"),
        due_date=data.get("due_date"),
        tags=data.get("tags", []),
        subtasks=data.get("subtasks", []),
    )

    tasks_db[task.id] = task
    return jsonify(asdict(task)), 201


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    status_filter = request.args.get("status")
    priority_filter = request.args.get("priority")
    assignee_filter = request.args.get("assignee")
    search_query = request.args.get("q", "").lower()
    sort_by = request.args.get("sort", "created_at")
    sort_order = request.args.get("order", "desc")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    filtered = list(tasks_db.values())

    if status_filter:
        filtered = [t for t in filtered if t.status.value == status_filter]

    if priority_filter:
        filtered = [t for t in filtered if t.priority.value == priority_filter]

    if assignee_filter:
        filtered = [t for t in filtered if t.assignee == assignee_filter]

    if search_query:
        filtered = [
            t for t in filtered
            if search_query in t.title.lower() or search_query in t.description.lower()
        ]

    reverse = sort_order == "desc"
    filtered.sort(key=lambda t: getattr(t, sort_by, ""), reverse=reverse)

    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]

    return jsonify({
        "tasks": [asdict(t) for t in paginated],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": -(-total // per_page),  # ceiling division
        }
    })


@app.route("/api/tasks/<task_id>/subtask", methods=["POST"])
def add_subtask(task_id):
    task = tasks_db.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Subtask title is required"}), 400

    subtask = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "completed": False,
        "created_at": datetime.now().isoformat(),
    }

    task.subtasks.append(subtask)
    task.updated_at = datetime.now().isoformat()

    return jsonify(subtask), 201


@app.route("/api/tasks/dashboard", methods=["GET"])
def dashboard():
    all_tasks = list(tasks_db.values())
    now = datetime.now()

    overdue = [
        t for t in all_tasks
        if t.due_date and datetime.fromisoformat(t.due_date) < now and t.status != Status.DONE
    ]

    due_this_week = [
        t for t in all_tasks
        if t.due_date
        and now <= datetime.fromisoformat(t.due_date) <= now + timedelta(days=7)
        and t.status != Status.DONE
    ]

    by_priority = {}
    for p in Priority:
        by_priority[p.value] = len([t for t in all_tasks if t.priority == p])

    by_status = {}
    for s in Status:
        by_status[s.value] = len([t for t in all_tasks if t.status == s])

    by_assignee = {}
    for t in all_tasks:
        if t.assignee:
            if t.assignee not in by_assignee:
                by_assignee[t.assignee] = {"total": 0, "completed": 0}
            by_assignee[t.assignee]["total"] += 1
            if t.status == Status.DONE:
                by_assignee[t.assignee]["completed"] += 1

    return jsonify({
        "total_tasks": len(all_tasks),
        "overdue_count": len(overdue),
        "due_this_week": len(due_this_week),
        "by_priority": by_priority,
        "by_status": by_status,
        "by_assignee": by_assignee,
        "completion_rate": (
            len([t for t in all_tasks if t.status == Status.DONE]) / len(all_tasks) * 100
            if all_tasks else 0
        ),
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
