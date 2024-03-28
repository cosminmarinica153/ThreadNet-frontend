import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICategory } from '@apiModel/ICategory';
import { IThread } from '@apiModel/IThread';
import { CreateCategoryDto } from '@dto/CreateCategoryDto';
import { environment } from 'environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategory[]>{
    return this.http.get<ICategory[]>(environment.baseUrl + "Category/getAll");
  }

  getThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(environment.baseUrl + `Category/getThreads${id}`);
  }

  getPopular(count: number): Observable<ICategory[]>{
    return this.http.get<ICategory[]>(environment.baseUrl + `Category/getTopCategories${count}`);
  }

  postCategory(category: CreateCategoryDto): Observable<ICategory> {
    return this.http.post<ICategory>(environment.baseUrl + "Category/createCategory", category).pipe(
      map(data => {return data}),
      catchError(error => {
            if (error.status === 404)
                return throwError(() => new Error('Name not unique'));
            else
                return throwError(() => new Error('Something went wrong'));
        })
    );
  }

  getThreadsSignal(id: number){
    return toSignal<IThread[], IThread[]>(this.getThreads(id), {initialValue: []});
  }

}
