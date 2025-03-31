import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private posts: Post[] = [];

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap(data => this.posts = data),
      catchError(error => {
        console.error('Erro ao buscar posts:', error);
        return throwError(() => error);
      })
    );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(error => {
        console.error('Erro ao criar post:', error);
        return throwError(() => error);
      })
    );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post).pipe(
      catchError(error => {
        console.error('Erro ao atualizar post:', error);
        return throwError(() => error);
      })
    );
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao excluir post:', error);
        return throwError(() => error);
      })
    );
  }  

  getInMemoryPosts(): Post[] {
    return this.posts;
  }
}
