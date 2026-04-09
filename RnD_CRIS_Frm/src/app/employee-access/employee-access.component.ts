
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Vendor {
  id: string;
  vendor_name: string;
  vendor_location: string;
  vendor_mobile: string;
  vendor_email: string;
  vendor_address_line1: string;
  vendor_address_line2: string;
  vendor_address_state: string;
  vendor_address_pincode: string;
  zone: string;
  division: string;
  nodal_person_name: string;
  nodal_person_contact: string;
  nodal_person_email: string;
  location_codes: string;
  vendor_status: string;
  attachment: string;
  pdf_file_url: string;
}

interface Subscriber {
  id: string;
  subscriber_id: string;
  display_device: string;
  services_required: string;
  url: string;
}

@Component({
  selector: 'app-employee-access',
  templateUrl: './employee-access.component.html',
  styleUrls: ['./employee-access.component.css']
})
export class EmployeeAccessComponent implements OnInit {
  vendors: Vendor[] = [];
  subscribers: Subscriber[] = [];
  filteredVendors: Vendor[] = [];
  filteredSubscribers: Subscriber[] = [];

  filter: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVendors();
    this.fetchSubscribers();
  }

  fetchVendors() {
    this.http.get<Vendor[]>('http://localhost:8000/api/vendor/')
      .subscribe({
        next: (data) => {
          console.log('Vendors from API:', data);
          this.vendors = data;
          this.filteredVendors = [...this.vendors]; // copy without filtering
        },
        error: (err) => {
          console.error('Error fetching vendors:', err);
        }
      });
  }

  fetchSubscribers() {
    this.http.get<Subscriber[]>('http://localhost:8000/api/subscribers/')
      .subscribe({
        next: (data) => {
          console.log('Subscribers from API:', data);
          this.subscribers = data;
          this.filteredSubscribers = [...this.subscribers]; // copy without filtering
        },
        error: (err) => {
          console.error('Error fetching subscribers:', err);
        }
      });
  }

  applyFilter() {
    const filterValue = this.filter.toLowerCase();
    this.filteredVendors = this.vendors.filter(v =>
      v.vendor_name?.toLowerCase().includes(filterValue)
    );
    this.filteredSubscribers = this.subscribers.filter(s =>
      s.subscriber_id?.toLowerCase().includes(filterValue)
    );
  }

  sortVendors() {
    this.filteredVendors.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));
  }

  sortSubscribers() {
    this.filteredSubscribers.sort((a, b) => a.subscriber_id.localeCompare(b.subscriber_id));
  }
}
