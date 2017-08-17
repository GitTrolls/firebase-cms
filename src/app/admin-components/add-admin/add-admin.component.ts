import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  newEmail: string;
  newRole: string;

  constructor(
    public db: AngularFireDatabase,
    public snackBar: MdSnackBar,
    public router: Router
  ) {
    this.newRole = 'non-approver';
  }

  ngOnInit() {
  }

  addAdmin(newEmail: string, newRole: string) {
    if (newEmail && newRole) {

      this.db.object('/admins/' + this.hashCode(newEmail)).set({
        email: newEmail,
        role: newRole,
        active: false
      });

      this.newEmail = null;
      this.newRole = null;

      let snackBarRef = this.snackBar.open('Admin saved', 'OK!', {
        duration: 3000
      });

      setTimeout(() => {
        this.router.navigateByUrl('admin/admins');
      }, 3300);
    } else if (!newEmail) {
      let snackBarRef = this.snackBar.open('You must add an email for the user', 'OK!', {
        duration: 3000
      });
    } else if (!newRole) {
      let snackBarRef = this.snackBar.open('You must add a role for the user', 'OK!', {
        duration: 3000
      });
    }
  }

  hashCode(input:string) {
    let hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
      chr   = input.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

}
