import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import  { TodoService } from "../todo.service"
import type { Todo } from "../todo.model"

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = []
  filteredTodos: Todo[] = []
  newTodoTitle = ""
  searchText = ""
  editingTodo: Todo | null = null
  editTodoTitle = ""

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10)
      this.filteredTodos = [...this.todos]
    })
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    }

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created)
      this.filterTodos()
      this.newTodoTitle = ""
    })
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe()
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.filterTodos()
    })
  }

  startEdit(todo: Todo) {
    this.editingTodo = todo
    this.editTodoTitle = todo.title
  }

  saveEdit() {
    if (this.editingTodo && this.editTodoTitle.trim()) {
      this.editingTodo.title = this.editTodoTitle
      this.updateTodo(this.editingTodo)
      this.cancelEdit()
    }
  }

  cancelEdit() {
    this.editingTodo = null
    this.editTodoTitle = ""
  }

  filterTodos() {
    if (!this.searchText) {
      this.filteredTodos = [...this.todos]
    } else {
      const searchLower = this.searchText.toLowerCase()
      this.filteredTodos = this.todos.filter((todo) => todo.title.toLowerCase().includes(searchLower))
    }
  }

  onSearchChange() {
    this.filterTodos()
  }
}
