import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastService } from 'src/app/services/toast/toast.service';
import { environment } from 'src/environments/environment';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  firstName = '';
  user: any;
  subjects: any[] = [];
  groupedSubjects: { [key: string]: any[] } = {};

  studentName: any;
  studentLastname: any;
  studentPhone: any;
  studentPhysicalId: any;
  selectedStudent: any;

  modalTitle: any;

  allGrades: any[] = [];
  allStudents: any[] = [];

  selectedGrade: string | null = null;
  selectedAttachStudent: string | null = null;
  studentSearchTerm: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toast: ToastService,
    private localStorage: LocalStorageService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.user = this.localStorage.retrieve("userData")
    if (this.user) {
      this.firstName = this.user?.firstName
      this.getSubjects(this.user?.userId);
      this.getData();
    }
  }

  getData() {
    this.http.post<any>( environment.URLBACKEND + '/all-grades', { })
      .subscribe(
        response => {
          this.allGrades = response;
        },
        error => {
          console.error('Get Grades Error', error);
        }
    );
    this.http.post<any>( environment.URLBACKEND + '/all-students', { })
      .subscribe(
        response => {
          this.allStudents = response;
          this.allStudents = this.allStudents.map(student => ({
            ...student,
            fullName: `${student.first_name} ${student.last_name}`
          }));
        },
        error => {
          console.error('Get Students Error', error);
        }
    );
  }

  getSubjects(userId): void {
    this.http.post<any>( environment.URLBACKEND + '/get_students_by_grade', { userId: parseInt(userId) })
      .subscribe(
        response => {
          const userData = response;
          this.subjects = userData;
          this.groupSubjectsByGrade(userData);
        },
        error => {
          console.error('Get Students Error', error);
          this.toast.showError('Error al obtener estudiantes.');
        }
    );
  }

  groupSubjectsByGrade(subjects: any[]): void {
    this.groupedSubjects = subjects.reduce((acc, subject) => {
      if (!acc[subject.grade_description]) {
        acc[subject.grade_description] = [];
      }
      acc[subject.grade_description].push(subject);
      return acc;
    }, {});
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  newStudent(content) {
    this.modalTitle = 'NUEVO';
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  attachStudentModal(content) {
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  editStudent(content, student) {
    this.modalTitle = 'EDITAR';
    this.selectedStudent = parseInt(student.student_id);
    this.studentName = student.first_name;
    this.studentLastname = student.last_name;
    this.studentPhone = student.phone;
    this.studentPhysicalId = student.physical_id;
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  restartModal() {
    this.selectedStudent = null;
    this.studentName = null;
    this.studentLastname = null;
    this.studentPhone = null;
    this.studentPhysicalId = null;
  }

  closeModal(modal) {
    modal.dismiss();
  }

  saveStudent(modal) {
    if (this.studentName && this.studentName.trim() !== '' && 
        this.studentLastname && this.studentLastname.trim() !== '' &&
        this.studentPhone && this.studentPhone.trim() !== '') {

      if (this.selectedStudent == null) {
        this.http.post<any>( 
          environment.URLBACKEND + '/new-student', 
          { 
            name: this.studentName,
            lastname: this.studentLastname,
            phone: this.studentPhone,
            physical: this.studentPhysicalId
          })
          .subscribe(
            response => {
              this.toast.showSuccess('Estudiante creado de manera exitosa');
              this.getSubjects(this.user?.userId);
              this.restartModal();
            },
            error => {
              console.error('Get Students Error', error);
              this.toast.showError('Error al crear estudiante');
            }
        );
      } else {
        this.http.post<any>( 
          environment.URLBACKEND + '/update-student', 
          { 
            id: this.selectedStudent,
            name: this.studentName,
            lastname: this.studentLastname,
            phone: this.studentPhone,
            physical: this.studentPhysicalId
          })
          .subscribe(
            response => {
              this.toast.showSuccess('Estudiante actualizado de manera exitosa');
              this.getSubjects(this.user?.userId);
              this.restartModal();
              this.closeModal(modal);
            },
            error => {
              console.error('Get Students Error', error);
              this.toast.showError('Error al editar estudiante');
            }
        );
      }
      
    }
  }

  downloadQr(student) {
    const dataToEncode = `${student.student_id}|${student.first_name}|${student.last_name}|${environment.SECRET_KEY}`;
    QRCode.toDataURL(dataToEncode, { type: 'image/png' }, (err, url) => {
      if (err) {
        console.error('Error generando QR:', err);
        return;
      }

      this.sendQRCodeToBackend(parseInt(student.student_id), url);

      this.downloadQRCode(url, `QR_${student.first_name}_${student.last_name}.png`);
    });
  }

  sendQRCodeToBackend(studentId: number, qrCodeBase64: string) {
    const base64Data = qrCodeBase64.split(',')[1];

    this.http.post(environment.URLBACKEND + '/save-qr', { id: studentId, qrCode: base64Data }).subscribe({
      next: (response) => {
        console.log('QR guardado correctamente:', response);
      },
      error: (error) => {
        console.error('Error al guardar QR en el backend:', error);
      }
    });
  }

  downloadQRCode(qrCodeUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = fileName;
    link.click();
  }

  customSearch(term: string, item) {
    term = term.toLowerCase();
    return  item['first_name'].toLowerCase().indexOf(term) > -1 ||
            item['last_name'].toLowerCase().indexOf(term) > -1 ||
            item['phone'].toLowerCase().indexOf(term) > -1 || 
            (item['physical_id'] && item['physical_id'].toLowerCase().indexOf(term) > -1)
  }

  attachStudent(modal) {
    if (this.selectedAttachStudent && this.selectedGrade)
    this.http.post(environment.URLBACKEND + '/attach-student', { student: parseInt(this.selectedAttachStudent) , grade: parseInt(this.selectedGrade) }).subscribe({
      next: (response) => {
        this.toast.showSuccess('Estudiante asignado correctamente');
        this.getSubjects(this.user?.userId);
        this.closeModal(modal);
      },
      error: (error) => {
        console.error('Error al asignar estudiante:', error);
      }
    });
  }
}
