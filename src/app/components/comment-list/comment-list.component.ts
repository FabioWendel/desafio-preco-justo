import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { LucideAngularModule, MailPlus, Pencil, Trash2 } from 'lucide-angular';
import { MessageCircle } from 'lucide-angular/src/icons';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentFormComponent, ConfirmDialogComponent, ToastNotificationComponent, LucideAngularModule, LoadingSpinnerComponent],
  templateUrl: './comment-list.component.html'
})
export class CommentListComponent implements OnInit {
  @Input() postId!: number;
  comments: Comment[] = [];
  commentToEdit: Comment | null = null;
  showModal = false;
  toastMessage = '';
  confirmMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  commentToDelete: number | null = null;
  showConfirm = false;
  isLoading = false;
  private nextCommentId = 501;
  readonly Trash2 = Trash2;
  readonly Pencil = Pencil;
  readonly MailPlus = MailPlus;
  readonly MessageCirclePlus = MessageCircle;

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.commentService.getCommentsByPost(this.postId).subscribe({
      next: (data) => {
        this.comments = data;
        const maxId = Math.max(...data.map(c => c.id), this.nextCommentId);
        this.nextCommentId = maxId + 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar comentários', err),
          this.showToast('Erro ao carregar comentários.', 'error');
          this.isLoading = false;
      }
    });
  }

  onRequestDelete(commentId: number) {
    this.commentToDelete = commentId;
    this.showConfirm = true;
    this.confirmMessage = 'Tem certeza que deseja excluir este comentário?';
  }

  onConfirmDelete() {
    this.isLoading = true;
    if (this.commentToDelete !== null) {
      const isLocalPost = this.commentToDelete > 500;
      if (isLocalPost) {
        this.comments = this.comments.filter(c => c.id !== this.commentToDelete);
        this.showToast('Post local removido com sucesso.', 'success');
        this.resetDelete();
        this.isLoading = false;
      } else {
        this.commentService.deleteComment(this.commentToDelete).subscribe({
          next: () => {
            this.comments = this.comments.filter(c => c.id !== this.commentToDelete);

            this.showToast('Comentário excluído com sucesso!', 'success');

            this.commentToDelete = null;
            this.showConfirm = false;
            this.isLoading = false;
          },
          error: () => {
            this.showToast('Erro ao excluir post.', 'error');
            this.showToast('Erro ao excluir comentário.', 'error');
            this.showConfirm = false;
            this.isLoading = false;
          }
        });
      }
    }
  }

  resetDelete() {
    this.showConfirm = false;
    this.commentToDelete = null;
  }

  onCancelDelete() {
    this.showConfirm = false;
    this.commentToDelete = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }


  openModal(comment?: Comment) {
    this.commentToEdit = comment ?? null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.commentToEdit = null;
  }

  handleSave(comment: Comment) {
    this.isLoading = true;
    const isLocalPost = comment.id > 500;
    if (isLocalPost) {
      const index = this.comments.findIndex(p => p.id === comment.id);
      if (index !== -1) {
        this.comments[index] = comment;
        this.showToast('Post editado (local)', 'success');
        this.isLoading = false;
      }
    } else {
      if (comment.id) {
        // EDITAR
        this.commentService.updateComment(comment).subscribe({
          next: updated => {
            const index = this.comments.findIndex(c => c.id === updated.id);
            if (index !== -1) {
              this.comments[index] = updated;
            }
            this.showToast('Comentário editado com sucesso!', 'success');
            this.isLoading = false;
          },
          error: err => {
            console.error('Erro ao editar comentário', err),
              this.showToast('Erro ao editar comentário.', 'error');
              this.isLoading = false;
          }
        });
      } else {
        // CRIAR
        this.commentService.createComment(comment).subscribe({
          next: created => {
            const newComment = {
              ...created,
              id: this.nextCommentId++
            };
            this.comments.push(newComment);
            this.showToast('Comentário enviado com sucesso!', 'success');
            this.isLoading = false;
          },
          error: err => {
            console.error('Erro ao criar comentário', err),
              this.showToast('Erro ao criar comentário.', 'error');
              this.isLoading = false;
          }
        });
      }
    }
  }

}
