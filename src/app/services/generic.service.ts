import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected url: string
  ) { }

  listar() {
    return this.http.get<T[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  registrar(t: T): Observable<any> {
    return this.http.post(this.url, t);
  }

  modificar(t: T): Observable<any> {
    return this.http.put(this.url, t);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

}
