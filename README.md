1.1 Purpose

The purpose of this document is to specify the requirements for a vendor management system
that facilitates the submission, approval, and management of vendor details by different user
roles: Admin (CRIS) and Railway (Rly) users.

1.2 Scope
The application will allow Rly users to input vendor details through a form and submit them
for approval to CRIS users.

1.3 Definitions, Acronyms, and Abbreviations
 Rly User: Railway user who submits vendor details.
 CRIS User: Administrator (CRIS Engineer) who approves vendor submissions in
API gateway.
 Vendor ID/ Subscriber ID: Unique identifier for vendors.

2. Overall Description
2.1 Product Perspective
The application will be a web-based application that interacts with a database for storing
vendor information. It will consist of two main user interfaces: one for Rly users and one for
CRIS(Admin) users.

2.2 Product Functions
 Rly users can input vendor details.
 Admin users Responsible for approving vendor submissions; has access to all vendor
data.
 Vendor IDs or Subscriber IDs are based on the vendor details provided in the
application.

2.3 Users Roles
Admin User:
o Review Vendor submission
o approve vendor submissions.
o Create application.
o Create application policy.
o Define number of locations to be served by vendor per day .
Rly User:
Inputs vendor data; requires approval from Admin to proceed with ID creation.

2.4 Operating Environment
 Web browser (Chrome, Firefox, Safari).
 Frontend - Yet to be decided - ( Angular/Django etc)
 Database - Yet to be decided - (MySQL/PostgreSQL etc)

2.5 Design and Implementation Constraints
 The system must comply with data protection regulations.

2.6 Assumptions and Dependencies
 Users will have internet access.
 All users will have unique login credentials.

3. Specific Requirements
4. 
3.1 Functional Requirements
3.1.1 Vendor Details Submission by Rly User
 Input Fields:
o Zone Code (4 chars - dropdown)
o Div Code (4 chars - dropdown)
o Company Name (text)
o Vendor/Company Address (text area)
o Vendor Mobile No (10 digits)
o Vendor/Company Email ID (email format)
o Nodal Railway Person Name (text)
o Contact No of Railway Person (10 digits)
o Railway Person Email ID (email format)
o Location Codes/Number of Locations (text)
o Type of display device (dropdown) - possible values are
 Touch Screen
 Kiosk
 LCD Screen
o New/Existing Vendor (dropdown)
o Service required (dropdown) possible values are
 (Chart Display (For chart related queries)
 Static queries
 Dynamic Queries
 Actions:
o Rly user submits the vendor details.

o The system sends an approval request to the Admin user.

3.1.2 Vendor Approval by Admin User
 Functionality:
o CRIS user receives notification of a new vendor submission.
o CRIS user reviews the details.
o CRIS user can approve or reject the submission.
o CRIS sends approval status back to the Rly user.

3.1.3 Vendor ID Creation
 Functionality:
o Upon approval, the Rly user can create a Vendor ID or Subscriber ID.
o The system generates and stores the unique ID ( with max 12 char denoting
the company name and location of the vendor. Eg. played_ers.
(Vendor company name)_(location name)

4. Steps are to be done in API gateway

4.1 Application Creation
 Functionality:
o Create application division wise for the subscriber and subscribe the API.
Application name would be
"EI_<customizedApplicationPolicyName>_APP<seq_no>" where seq no is
kept to accommodate the same vendor providing services to more than 25
locations of same division or service in another division. eg.
EI_PALYAD_ERS_TVC_APP1

4.2 Application Policy Creation
 Functionality:
o Create new application policy with name <vendor code/subscriber id (max 12
chars)>_<4digitDIVcode> eg PALYAD_ERS_TVC with rate limiting as
follows.
i. If requirement is for dynamic query or static query then
(20000+10000)*No of locations to be served by vendor per day
ii. If requirement is for chart display then (12000)*No of locations to be
served by vendor per day. for example TVC requirement where PNR
status & Fare Enquiry is asked for 19 stations it would be
(20000+10000) *19 = 570000 per day.

5. External Interface Requirements
5.1 User Interfaces
 Rly User Interface:
o Form for vendor details submission with appropriate input validation.
 Admin User Interface:
o Dashboard for reviewing pending submissions.
o Approval/rejection options for each submission.

5.2 Hardware Interfaces
 Not applicable for this application.
5.3 Software Interfaces
 Database interface for storing and retrieving vendor information.
5.4 Communication Interfaces
 Email notifications for submission and approval status.
5.5 Non-Functional Requirements
5.6 Performance Requirements
 The system should handle up to 100 concurrent users without performance
degradation.
5.7 Security Requirements
 User authentication and authorization must be implemented.
 Sensitive data must be encrypted during transmission.
5.8 Usability Requirements
 The user interface should be intuitive and require minimal training.
5.9 Reliability Requirements
 The system should be operational 99% of the time.
5.10 Maintainability Requirements
 Code should follow best practices for easy maintenance.

6.1 Glossary
 Rly User: User responsible for vendor submissions.
 CRIS User: User responsible for approving vendor submissions, creating application
and application polices.
