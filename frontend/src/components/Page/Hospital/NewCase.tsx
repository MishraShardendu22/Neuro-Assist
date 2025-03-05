/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import CreateCase from "../../Case";
import PostReport from "../../Reports";
import EditImages from "../../EditImage";
import PostDocument from "../../PostDocuments";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { PickerOverlay } from "filestack-react";

const WorkflowApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "createCase" | "postReport" | "postDocument" | "uploadFile" | "editImages"
  >("createCase");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_FILESTACK_API_KEY as string;
  const options = {
    accept: [
      ".pdf",
      ".doc",
      ".csv",
      ".ppt",
      ".txt",
      ".xls",
      ".pptx",
      ".docx",
      ".xlsx",
      "image/*",
      "video/*",
      "image/png",
      "image/jpeg",
    ],
    fromSources: ["url", "camera", "local_file_system"],
    transformations: {
      crop: true,
      circle: true,
      rotate: true,
    },
    maxFiles: 5,
    storeTo: {
      location: "s3",
    },
  };

  const onSuccess = (result: any) => {
    console.log("Upload success:", result);
    if (result.filesUploaded && result.filesUploaded.length > 0) {
      const uploadedUrl = result.filesUploaded[0].url;
      toast.success("File uploaded successfully!");
      setFileUrl(uploadedUrl);
    }
  };

  const onError = (error: any) => {
    console.error("Upload error:", error);
    toast.error("File upload failed");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
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
        {activeTab === "postReport" && <PostReport selectedPatientId={selectedPatientId} caseId={caseId} documentId={documentId}/>}
        {activeTab === "postDocument" && (
          <PostDocument
            caseId={caseId}
            fileUrl={fileUrl}
            selectedPatientId={selectedPatientId}
            onDocumentCreated={(newDocId) => setDocumentId(newDocId)}
          />
        )}
        {activeTab === "uploadFile" && (
          <div className="p-4 bg-black text-white">
            <h2 className="text-2xl font-bold mb-4">File Upload</h2>
            {apiKey ? (
              <div>
                <h2>Upload Files</h2>
                <PickerOverlay
                  apikey={apiKey}
                  onError={onError}
                  onSuccess={onSuccess}
                  pickerOptions={options}
                />
              </div>
            ) : (
              <div>FileStack API Key not found!</div>
            )}
          </div>
        )}
        {activeTab === "editImages" && <EditImages />}
      </div>
    </div>
  );
};

export default WorkflowApp;