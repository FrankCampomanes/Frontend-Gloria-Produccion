import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Acopio } from './acopio/acopio';
import { Laboratorio } from './laboratorio/laboratorio';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-operador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Acopio, Laboratorio],
  templateUrl: './operador-dashboard.html',
  styleUrls: ['./operador-dashboard.css']
})
export class OperadorDashboard implements OnInit, AfterViewInit {
  activeTab: string = 'resumen';
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;

  stats: any = {
    hoy: { cantidad: 0, volumen_total: 0 },
    ultimasCisternas: [],
    grafico: []
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  ngAfterViewInit() {
    // Chart will be rendered when stats are loaded
  }

  async fetchStats() {
    try {
      const res = await fetch('http://localhost:3000/api/entregas/operador/stats');
      this.stats = await res.json();
      this.renderChart();
    } catch (e) {
      console.error('Error fetching stats', e);
    }
  }

  renderChart() {
    if (!this.chartCanvas) return;
    
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.stats.grafico.map((g: any) => {
      const d = new Date(g.fecha);
      return d.toLocaleDateString();
    });
    const data = this.stats.grafico.map((g: any) => parseFloat(g.total_volumen));

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Volumen Recibido (L)',
          data: data,
          backgroundColor: '#005baa',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'resumen') {
      this.fetchStats();
      setTimeout(() => this.renderChart(), 100);
    }
  }

  exportPdf() {
    alert('Generando PDF del reporte del turno...');
    window.print();
  }

  logout(): void {
    this.authService.logout();
  }
}
