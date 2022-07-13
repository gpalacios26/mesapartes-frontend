import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = `${environment.HOST}/api`;

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private http: HttpClient
  ) { }

  upload(data: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("file", data);

    return this.http.post(`${base_url}/files/upload`, formData);
  }

  download(name: string) {
    return this.http.get(`${base_url}/files/download/${name}`, {
      responseType: 'blob'
    });
  }

}
