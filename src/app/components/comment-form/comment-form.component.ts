import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent implements OnChanges {
  @Input() postId!: number;
  @Input() editComment?: Comment | null;
  @Output() save = new EventEmitter<Comment>();

  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editComment) {
      this.commentForm.patchValue({
        name: this.editComment.name,
        email: this.editComment.email,
        body: this.editComment.body
      });
    } else {
      this.commentForm.reset();
    }
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const comment: Comment = {
        id: this.editComment?.id ?? 0,
        postId: this.postId,
        userId: Math.floor(Math.random() * 70) + 1,
        ...this.commentForm.value
      };
      this.save.emit(comment);
      this.commentForm.reset();
    }
  }
}
