/* eslint-disable @typescript-eslint/no-unused-vars */
// WorkflowApp.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEditorDefaults } from "@pqina/pintura";
import { PinturaEditor } from "@pqina/react-pintura";
import FileStack from "@/components/UploadFile";

interface Patient {
  _id: string;
  email: string;
  fullName: string;
  patientId: string;
}

interface CreateCaseProps {
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  onCaseCreated: (caseId: string, patientId: string) => void;
}

const CreateCase: React.FC<CreateCaseProps> = ({
  selectedPatientId,
  setSelectedPatientId,
  onCaseCreated,
}) => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get("/hospital/getPatients", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Use patient._id as the identifier
        setAllPatients(res.data.Data);
        setFilteredPatients(res.data.Data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Internal Server Error");
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = allPatients.filter((patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, allPatients]);

  const copyToClipboard = (patientId: string) => {
    navigator.clipboard.writeText(patientId);
    setSelectedPatientId(patientId);
    toast.success("Patient ID copied and set as selection!");
  };

  const makeCase = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }
    try {
      const res = await axiosInstance.post(
        "/cases/postCase",
        { patientId: selectedPatientId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Extract case _id from response and propagate it upward
      const newCaseId = res.data.Data._id;
      toast.success(`Case created successfully! (Case ID: ${newCaseId})`);
      onCaseCreated(newCaseId, selectedPatientId);
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Failed to create case");
    }
  };

  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Create New Case</h2>
      <input
        type="text"
        placeholder="Search by name, email, or patient ID..."
        className="border p-2 rounded mb-4 w-full bg-gray-900 text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div
        className="mb-4 overflow-y-auto"
        style={{ maxHeight: "200px", scrollbarWidth: "thin" }}
      >
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="flex justify-between items-center p-2 border-b border-gray-700"
          >
            <div>
              <p className="text-lg">{patient.fullName}</p>
              <p className="text-sm text-gray-400">
                {patient.email} / {patient._id}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(patient._id)}
              className="bg-gray-800 hover:bg-gray-700 p-1 text-white flex items-center"
            >
              <Copy size={16} className="mr-1" /> Copy ID
            </Button>
          </div>
        ))}
      </div>
      <label className="block mb-2">Select Patient:</label>
      <div className="relative mb-4">
        <select
          className="w-full bg-gray-900 text-white p-2 rounded"
          value={selectedPatientId || ""}
          onChange={(e) => setSelectedPatientId(e.target.value)}
        >
          <option value="" disabled>
            Select a patient
          </option>
          {filteredPatients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.fullName} ({patient.email} / {patient._id})
            </option>
          ))}
        </select>
      </div>
      <Button
        onClick={makeCase}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add New Case
      </Button>
    </div>
  );
};

interface PostReportProps {
  selectedPatientId: string | null;
  caseId: string | null;
}

const PostReport: React.FC<PostReportProps> = ({ selectedPatientId, caseId }) => {
  const [reportData, setReportData] = useState({
    timeOfLastNormal: "",
    symptoms: "",
    BP: "",
    HR: "",
    O2_Saturation: "",
    documentId: "",
  });

  const makeReport = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient for the report");
      return;
    }
    if (!caseId) {
      toast.error("Please create a case before posting a report");
      return;
    }
    const payload = {
      caseId: caseId,
      patientId: selectedPatientId,
      documentId: reportData.documentId,
      timeOfLastNormal: reportData.timeOfLastNormal,
      symptoms: reportData.symptoms
        .split(",")
        .map((symptom) => symptom.trim()),
      BP: reportData.BP,
      HR: reportData.HR,
      O2_Saturation: reportData.O2_Saturation,
    };
    try {
      await axiosInstance.post("/reports/postReport", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Report posted successfully!");
    } catch (error) {
      console.error("Error posting report:", error);
      toast.error("Failed to post report");
    }
  };

  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Post Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display global case ID if available */}
        <input
          type="text"
          placeholder="Case ID"
          className="border p-2 rounded bg-gray-900 text-white"
          value={caseId || ""}
          readOnly
        />
        <input
          type="text"
          placeholder="Document ID (if available)"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.documentId}
          onChange={(e) =>
            setReportData({ ...reportData, documentId: e.target.value })
          }
        />
        <input
          type="datetime-local"
          placeholder="Time of Last Normal"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.timeOfLastNormal}
          onChange={(e) =>
            setReportData({ ...reportData, timeOfLastNormal: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Symptoms (comma separated)"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.symptoms}
          onChange={(e) =>
            setReportData({ ...reportData, symptoms: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="BP"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.BP}
          onChange={(e) =>
            setReportData({ ...reportData, BP: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="HR"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.HR}
          onChange={(e) =>
            setReportData({ ...reportData, HR: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="O2 Saturation"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.O2_Saturation}
          onChange={(e) =>
            setReportData({ ...reportData, O2_Saturation: e.target.value })
          }
        />
      </div>
      <Button
        onClick={makeReport}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
      >
        Post Report
      </Button>
    </div>
  );
};

interface PostDocumentProps {
  selectedPatientId: string | null;
  caseId: string | null;
  onDocumentCreated: (documentId: string) => void;
}

const PostDocument: React.FC<PostDocumentProps> = ({
  selectedPatientId,
  caseId,
  onDocumentCreated,
}) => {
  const [documentData, setDocumentData] = useState({
    patientId: "",
    documentName: "",
    documentType: "",
    documentUrl: "",
  });

  const makeDocument = async () => {
    if (!documentData.documentUrl) {
      toast.error("Please upload an image to obtain a document URL");
      return;
    }
    const payload = {
      caseId: caseId,
      patientId: selectedPatientId || documentData.patientId,
      documentName: documentData.documentName,
      documentType: documentData.documentType,
      documentUrl: documentData.documentUrl,
    };
    try {
      const res = await axiosInstance.post("/documents/postDocument", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Extract document _id from response and propagate it upward
      const newDocumentId = res.data.Data._id;
      toast.success(
        `Document posted successfully! (Document ID: ${newDocumentId})`
      );
      onDocumentCreated(newDocumentId);
    } catch (error) {
      console.error("Error posting document:", error);
      toast.error("Failed to post document");
    }
  };

  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Post Document</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display global case ID if available */}
        <input
          type="text"
          placeholder="Case ID"
          className="border p-2 rounded bg-gray-900 text-white"
          value={caseId || ""}
          readOnly
        />
        <input
          type="text"
          placeholder="Patient ID (if not selected)"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.patientId}
          onChange={(e) =>
            setDocumentData({
              ...documentData,
              patientId: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Document Name"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentName}
          onChange={(e) =>
            setDocumentData({
              ...documentData,
              documentName: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Document Type (e.g., pdf, jpg)"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentType}
          onChange={(e) =>
            setDocumentData({
              ...documentData,
              documentType: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Document URL"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentUrl}
          onChange={(e) =>
            setDocumentData({
              ...documentData,
              documentUrl: e.target.value,
            })
          }
        />
      </div>
      {documentData.documentUrl && (
        <p className="mt-2 text-sm text-green-400">
          Uploaded Image URL: {documentData.documentUrl}
        </p>
      )}
      <Button
        onClick={makeDocument}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
      >
        Post Document
      </Button>
    </div>
  );
};

const EditImages: React.FC = () => {
  const [src, setSrc] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSrc(URL.createObjectURL(file));
    }
  };

  const downloadImage = (imageBlob: Blob) => {
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edited-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "80vh", backgroundColor: "#1e1e1e", color: "#ffffff", padding: "20px" }}>
      {!src && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ color: "#ffffff" }}
          />
        </div>
      )}
      {src && (
        <PinturaEditor
          {...getEditorDefaults()}
          src={src}
          onProcess={(res) => {
            downloadImage(res.dest);
            setSrc(undefined);
          }}
          onClose={() => {
            setSrc(undefined);
          }}
        />
      )}
    </div>
  );
};

const WorkflowApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "createCase" | "postReport" | "postDocument" | "uploadFile" | "editImages"
  >("createCase");

  // Global states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Navigation Bar */}
      <nav className="flex space-x-4 p-4 bg-gray-900">
        <Button onClick={() => setActiveTab("createCase")} className="bg-blue-600 hover:bg-blue-700">
          Create Case
        </Button>
        <Button onClick={() => setActiveTab("postReport")} className="bg-green-600 hover:bg-green-700">
          Post Report
        </Button>
        <Button onClick={() => setActiveTab("postDocument")} className="bg-purple-600 hover:bg-purple-700">
          Post Document
        </Button>
        <Button onClick={() => setActiveTab("uploadFile")} className="bg-indigo-600 hover:bg-indigo-700">
          Upload File
        </Button>
        <Button onClick={() => setActiveTab("editImages")} className="bg-yellow-600 hover:bg-yellow-700">
          Edit Images
        </Button>
      </nav>

      {/* Main Content */}
      <div className="p-4">
        {activeTab === "createCase" && (
          <CreateCase
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            onCaseCreated={(newCaseId, patientId) => {
              setCaseId(newCaseId);
              setSelectedPatientId(patientId);
            }}
          />
        )}
        {activeTab === "postReport" && (
          <PostReport selectedPatientId={selectedPatientId} caseId={caseId} />
        )}
        {activeTab === "postDocument" && (
          <PostDocument
            selectedPatientId={selectedPatientId}
            caseId={caseId}
            onDocumentCreated={(newDocId) => setDocumentId(newDocId)}
          />
        )}
        {activeTab === "uploadFile" && (
          <div className="p-4 bg-black text-white">
            <h2 className="text-2xl font-bold mb-4">File Upload</h2>
            <FileStack />
          </div>
        )}
        {activeTab === "editImages" && <EditImages />}
      </div>
    </div>
  );
};

export default WorkflowApp;