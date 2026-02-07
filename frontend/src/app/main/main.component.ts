import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, ModalElements } from '../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

interface RecordModel {
  _id?: string;
  ip: string;
  label: string;
  comment: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatPaginatorModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  dataSource =  new MatTableDataSource<RecordModel>([]);
  displayedColumns: string[] = ['ip', 'label', 'comment','actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  
  record: RecordModel = this.newEmptyRecord();
  constructor(private api: ApiService, private dialog: MatDialog, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords(page: number = 1, limit: number = 10): void {
    this.api.getAPIs(page, limit).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;

        this.totalRecords = res.pagination.totalRecords;
        this.pageSize = res.pagination.limit;
        this.currentPage = res.pagination.currentPage;
        if (this.paginator) {
          this.paginator.length = this.totalRecords;
          this.paginator.pageIndex = this.currentPage - 1;
        }
        console.log(this.dataSource)
      },
      error: (err) => {
        console.error('Unable to get data', err);
      }
    })
  }

  onPageChange(event: PageEvent): void {
    console.log(event)
    this.pageSize = event.pageSize;
    this.getRecords(event.pageIndex + 1, event.pageSize);
  }

  recordFields: ModalElements[] = [
    { key: 'ip', label: 'IP', required: true, pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$' },
    { key: 'label', label: 'Label' },
    { key: 'comment', label: 'Comment' }
  ];

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: { record: this.newEmptyRecord(), isEdit: false, fields: this.recordFields }
    });

    dialogRef.afterClosed().subscribe(newData => {
      console.log(newData)
      if(newData) {
        this.api.addIP(newData).subscribe({
          next: (result: any) => {
            this.getRecords(this.currentPage, this.pageSize);
            this.snackbar.open(result.message, 'Close', { duration: 3000 });
          }
        })
      }
    })
  }

  openEditModal(record: RecordModel): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: { record: { ...record }, isEdit: true, fields: this.recordFields }
    })

    dialogRef.afterClosed().subscribe(updatedData => {
      if (updatedData) {
        console.log(updatedData)
        this.api.editIP(updatedData._id, updatedData).subscribe({
          next: (result: any) => {
            this.getRecords(this.currentPage, this.pageSize);
            this.snackbar.open(result.message, 'Close', { duration: 3000 });
          },
          error: (err) => {
            console.error('Update failed', err)
          }
        });
      }
    })
  }

  openDeleteModal(record: RecordModel): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: { isConfirm: true,title: 'Delete Record',
      message: `Are you sure you want to delete IP "${record.ip}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel' }
    });

    dialogRef.afterClosed().subscribe(confirmation => {
      if(confirmation) {
        console.log('FOR DELETE:', record)
        this.api.deleteIP(record._id!).subscribe({
          next: (result: any) => {
            this.getRecords(this.currentPage, this.pageSize);
            this.snackbar.open(result.message, 'Close', {duration: 3000});
          },
          error: (err) => {
            console.error('Delete failed', err)
            this.snackbar.open(err.error.message)
          }
        })
      }
    })
  }

  editRecord(record: RecordModel): void {
    this.record = { ...record };
    console.log(this.record)
  }

  private newEmptyRecord(): RecordModel {
    return { ip: '', label: '', comment: '' };
  }
}
