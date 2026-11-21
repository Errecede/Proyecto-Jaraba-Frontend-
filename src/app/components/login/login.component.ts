import { Component, inject, signal } from '@angular/core';
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
    name: new FormControl(''),
    email: new FormControl('', [Validators.required,Validators.email ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });



  isRegisterMode = signal(false);

toggleMode() {
  const nextMode = !this.isRegisterMode();
  this.isRegisterMode.set(nextMode);

  const nameControl = this.loginForm.controls.name;
  if (nextMode) {
    nameControl.setValidators([Validators.required]);
  } else {
    nameControl.clearValidators();
    nameControl.setValue('');
  }
  nameControl.updateValueAndValidity();
}



  // Método
  // --- Envío de formulario ---

  onSubmit(){
    if (this.loginForm.invalid) return;

  const { name, email, password } = this.loginForm.getRawValue();

  if (this.isRegisterMode()) {
    this.authService.register({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
    }).subscribe({
      next: () => {
        alert('Cuenta creada con éxito. Ya puedes iniciar sesión.');
        this.toggleMode();
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        alert('No se pudo crear la cuenta. Revisa los datos o si el correo ya existe.');
      },
    });
    return;
  }

  this.authService.login({
    email: email ?? '',
    password: password ?? '',
  }).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']);
    },
    error: (erro) => {
      console.error('Error al iniciar sesión', erro);
      alert('DATOS DE AUTENTICACION NO VALIDOS O ERROR DEL SERVER');
    },
  });
}
  //   if(this.loginForm.invalid) return;

  //   this.authService.login(this.loginForm.value as {
  //     email: string;
  //     password: string;
  //   }).subscribe({ next: () => {
  //     this.router.navigate(['/dashboard']);
  //   },
  //   error: (erro) => {
  //     console.error('Error al iniciar sesión', erro);
  //     alert('DATOS DE AUTENTICACION NO VALIDOS O ERROR DEL SERVER');
  //   }
  // })
  // } primera version...

}
