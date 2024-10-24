import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastService } from 'src/app/services/toast/toast.service';
import { environment } from 'src/environments/environment';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firstName = '';
  user: any;
  subjects: any[] = [];
  groupedSubjects: { [key: string]: any[] } = {};

  gradeName: any;

  modalTitle: any;

  subjectName: any;
  selectedGrade: any;
  selectedSubject: any;
  section: any;
  startTime: any;
  endTime: any;
  tolerancy: any;

  allGrades: any;

  selectedLector: any;
  subjectLector: any;
  tolerancyLector: any;
  activationLector: any;

  isLate = false;

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
  }

  getSubjects(userId): void {
    this.http.post<any>( environment.URLBACKEND + '/get_subjects_by_teacher', { userId: parseInt(userId) })
      .subscribe(
        response => {
          const userData = response;
          this.subjects = userData;
          this.groupSubjectsByGrade(userData);
        },
        error => {
          console.error('Get Subjects Error', error);
          this.toast.showError('Error al obtener cursos.');
        }
    );
  }

  groupSubjectsByGrade(subjects: any[]): void {
    this.groupedSubjects = subjects.reduce((acc, subject) => {
      if (!acc[subject.grade_name]) {
        acc[subject.grade_name] = [];
      }
      acc[subject.grade_name].push(subject);
      return acc;
    }, {});
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  newGrade(content) {
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  newSubject(content) {
    this.modalTitle = 'NUEVA';
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  editSubject(content, subject) {
    this.modalTitle = 'EDITAR';
    this.subjectName = subject.subject_name;
    this.selectedGrade = subject.grade_id;
    this.section = subject.section;
    this.startTime = subject.start_time;
    this.endTime = subject.end_time;
    this.tolerancy = subject.tolerancy_in_minutes;
    this.selectedSubject = subject.subject_id;
    this.modalService.open(content, {size: 'lg', centered: true });
  }

  saveGrade(modal) {
    if (this.gradeName && this.gradeName.trim() !== '')
    this.http.post<any>( 
      environment.URLBACKEND + '/new-grade', 
      { 
        grade: this.gradeName
      })
      .subscribe(
        response => {
          this.toast.showSuccess('Grado creado de manera exitosa');
          this.getSubjects(this.user?.userId);
          this.restartGradeModal();
          this.getData();
        },
        error => {
          console.error('Get Grades Error', error);
          this.toast.showError('Error al crear grado');
        }
    );
  }

  saveSubject(modal) {
    if (this.subjectName && this.subjectName.trim() !== '' &&
        this.selectedGrade && this.selectedGrade.trim() !== '' &&
        this.section && this.section.trim() !== '' &&
        this.startTime && this.startTime.trim() !== '' &&
        this.endTime && this.endTime.trim() !== '' &&
        this.tolerancy && this.tolerancy.trim() !== '')

      if (this.selectedSubject == null) {
        this.http.post<any>( 
          environment.URLBACKEND + '/new-subject', 
          { 
            description: this.subjectName,
            grade: parseInt(this.selectedGrade),
            section: this.section,
            teacher: parseInt(this.user.userId),
            startTime: this.startTime,
            endTime: this.endTime,
            tolerancy: this.tolerancy,
          })
          .subscribe(
            response => {
              this.toast.showSuccess('Materia creada de manera exitosa');
              this.getSubjects(this.user?.userId);
              this.restartSubjectModal();
            },
            error => {
              console.error('Get Grades Error', error);
              this.toast.showError('Error al crear materia');
            }
        );
      } else {
        this.http.post<any>( 
          environment.URLBACKEND + '/update-subject', 
          { 
            subjectId: parseInt(this.selectedSubject),
            description: this.subjectName,
            grade: parseInt(this.selectedGrade),
            section: this.section,
            teacher: parseInt(this.user.userId),
            startTime: this.startTime,
            endTime: this.endTime,
            tolerancy: this.tolerancy,
          })
          .subscribe(
            response => {
              this.toast.showSuccess('Materia actualizada de manera exitosa');
              this.getSubjects(this.user?.userId);
              this.restartSubjectModal();
              modal.dismiss();
            },
            error => {
              console.error('Get Grades Error', error);
              this.toast.showError('Error al actualizar materia');
            }
        );
      }
  }

  restartGradeModal() {
    this.gradeName = null;
  }

  restartSubjectModal() {
    this.subjectName = null;
    this.selectedSubject = null;
    this.selectedGrade = null;
    this.section = null;
    this.startTime = null;
    this.endTime = null;
    this.tolerancy = null;
  }

  viewSubject(modal, subject) {
    const now = new Date().toString().split(' ')[4];
    let[hrs , min] = now.split(':');
    const interval = hrs+':'+min;
    
    this.activationLector = interval;
    this.tolerancyLector = subject.tolerancy_in_minutes
    this.subjectLector = parseInt(subject.subject_id);

    this.isLate = false;

    this.http.post<any>( 
      environment.URLBACKEND + '/active-lector', 
      { 
        subjectId: parseInt(this.subjectLector),
        teacherId: parseInt(this.user.userId),
        activation: interval
      })
      .subscribe(
        response => {
          this.selectedLector = parseInt(response[0].lector_id);
          this.modalService.open(modal, {size: 'lg', centered: true });
        },
        error => {
          console.error('Get QR Scanner Error', error);
        }
    );
  }

  handleQrCode(qrCodeData: string) {
    const [studentId, firstName, lastName, uniqueId] = qrCodeData.split('|');

    const currentTime = new Date();
    const currentHourMinute = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const isWithinInterval = this.checkTimeWithinInterval(currentHourMinute, this.activationLector, this.tolerancyLector);
    const status = isWithinInterval ? 1105 : 1106;

    const attendanceData = {
      student_id: parseInt(studentId),
      subject_id: this.subjectLector,
      time: currentHourMinute,
      status: !this.isLate ? status : 1106
    };

    this.registrarAsistencia(attendanceData, firstName + ' ' + lastName);
  }

  registrarAsistencia(payload: any, name: any) {
    this.http.post<any>( 
      environment.URLBACKEND + '/registrar-asistencia', payload).subscribe(response => {
      this.toast.showSuccess(name + ', asistencia registrada.');
    });
  }

  checkTimeWithinInterval(currentTime: string, intervalo: string, tolerancy: string): boolean {
    const [intervalHour, intervalMinute] = intervalo.split(':').map(Number);
    const [toleranceMinute, toleranceSecond = '0'] = tolerancy.split(':').map(Number);

    const intervalDate = new Date();
    intervalDate.setHours(intervalHour, intervalMinute, 0, 0);

    const currentDate = new Date();
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    currentDate.setHours(currentHour, currentMinute, 0, 0);

    const finalDate = new Date(intervalDate);
    finalDate.setMinutes(intervalDate.getMinutes() + toleranceMinute);
    finalDate.setSeconds(intervalDate.getSeconds() + Number(toleranceSecond));

    return currentDate >= intervalDate && currentDate <= finalDate;
  }
}
