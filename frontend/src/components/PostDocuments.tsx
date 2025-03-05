/* PostDocument.tsx */
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface PostDocumentProps {
  selectedPatientId: string | null;
  caseId: string | null;
  fileUrl: string | null;
  onDocumentCreated: (documentId: string) => void;
}

const PostDocument: React.FC<PostDocumentProps> = ({
  selectedPatientId,
  caseId,
  fileUrl,
  onDocumentCreated,
}) => {
  const [documentData, setDocumentData] = useState({
    patientId: "",
    documentUrl: "",
    documentType: "",
    documentName: "",
  });

  // Automatically update documentUrl when fileUrl prop changes
  useEffect(() => {
    if (fileUrl) {
      setDocumentData((prevData) => ({ ...prevData, documentUrl: fileUrl }));
    }
  }, [fileUrl]);

  const makeDocument = async () => {
    // Prioritize the fileUrl from Filestack; if not present, fallback to manual input
    const finalDocumentUrl = fileUrl || documentData.documentUrl;
    if (!finalDocumentUrl) {
      toast.error("Please upload an image to obtain a document URL");
      return;
    }
    const payload = {
      caseId: caseId,
      documentUrl: finalDocumentUrl,
      documentType: documentData.documentType,
      documentName: documentData.documentName,
      patientId: selectedPatientId || documentData.patientId,
    };
    try {
      const res = await axiosInstance.post("/documents/postDocument", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const newDocumentId = res.data.Data._id;
      toast.success(`Document posted successfully! (Document ID: ${newDocumentId})`);
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
            setDocumentData({ ...documentData, patientId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Document Name"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentName}
          onChange={(e) =>
            setDocumentData({ ...documentData, documentName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Document Type (e.g., pdf, jpg)"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentType}
          onChange={(e) =>
            setDocumentData({ ...documentData, documentType: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Document URL"
          className="border p-2 rounded bg-gray-900 text-white"
          value={documentData.documentUrl}
          onChange={(e) =>
            setDocumentData({ ...documentData, documentUrl: e.target.value })
          }
          disabled={!!fileUrl} // Disable manual edit if fileUrl is provided
        />
      </div>
      {documentData.documentUrl && (
        <p className="mt-2 text-sm text-green-400">
          Uploaded Image URL: {documentData.documentUrl}
        </p>
      )}
      <Button onClick={makeDocument} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
        Post Document
      </Button>
    </div>
  );
};

export default PostDocument;
