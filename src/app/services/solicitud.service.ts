import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Solicitud } from '../models/solicitud.model';

const base_url = `${environment.HOST}/api/solicitudes`;

@Injectable({
  providedIn: 'root'
})
export class SolicitudService extends GenericService<Solicitud> {

  constructor(
    protected override http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  enviarCorreo(idSolicitud: string, webUrl: string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("idSolicitud", idSolicitud);
    formData.append("webUrl", webUrl);

    return this.http.post(`${base_url}/notificar`, formData);
  }

}
