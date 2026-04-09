
import { Component } from '@angular/core';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})


export class EmailComponent {

  subject: string = 'test subject';
  message: string = 'test message';
  recipientEmail: string = 'abc@gmail.com';
  responseMessage: string = '';

  constructor(private emailService: EmailService) {}

  sendEmail() {
    this.emailService
      .sendEmail(this.subject, this.message, this.recipientEmail)
      .subscribe(
        (response) => {
          this.responseMessage = 'Email sent successfully!';
        },
        (error) => {
          this.responseMessage = 'Failed to send email.';
        }
      );
  }
}







  
