import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { GlobalService } from '../../../services/global.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.scss']
})
export class AdminCustomersComponent {

  customers: Observable<any[]>;
  selectedOption: any;
  dialogRef: MatDialogRef<any>;
  currentAdmin: any;

  constructor(
    public db: AngularFireDatabase,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public globalService: GlobalService
  ) {
    this.customers = db.list('/users').snapshotChanges();

    this.globalService.admin.subscribe((a) => {
      this.currentAdmin = a;
    });
  }

  deleteCustomer(event, key: string) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      if (this.selectedOption === 'delete') {
        this.db.object('/users/' + key).remove();

        let snackBarRef = this.snackBar.open('Customer deleted', 'OK!', {
          duration: 3000
        });
      }
    });
  }
}
