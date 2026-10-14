import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8081/certificates";

export default function App() {
  const [certificateId, setCertificateId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("ECE");
  const [issueDate, setIssueDate] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");

  async function loadCertificates() {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setCertificates(response.data || []);
    } catch (error) {
      setMessage("Unable to reach the backend server.");
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  async function addCertificate(e) {
    e.preventDefault();

    if (!certificateId.trim() || !studentName.trim()) {
      setMessage("Please enter Certificate ID and Student Name.");
      return;
    }

    const certificate = {
      certificateId: certificateId.trim(),
      studentName: studentName.trim(),
      course: course.trim() || "ECE",
      issueDate,
      dept: course.trim() || "ECE",
      status: "VALID"
    };

    try {
      const response = await axios.post(`${API_URL}/add`, certificate);
      setMessage(response.data || "Certificate added successfully!");
      setCertificateId("");
      setStudentName("");
      setCourse("ECE");
      setIssueDate("");
      await loadCertificates();
    } catch (error) {
      setMessage(error.response?.data || "Failed to add certificate.");
    }
  }

  async function verifyCertificate() {
    const id = certificateId.trim();

    if (!id) {
      setMessage("Please enter a Certificate ID to verify.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/verify/${encodeURIComponent(id)}`);
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || "Certificate verification failed.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Digital Certificate Verification System</h1>
        <p>Secure • Simple • Instant Verification</p>
      </header>

      <section className="panel">
        <h2>Add Certificate</h2>

        <form onSubmit={addCertificate}>
          <label>Certificate ID</label>
          <input
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Example: CERT101"
          />

          <label>Student Name</label>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name"
          />

          <label>Course / Department</label>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Example: ECE"
          />

          <label>Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />

          <button type="submit">Add Certificate</button>
          <button type="button" className="verify" onClick={verifyCertificate}>
            Verify Certificate
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <h2>Certificate Records</h2>

        {certificates.length === 0 ? (
          <p>No certificates added yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Issue Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((item, index) => (
                  <tr key={`${item.certificateId || item.id}-${index}`}>
                    <td>{item.certificateId || item.id}</td>
                    <td>{item.studentName}</td>
                    <td>{item.course || item.dept || item.subject || "—"}</td>
                    <td>{item.issueDate || "—"}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>Digital Certificate Verification System · Project Demo</footer>
    </main>
  );
}