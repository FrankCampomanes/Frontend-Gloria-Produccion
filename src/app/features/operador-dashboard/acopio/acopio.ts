import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acopio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acopio.html',
  styleUrl: './acopio.css',
})
export class Acopio {
  formData = {
    productor: '',
    cuenca: '',
    placa_cisterna: '',
    volumen: null,
    temperatura: null,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00'
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  async onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const res = await fetch('http://localhost:3000/api/entregas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData)
      });

      if (res.ok) {
        this.successMessage = 'Acopio registrado correctamente. Ya está en estado "Pendiente de Análisis".';
        // Reset form
        this.formData = {
          productor: '',
          cuenca: '',
          placa_cisterna: '',
          volumen: null,
          temperatura: null,
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00'
        };
      } else {
        this.errorMessage = 'Ocurrió un error al registrar el acopio.';
      }
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Error de conexión con el servidor.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
