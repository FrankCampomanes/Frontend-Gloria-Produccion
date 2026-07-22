import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-laboratorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laboratorio.html',
  styleUrl: './laboratorio.css',
})
export class Laboratorio implements OnInit {
  pendientes: any[] = [];
  selectedLote: any = null;
  
  constructor(private cdr: ChangeDetectorRef) {}

  formData = {
    acidez: null,
    grasa: null,
    densidad: null,
    antibioticos: 'Negativo'
  };

  isSubmitting = false;
  successMessage = '';

  ngOnInit() {
    this.fetchPendientes();
  }

  async fetchPendientes() {
    try {
      const res = await fetch('http://localhost:3000/api/entregas/pendientes');
      this.pendientes = await res.json();
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Error fetching pendientes', e);
    }
  }

  seleccionarLote(lote: any) {
    this.selectedLote = lote;
    this.successMessage = '';
    this.formData = {
      acidez: null,
      grasa: null,
      densidad: null,
      antibioticos: 'Negativo'
    };
  }

  cancelar() {
    this.selectedLote = null;
  }

  async onSubmit() {
    if (!this.selectedLote) return;
    this.isSubmitting = true;
    this.cdr.detectChanges();
    
    try {
      const res = await fetch(`http://localhost:3000/api/entregas/${this.selectedLote.id}/analisis`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData)
      });

      if (res.ok) {
        const data = await res.json();
        this.successMessage = `Análisis registrado exitosamente. Resultado preliminar: ${data.resultado_lab}`;
        this.selectedLote = null;
        this.fetchPendientes();
      }
    } catch (e) {
      console.error(e);
      alert('Error al registrar análisis');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}
