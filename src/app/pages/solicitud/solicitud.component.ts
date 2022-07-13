import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilesService } from 'src/app/services/files.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { Solicitud } from 'src/app/models/solicitud.model';
import * as moment from 'moment';
import Swal from 'sweetalert2';

interface TipoDoc {
  id: number;
  value: string;
}

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public tiposDoc: TipoDoc[] = [];
  public archivos!: FileList;
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private filesService: FilesService,
    private solicitudService: SolicitudService,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarTipoDoc();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  crearFormulario() {
    let regExLetrasEspacios = "[a-zA-ZÀ-ÿ ]+";
    let regExCorreo = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    let regExNumeros = "[0-9.]+";

    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apePaterno: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apeMaterno: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExCorreo)]],
      telMovil: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(regExNumeros)]],
      telFijo: ['', [Validators.minLength(7), Validators.pattern(regExNumeros)]],
      tipoDoc: ['', [Validators.required]],
      tipoDocText: [''],
      numDoc: ['', [Validators.required]],
      fechaDoc: ['', [Validators.required]],
      asuntoDoc: ['', [Validators.required, Validators.minLength(5)]],
      decJurada: ['', [Validators.required]],
      decJuradaText: [''],
    });
  }

  cargarTipoDoc() {
    this.tiposDoc = [
      { 'id': 1, 'value': 'SOLICITUD' },
      { 'id': 2, 'value': 'CARTA' },
      { 'id': 3, 'value': 'OFICIO' },
      { 'id': 4, 'value': 'OTRO DOCUMENTO' }
    ];
  }

  changeTipoDoc() {
    let formulario = this.form.value;
    let tipo = this.tiposDoc.filter(el => el.id == formulario.tipoDoc);
    this.form.get("tipoDocText")?.setValue(tipo[0].value);
  }

  seleccionarArchivo(event: any) {
    let file = event.target.files[0];
    if (!file) return false;

    let fileSize = file.size;
    let fileArray = (file.name).split(".");
    let fileExtension = fileArray[1];

    if (fileSize > 26214400) {
      event.srcElement.value = null;
      this.snackBar.open("El peso máximo del archivo es: 25MB", "AVISO", { duration: 2000 });
      return false;
    }

    if (fileExtension.toLowerCase() != "pdf") {
      event.srcElement.value = null;
      this.snackBar.open("El formato aceptado del archivo es: PDF", "AVISO", { duration: 2000, });
      return false;
    }

    this.archivos = event.target.files;
    return true;
  }

  changeDecJurada() {
    let formulario = this.form.value;
    (formulario.decJurada == 1) ? this.form.get("decJuradaText")?.setValue('SI') : this.form.get("decJuradaText")?.setValue('NO');
  }

  guardarDatos() {
    let formulario = this.form.value;

    if (this.form.invalid) {
      this.snackBar.open('Debe completar los campos obligatorios (*) para registrar la información', 'AVISO', { duration: 2000 });
      return false;
    }

    if (!this.archivos) {
      this.snackBar.open('Debe seleccionar el Documento Adjunto', 'AVISO', { duration: 2000 });
      return false;
    }

    if (formulario.decJurada != 1) {
      this.snackBar.open('Debe seleccionar SI en la Declaración Jurada', 'AVISO', { duration: 2000 });
      return false;
    }

    let archivo = this.archivos.item(0);
    if (archivo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.filesService.upload(archivo).subscribe(
        response => {
          if (response.estado == '1') {
            this.registrarDatos(formulario, response.archivo);
          } else {
            this.snackBar.open('Error al subir el Documento Adjunto', 'ERROR', { duration: 2000 });
          }
        }
      );
    }

    return true;
  }

  registrarDatos(formulario: any, docAdjunto: string) {
    let newRegistro = new Solicitud(null);
    newRegistro.nombres = formulario.nombres;
    newRegistro.apePaterno = formulario.apePaterno;
    newRegistro.apeMaterno = formulario.apeMaterno;
    newRegistro.direccion = formulario.direccion;
    newRegistro.correo = formulario.correo;
    newRegistro.telMovil = formulario.telMovil;
    newRegistro.telFijo = formulario.telFijo;
    newRegistro.idTipoDoc = formulario.tipoDoc;
    newRegistro.tipoDoc = formulario.tipoDocText;
    newRegistro.numDoc = formulario.numDoc;
    newRegistro.fechaDoc = moment(new Date(formulario.fechaDoc)).format('DD/MM/YYYY');
    newRegistro.asuntoDoc = formulario.asuntoDoc;
    newRegistro.docAdjunto = docAdjunto;
    newRegistro.decJurada = formulario.decJuradaText;
    newRegistro.estadoReg = 1;
    newRegistro.fechaReg = moment(new Date()).format('DD/MM/YYYY');

    this.solicitudService.registrar(newRegistro).subscribe(
      response => {
        if (response) {
          this.enviarCorreo(response);

          Swal.fire({
            title: 'AVISO',
            text: 'Solicitud registrada correctamente',
            icon: 'success',
            confirmButtonColor: '#bf0909',
            confirmButtonText: 'ACEPTAR',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.value) {
              window.location.reload();
            }
          });
        } else {
          this.snackBar.open('Error al registrar la solicitud', 'ERROR', { duration: 2000 });
        }
      }
    );
  }

  enviarCorreo(response: any) {
    let idSolicitud = (response.idSolicitud).toString();
    let host = window.location.href;
    let webUrl = host.replace('/#/solicitud', '');
    this.solicitudService.enviarCorreo(idSolicitud, webUrl).subscribe();
  }

}
