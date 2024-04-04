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
  url: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategory[]>{
    return this.http.get<ICategory[]>(this.url + "Category/getAll");
  }

  getByName(name: string): Observable<ICategory>{
    return this.http.get<ICategory>(this.url + "Category/getByName" + name);
  }

  getThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(this.url + `Category/getThreads${id}`);
  }

  getPopular(count: number): Observable<ICategory[]>{
    return this.http.get<ICategory[]>(this.url + `Category/getTopCategories${count}`);
  }

  postCategory(category: CreateCategoryDto): Observable<ICategory> {
    return this.http.post<ICategory>(this.url + "Category/createCategory", category).pipe(
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
