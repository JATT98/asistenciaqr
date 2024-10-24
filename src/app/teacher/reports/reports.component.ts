import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastService } from 'src/app/services/toast/toast.service';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jspdf, { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  firstName = '';
  user: any;

  attendanceData: any[] = [];
  groupedData: any = {};

  today: any;
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    private toast: ToastService,
    private localStorage: LocalStorageService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.user = this.localStorage.retrieve("userData");
    this.today = new Date();
    if (this.user) {
      this.firstName = this.user?.firstName
      this.getData();
    }
  }

  getData() {
    this.http.post<any>( environment.URLBACKEND + '/reporte', { teacher: parseInt(this.user.userId) })
      .subscribe(
        response => {
          this.attendanceData = response;
          this.groupData();
        },
        error => {
          console.error('Get Report Error', error);
          this.toast.showError('Error al obtener reportes');
        }
    );
  }

  groupData(): void {
    const groupedByGrade = this.attendanceData.reduce((acc, item) => {
      const { 
        grade_id, 
        grade_description, 
        subject_id, 
        subject_description, 
        start_time, 
        end_time, 
        student_id, 
        first_name, 
        last_name, 
        phone, 
        physical_id, 
        attendance_status 
      } = item;

      let grade = acc.find(g => g.grade_id === grade_id);
      if (!grade) {
        grade = {
          grade_id,
          grade_description,
          subjects: []
        };
        acc.push(grade);
      }

      let subject = grade.subjects.find(s => s.subject_id === subject_id);
      if (!subject) {
        subject = {
          subject_id,
          subject_description,
          start_time,
          end_time,
          students: []
        };
        grade.subjects.push(subject);
      }

      subject.students.push({
        student_id,
        first_name,
        last_name,
        phone,
        physical_id,
        attendance_status
      });

      return acc;
    }, []);

    this.groupedData = groupedByGrade;
  }

  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.attendanceData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'Reporte_Asistencia_' + this.today.toISOString().split('T')[0] + '.xlsx');
  }

  async printRapport() {
    html2canvas(document.querySelector("#printreport")).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(contentDataURL, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('Reporte_Asistencia_' + this.today.toISOString().split('T')[0] + '.pdf');   
    });
  }

}
