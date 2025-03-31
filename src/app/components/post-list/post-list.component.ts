import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostEditModalComponent } from '../post-edit-modal/post-edit-modal.component';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LucideAngularModule, MailPlus, MessageCircle, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule, 
    PostFormComponent, 
    PostEditModalComponent, 
    CommentListComponent, 
    LoadingSpinnerComponent, 
    ToastNotificationComponent, 
    ConfirmDialogComponent,
    LucideAngularModule
  ],
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  @Input() postId!: number;
  comments: Comment[] = [];
  commentToEdit: Comment | null = null;
  selectedPost: Post | null = null;
  isLoading = false;
  showPostModal = false;
  toastMessage = '';
  confirmMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  postToDelete: number | null = null;
  showConfirm = false;
  private nextPostId = 101;
  readonly Trash2 = Trash2;
  readonly Pencil = Pencil;
  readonly MailPlus = MailPlus;
  readonly MessageCirclePlus = MessageCircle;

  constructor(private postService: PostService, private commentService: CommentService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data,
          this.isLoading = false;
          const maxId = Math.max(...data.map(p => p.id));
          this.nextPostId = maxId + 1;
      },
      error: (err) => { 
        console.error('Erro ao carregar posts', err), 
        this.showToast('Erro ao carregar post.', 'error');
        this.isLoading = false; 
      },
    });
    this.loadComments();
  }

  onRequestDelete(postId: number) {
    this.postToDelete = postId;
    this.showConfirm = true;
    this.confirmMessage = 'Tem certeza que deseja excluir este post?';
  }

  onConfirmDelete() {
    this.isLoading = true;
    if (this.postToDelete !== null) {
      const isLocalPost = this.postToDelete > 100;

      if (isLocalPost) {
        this.posts = this.posts.filter(p => p.id !== this.postToDelete);
        this.showToast('Post local removido com sucesso.', 'success');
        this.isLoading = false;
        this.resetDelete();
      } else {
      this.postService.deletePost(this.postToDelete).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== this.postToDelete);

          this.showToast('Post excluído com sucesso!', 'success');

          this.postToDelete = null;
          this.showConfirm = false;
          this.isLoading = false;
        },
        error: () => {
          this.showToast('Erro ao excluir post.', 'error');
          this.showConfirm = false;
          this.isLoading = false;
        }
      });
    }
    }
  }

  resetDelete() {
    this.showConfirm = false;
    this.postToDelete = null;
  }

  onCancelDelete() {
    this.showConfirm = false;
    this.postToDelete = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  openPostModal() {
    this.showPostModal = true;
  }

  closePostModal() {
    this.showPostModal = false;
  }

  onCreatePost(post: Post) {
    this.isLoading = true;
    this.postService.createPost(post).subscribe({
      next: (created) => {
        const newPost = {
          ...created,
          id: this.nextPostId++
        };
        this.posts.unshift(newPost);
        this.showToast('Post criado com sucesso!', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao criar post', err),
        this.showToast('Erro ao criar post.', 'error');
        this.isLoading = false;
      },
    });
  }

  openEdit(post: Post) {
    this.selectedPost = { ...post };
  }

  closeEdit() {
    this.selectedPost = null;
  }

  saveEdit(updated: Post) {
    const isLocalPost = updated.id > 100;
    this.isLoading = true;
    if (isLocalPost) {
      const index = this.posts.findIndex(p => p.id === updated.id);
      if (index !== -1) {
        this.posts[index] = updated;
        this.showToast('Post editado (local)', 'success');
        this.closeEdit();
        this.isLoading = false;
      }
    } else {

    this.postService.updatePost(updated).subscribe({
      next: (editedPost) => {
        const index = this.posts.findIndex(p => p.id === editedPost.id);
        if (index !== -1) {
          this.posts[index] = editedPost;
        }
        this.closeEdit();
        this.showToast('Post editado com sucesso!', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar post', err),
        this.showToast('Erro ao atualizar post.', 'error');
        this.isLoading = false;
      }
    });
  }
  }

  loadComments() {
    this.commentService.getCommentsByPost(this.postId).subscribe({
      next: (data) => this.comments = data,
      error: (err) => console.error('Erro ao carregar comentários', err)
    });
  }

}
