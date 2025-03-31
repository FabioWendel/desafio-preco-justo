import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
})
export class PostFormComponent {
  @Output() create = new EventEmitter<Post>();
  @Output() cancel = new EventEmitter<void>();

  postForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = {
        userId: Math.floor(Math.random() * 70) + 1,
        id: 0,
        ...this.postForm.value
      };

      this.create.emit(newPost);
      this.postForm.reset();
    }
  }
}
