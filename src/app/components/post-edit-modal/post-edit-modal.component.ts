import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-edit-modal.component.html'
})
export class PostEditModalComponent implements OnChanges {
  @Input() post!: Post;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Post>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.post) {
      this.form.patchValue({
        title: this.post.title,
        body: this.post.body
      });
    }
  }

  onSave() {
    if (this.form.valid) {
      const updated: Post = {
        ...this.post,
        ...this.form.value
      };
      this.save.emit(updated);
    }
  }
}
