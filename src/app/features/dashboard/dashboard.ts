import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, AfterViewInit {
  activeTab: string = 'panel';
  
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef;
  pieChart: any;
  barChart: any;

  stats: any = {
    volumenMes: 0,
    tasaAprobacion: 0,
    totalMerma: 0,
    productorEstrella: { productor: 'N/A', total_volumen: 0 },
    graficoPie: [],
    graficoCuencas: []
  };

  entregas: any[] = [];
  filtroEstado: string = 'Todos';
  filtroBusqueda: string = '';
  
  loteSeleccionado: any = null;
  razonRechazo: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  ngAfterViewInit() {
    // Charts will be rendered after fetching stats
  }

  async fetchStats() {
    try {
      const res = await fetch('http://localhost:3000/api/entregas/admin/stats');
      this.stats = await res.json();
      this.renderCharts();
    } catch (e) {
      console.error('Error fetching admin stats', e);
    }
  }

  async fetchEntregas() {
    try {
      let url = \`http://localhost:3000/api/entregas?estado=\${this.filtroEstado}\`;
      if (this.filtroBusqueda) {
        url += \`&buscar=\${this.filtroBusqueda}\`;
      }
      const res = await fetch(url);
      this.entregas = await res.json();
    } catch (e) {
      console.error('Error fetching entregas', e);
    }
  }

  renderCharts() {
    if (this.pieChartCanvas && this.stats.graficoPie.length > 0) {
      if (this.pieChart) this.pieChart.destroy();
      const labels = this.stats.graficoPie.map((g: any) => g.estado);
      const data = this.stats.graficoPie.map((g: any) => g.cantidad);
      const colors = labels.map((l: string) => l === 'Aprobado' ? '#4CAF50' : (l === 'Rechazado' ? '#F44336' : '#FFC107'));
      
      this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors
          }]
        },
        options: { responsive: true }
      });
    }

    if (this.barChartCanvas && this.stats.graficoCuencas.length > 0) {
      if (this.barChart) this.barChart.destroy();
      const labels = this.stats.graficoCuencas.map((g: any) => g.cuenca);
      const data = this.stats.graficoCuencas.map((g: any) => parseFloat(g.total_volumen));
      
      this.barChart = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Volumen Aportado (L)',
            data: data,
            backgroundColor: '#005baa'
          }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
    }
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'panel') {
      this.fetchStats();
      setTimeout(() => this.renderCharts(), 100);
    } else if (tabName === 'dictamen') {
      this.fetchEntregas();
    }
  }

  aplicarFiltros() {
    this.fetchEntregas();
  }

  abrirModalRechazo(lote: any) {
    this.loteSeleccionado = lote;
    this.razonRechazo = '';
  }

  cerrarModal() {
    this.loteSeleccionado = null;
  }

  async emitirDictamen(lote: any, estado: 'Aprobado' | 'Rechazado') {
    if (estado === 'Rechazado' && !this.razonRechazo) {
      alert('Debe especificar una razón de rechazo');
      return;
    }

    try {
      const res = await fetch(\`http://localhost:3000/api/entregas/\${lote.id}/dictamen\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, razon_rechazo: estado === 'Rechazado' ? this.razonRechazo : null })
      });

      if (res.ok) {
        alert(\`Lote \${estado} exitosamente.\`);
        this.cerrarModal();
        this.fetchEntregas(); // Refrescar tabla
      }
    } catch (e) {
      console.error(e);
      alert('Error al emitir dictamen');
    }
  }

  exportarReporte() {
    alert('Exportando historial a PDF...');
    window.print();
  }

  logout(): void {
    this.authService.logout();
  }
}
