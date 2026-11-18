import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject,  Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class DashboardService{
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';


  getBalance(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}` );

    return this.http.get<any>(`${this.apiUrl}/users/balance`, {headers})
  }



  transfer(receiverEmail: string, amount: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/transactions/transfer`, { receiverEmail, amount }, { headers });
  }

  getHistory() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/transactions`, { headers });
  }
}
