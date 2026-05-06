import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../user.service';

@Component({
  selector: 'user-auth-root',
  imports: [FormsModule],
  templateUrl: 'auth.html',
  styleUrl: 'auth.css',
})
export class UserAuth {
  title = 'practice-firestore-crud';

  // Injecting UserService from user.service.ts
  userService = inject(UserService);

  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');

  selectedUser = signal<User | null>(null);
  pageState = signal<string>('');

  // This is the hook method that will be called when the component is initialized
  ngOnInit() {
    this.userService.loadUsers();
  }
  //method called when user clicks on the Add User button.
  addUser() {
    const user: User = { name: this.name(), email: this.email(), password: this.password() };
    this.userService.addUser(user);
    this.resetForm();
  }
  //resets form
  resetForm() {
    this.name.set('');
    this.email.set('');
    this.password.set('');
    this.selectedUser.set(null);
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    this.name.set(user.name);
    this.email.set(user.email);
    this.password.set(user.password);
  }

  updateUser() {
    const user: User = { name: this.name(), email: this.email(), password: this.password() };
    this.userService.updateUser(this.selectedUser()?.id!, user);
    this.resetForm();
  }

  loginUser() {}

  registerUser() {
    this.resetForm();
    this.pageState.set("register");
  }
}
