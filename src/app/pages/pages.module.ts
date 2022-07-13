import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';

import { SolicitudComponent } from './solicitud/solicitud.component';

@NgModule({
  declarations: [
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  exports: [
    SolicitudComponent
  ]
})
export class PagesModule { }
