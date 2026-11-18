import { DashboardService } from './../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private AuthService = inject(AuthService);
  private DashboardService = inject(DashboardService);

  isAtTop = signal<boolean>(true);
  balance = signal<number>(0);    //Para mandar el {{}} al html.
  transactions = signal<any[]>([])


  //COntroles modales.
  activeModal = signal<'none'|'transfer'|'withdraw'>('none');
  transferAmount: number | null=null;
  transferReceiver ='';


  ngOnInit(){
    this.loadBalance();
    this.loadHistory();
  }
  //DInero
  loadBalance(){
    this.DashboardService.getBalance().subscribe({
      next: (resp) => {
        let finalBalance = 0;
        if(typeof resp === 'number'){
          finalBalance=resp;
        }else{
          finalBalance = resp.balance ?? 0;
        }

        this.balance.set(finalBalance);
      },
      error: (err) => console.log('Error al obtener el saldo:', err)
    })
  }

  //registrarHistorialMovimientos
  loadHistory(){
    this.DashboardService.getHistory().subscribe({
      next: (data)=>{
        this.transactions.set(data);
      },
      error: (err) => console.log('Error al cargar historial:', err),
    });
  }


//para abrir y cerrar
  openModal(type: 'transfer' | 'withdraw'){
    this.activeModal.set(type);
  }
  closeModal(){
    this.activeModal.set('none');
    this.transferReceiver='';
    this.transferAmount = null;

  }



  //Transferencia que ejecuta back
  executeTransfer(){
    if (!this.transferReceiver || !this.transferAmount || this.transferAmount <= 0) {
      alert('Ingresa un correo de destino válido y un monto mayor a 0');
      return;
    }

    this.DashboardService.transfer(this.transferReceiver, this.transferAmount).subscribe({
      next: (resp) => {
        console.log('Transferencia exitosa:', resp);
        this.loadBalance();
        this.closeModal();
        this.loadHistory();
      },
      error: (err) => {
        console.error('Error en la transferencia:', err);
        alert(err.error?.message || 'Hubo un error al realizar la transferencia');
      }
    });
  }





  @HostListener('window:scroll', [])
  onWindowScroll(){
    const scrollPosition = window.scrollY ||  document.documentElement.scrollTop ||0
    this.isAtTop.set(scrollPosition <= 15);
  }




  logout(){
    this.AuthService.logout();
  }
}
