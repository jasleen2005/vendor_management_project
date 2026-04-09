// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'VendorFormApp';
// }

import { Component, OnInit } from "@angular/core";
import { FormBuilder,FormGroup,Validators } from "@angular/forms";

@Component({
  selector:'app-root',
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css']
})

export class AppComponent implements OnInit{
  title ='VendorFormApp';
  vendorForm!: FormGroup;

  zones=[
    
      {code:'N', name : 'North'},
      {code:'S', name : 'South'},
      {code: 'E',name:'East'},
      {code : 'W',name:'West'}
    
  ];
  divisions=[
    {code: 'D1',name:'Divisison 1'},
    {code: 'D2',name:'Divisison 2'},
    {code: 'D3',name:'Divisison 3'}
  ];

  constructor (private fb: FormBuilder){}
  ngOnInit() {
    this.vendorForm=this.fb.group({
      zone : ['', Validators.required],
      division:['',Validators.required],
      vendor_mobile:['',[Validators.required,Validators.pattern(/^\d{10}$/)]]
    });
  }

  isInvalid(control: string): boolean{
    const ctrl = this.vendorForm.get(control);
    return !! ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onZoneChange(){
    const selectedZone=this.vendorForm.get('zone')?.value;
    console.log('Zone changed to:',selectedZone);
  }

  onSubmit(){
    if(this.vendorForm.valid){
      console.log('Form Data:',this.vendorForm.value);
    }else{
      this.vendorForm.markAllAsTouched();
    }
  }
}
