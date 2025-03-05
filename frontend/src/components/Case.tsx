/* CreateCase.tsx */
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default CreateCase;
