# **User Types**

1. **Patient (`/patient`)**
2. **Hospital (`/hospital`)**

---

## **Patient Routes (`/patient`)**

### **Authentication**

1. **POST** `/login` → Authenticate a patient.
2. **POST** `/register` → Register a new patient.

### **Report & History**

3. **POST** `/verifyPatient` → Verify Admin using JWT.
4. **GET** `/report/:id` → Retrieve a specific report.
5. **GET** `/reports` → Retrieve all available reports.

### **Profile Management**

6. **GET** `/profile` → Get patient profile details.
7. **PUT** `/profile` → Update patient profile details.

### **Patient Data Model**

```json
{
  "role": "Patient",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "createdAt": "timestamp",
  "patientId": "Unique ID",
  "updatedAt": "timestamp",
  "gender": "Male" | "Female"
}
```

---

## **Hospital Routes (`/hospital`)**

### **Authentication**

1. **POST** `/login` → Authenticate a hospital.
2. **POST** `/register` → Register a new hospital.
3. **POST** `/verifyHospital` → Register a new hospital.

### **Case Management**

4. **GET** `/cases` → Retrieve all cases.
5. **POST** `/cases` → Create a new case.
6. **DELETE** `/cases/:id` → Remove a case.
7. **PUT** `/cases/:id` → Update a specific case.
8. **GET** `/cases/:id` → Retrieve a specific case.

### **Case Data Model**

```json
{
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "patientId": "Reference to patient",
  "hospitalId": "Reference to hospital",
  "status": "Pending" | "Approved" | "Rejected"
}
```

---

### **Image Management**

_(Images are stored as documents with `documentType` set to `"image"`.)_

9. **DELETE** `/cases/images/:id` → Remove specific images.
10. **GET** `/cases/images/:id` → Get images related to a specific case.
11. **POST** `/cases/images/:id` → Upload images (CT, MRI, etc.) for a case.
12. **PUT** `/cases/images/:id` → Update images for a case (e.g., add annotations or replace images).

### **Image Data Model**

```json
{
  "documentType": "image",
  "documentUrl": "string",
  "documentName": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "caseId": "Reference to case",
  "patientId": "Reference to patient"
  // (Annotations can be handled within the document metadata if required.)
}
```

---

### **Report & Document Management**

13. **GET** `/documents/:id` → Retrieve a specific document.
14. **DELETE** `/documents/:id` → Remove an uploaded document.
15. **GET** `/cases/:id/reports` → Fetch generated reports for a case.
16. **POST** `/documents` → Upload additional PDFs or supporting documents.
17. **POST** `/reports/send` → Send a report to a patient (via email or hospital system).

### **Report Data Model**

```json
{
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "BP": "string (optional)",
  "HR": "string (optional)",
  "caseId": "Reference to case",
  "timeOfLastNormal": "timestamp",
  "patientId": "Reference to patient",
  "O2_Saturation": "string (optional)",
  "symptoms": ["array of symptom strings"],
  "document": "Reference to associated document (optional)"
}
```

### **Document Data Model**

```json
{
  "documentUrl": "string",
  "documentName": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "caseId": "Reference to case",
  "patientId": "Reference to patient",
  "documentType": "pdf" | "doc" | "docx" | "image"
}
```

---

### **Emergency & Quick Actions**

18. **POST** `/emergency/activate` → Activate emergency protocol (e.g., Code Stroke).

---

### **Guidelines & Notifications**

29. **GET** `/notifications` → Retrieve alerts and notifications.

---

### **Additional Notes**

- **Report Summary:**  
  The report summary for each case includes key findings such as:

  - **Diagnosis:** e.g., "Large Vessel Occlusion Detected"
  - **Treatment Recommendations:** e.g., "Eligible for Thrombolysis"
  - **Critical Values:** Highlighting abnormal lab results or vital signs.

- **Data Relationships:**  
  Cases reference patients and hospitals via their unique IDs. Documents (including images and reports) are stored in separate collections and are linked to cases using a `caseId`. This normalized approach keeps collections independent, although you may choose to embed document/report IDs within a case document for performance reasons if needed.

- **Timestamps:**  
  Most data models include `createdAt` and `updatedAt` fields to help with tracking and querying.

#### The report summary is specific to an individual case. Each case goes through data entry, image upload, and lab input, and then the system generates a summary of the key findings. This could include:

#### Diagnosis (e.g., "Large Vessel Occlusion Detected")

#### Treatment Recommendations (e.g., "Eligible for Thrombolysis")

#### Critical Values (highlighting abnormal lab results or vitals)
