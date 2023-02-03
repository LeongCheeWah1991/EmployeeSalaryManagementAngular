---------------------------------------------------------------------------
Leong Chee Wah Employee Salary Management Assignment
---------------------------------------------------------------------------
This is the Frontend component for the assignment. For the Backend component, please refer to the Backend Repo as follows:
https://github.com/LeongCheeWah1991/EmployeeSalaryManagementSpringBoot

This project (Employee Salary Management) is an Angular Application that consists of the following features:
- US1. Upload CSV records of Employees
- US2. Search Employees
- US3. CRUD operations related to Employees
- US4. Uploading CSV records single thread (No Concurrent Uploads)

Angular + Material UI

---------------------------------------------------------------------------
Components:
---------------------------------------------------------------------------
- employee-dashboard: Employee Dashboard
- employee-form: Employee Create/Update Form  
- employee-function-one: Temporarily component for function 1 test link
- employee-upload: Employee Upload Dialog
- prompt-dialog: Prompt Dialog for confirmation
- app.component

---------------------------------------------------------------------------
Services:
---------------------------------------------------------------------------
- employee-api.service: Service APIs for Employee

--------------------------------------------------------------------------
Cloning down the repository and setting up project
---------------------------------------------------------------------------
1. Git clone the repository: 
e.g. git clone https://github.com/LeongCheeWah1991/EmployeeSalaryManagementAngular

---------------------------------------------------------------------------
Running the application:
---------------------------------------------------------------------------
Using IDE (e.g. VSCode)
1. Browse to the directory for the code that was cloned down
2. Right-Click > Open With Code
OR
1. Open VSCode > Open Folder 
2. Browse to directory
3. Terminal > New Terminal
4. Run command: npm install
5. Run command: ng serve --proxy-config src/proxy.config.json
6. Access link: http://localhost:4200/dashboard 
   (assuming using default port of 4200)
   
   
Using Command Prompt
1. cd "directory"
   where directory is for the code that was cloned down
2. Run command: npm install
3. Run command: ng serve --proxy-config src/proxy.config.json
4. Access link: http://localhost:4200/dashboard 
   (assuming using default port of 4200)
