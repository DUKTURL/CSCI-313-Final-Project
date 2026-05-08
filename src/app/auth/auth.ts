import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../user.service';
import { routes } from '../app.routes';

@Component({
  selector: 'user-auth-root',
  imports: [FormsModule],
  templateUrl: 'auth.html',
  styleUrl: 'auth.css',
})
export class UserAuth {
  // Injecting UserService from user.service.ts
  userService = inject(UserService);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  pageState = signal<string>('');
  accCreationError = signal<string>('');

  // This is the hook method that will be called when the component is initialized
  ngOnInit() {
    this.userService.loadUsers();
  }
  //method called when user clicks on the Add User button.
  addUser() {
    const user: User = { name: this.name(), email: this.email(), password: this.password() };
    if (user.name.length > 0 && user.email.length > 0 && user.password.length > 0) {
      this.userService.addUser(user);
      this.resetForm();
      this.pageState.set('login');
      this.accCreationError.set('');
    } else {
      this.accCreationError.set('');
      if (user.name.length == 0) {
        this.accCreationError.update((value) => value + 'n');
      }
      if (user.email.length == 0) {
        this.accCreationError.update((value) => value + 'e');
      }
      if (user.password.length == 0) {
        this.accCreationError.update((value) => value + 'p');
      }
    }
  }
  //resets form
  resetForm() {
    this.name.set('');
    this.email.set('');
    this.password.set('');
  }

  prepUpdateUser(user: User) {
    this.name.set(user.name);
    this.email.set(user.email);
    this.password.set(user.password);
  }

  updateUser() {
    const user: User = { name: this.name(), email: this.email(), password: this.password() };
    this.userService.updateUser(this.userService.getCurrentUser()?.id!, user);
    this.resetForm();
    this.pageState.set('register');
  }

  validateUser(): true | false {
    for (const user of this.userService.users()) {
      if (
        user.name.toLowerCase() == this.name().toString().toLowerCase() &&
        user.email.toLowerCase() == this.email().toString().toLowerCase() &&
        user.password.toLowerCase() == this.password().toString().toLowerCase()
      ) {
        this.resetForm();
        return true;
      }
    }
    return false;
  }

  loginUser() {
    const user: User = { name: this.name(), email: this.email(), password: this.password() };
    if (this.validateUser()) {
      this.userService.currentUser.set(user);
    }
  }

  registerUser() {
    this.resetForm();
    this.pageState.set('register');
  }

  logout() {
    this.userService.currentUser.set(null);
  }
}
