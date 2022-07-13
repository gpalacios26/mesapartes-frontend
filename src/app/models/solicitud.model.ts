export class Solicitud {

  constructor(
    public idSolicitud: number | null,
    public nombres?: string,
    public apePaterno?: string,
    public apeMaterno?: string,
    public direccion?: string,
    public correo?: string,
    public telMovil?: string,
    public telFijo?: string,
    public idTipoDoc?: number,
    public tipoDoc?: string,
    public numDoc?: string,
    public fechaDoc?: string,
    public asuntoDoc?: string,
    public docAdjunto?: string,
    public decJurada?: string,
    public estadoReg?: number,
    public fechaReg?: string,
  ) { }
}
