import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  //validaciones basicas del form de entrada
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });


  // Método
  // --- Envío de formulario ---

  onSubmit(){
    if(this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value as {
      email: string;
      password: string;
    }).subscribe({ next: () => {
      this.router.navigate(['/dashboard']);
    },
    error: (erro) => {
      console.error('Error al iniciar sesión', erro);
      alert('DATOS DE AUTENTICACION NO VALIDOS O ERROR DEL SERVER');
    }
  })
  }

}
