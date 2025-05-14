import { Component } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  Title: string = "New Comment";
  name: string = '';
  comment: string = '';
  comments: Array<{ name: string, comment: string, time: string }> = [];
  editIndex: number | null = null; // เก็บดัชนีของ comment ที่กำลังแก้ไข

  // ฟังก์ชันบันทึกหรืออัปเดต comment
  submitComment() {
    const currentTime = this.formatDate(new Date()); // เก็บเวลาปัจจุบันในรูปแบบที่ต้องการ
    if (this.editIndex !== null) {
      // แก้ไขความคิดเห็นที่มีอยู่
      this.comments[this.editIndex] = {
        name: this.name,
        comment: this.comment,
        time: currentTime
      };
      this.editIndex = null;
    } else {
      // เพิ่มความคิดเห็นใหม่
      this.comments.push({
        name: this.name,
        comment: this.comment,
        time: currentTime
      });
    }
    this.saveToLocalStorage();
    this.clearForm();
  }

  // ฟังก์ชันแก้ไข comment
  editComment(index: number) {
    const selectedComment = this.comments[index];
    this.name = selectedComment.name;
    this.comment = selectedComment.comment;
    this.editIndex = index;
  }

  // ฟังก์ชันลบ comment
  deleteComment(index: number) {
    this.comments.splice(index, 1);
    this.saveToLocalStorage();
  }

  // ฟังก์ชันล้างแบบฟอร์ม
  clearForm() {
    this.name = '';
    this.comment = '';
  }

  // เก็บข้อมูลลง local storage
  saveToLocalStorage() {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

  // ดึงข้อมูลจาก local storage
  loadFromLocalStorage() {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      this.comments = JSON.parse(storedComments);
    }
  }

  // ฟังก์ชันจัดรูปแบบวันที่
  formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short', // Jan, Feb, Mar...
      day: '2-digit', // 01, 02, 03...
      year: 'numeric', // 2023, 2024...
      hour: '2-digit', // 01, 02, 03...
      minute: '2-digit', // 01, 02, 03...
      hour12: true, // ใช้ AM/PM
    });
  }

  // เรียกข้อมูลเมื่อเริ่มต้น
  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
