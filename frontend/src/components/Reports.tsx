/* PostReport.tsx */
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface PostReportProps {
  selectedPatientId: string | null;
  caseId: string | null;
  documentId?: string | null;
}

const PostReport: React.FC<PostReportProps> = ({
  selectedPatientId,
  documentId,
  caseId,
}) => {
  const [reportData, setReportData] = useState({
    timeOfLastNormal: "",
    symptoms: "",
    BP: "",
    HR: "",
    O2_Saturation: "",
    documentId,
  });

  useEffect(() => {
    if (documentId) {
      setReportData((prevData) => ({ ...prevData, documentId }));
    }
  }, [documentId]);

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
      caseId,
      patientId: selectedPatientId,
      documentId: reportData.documentId,
      timeOfLastNormal: reportData.timeOfLastNormal,
      symptoms: reportData.symptoms.split(",").map((symptom) => symptom.trim()),
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
        <input
          type="text"
          placeholder="Case ID"
          className="border p-2 rounded bg-gray-900 text-white"
          value={caseId || ""}
          readOnly
        />
        <input
          type="text"
          placeholder="Document ID"
          className="border p-2 rounded bg-gray-900 text-white"
          value={reportData.documentId || ""}
          onChange={(e) =>
            setReportData({ ...reportData, documentId: e.target.value })
          }
          disabled={!!documentId}
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

export default PostReport;