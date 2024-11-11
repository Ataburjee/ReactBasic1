import React, { useState, useEffect } from "react";
import "../style/home.css";
import { useParams } from "react-router-dom"; // Import useParams

export default function Home() {
  const { userId } = useParams();
  const [content, setContent] = useState(""); // Track content change
  const [documents, setDocuments] = useState([]); // Hold the document array by fetching API
  const [selectedDocument, setSelectedDocument] = useState(null); // Track the selected document
  const [title, setTitle] = useState("No Document Selected!"); // Track title change
  const [userName, setUserName] = useState(""); // Set profile name
  const [showModal, setShowModal] = useState(false); // For showing/hiding modal
  const [newDocumentName, setNewDocumentName] = useState("");

  // Debugging: Log whenever showModal changes
  useEffect(() => {
    console.log("showModal state changed:", showModal);
  }, [showModal]);

  // Fetch userDetails from localStorage and set userName
  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const parsedUserDetails = JSON.parse(storedUserDetails);
      console.log("userDetails =", parsedUserDetails);
      setUserName(parsedUserDetails.user.name || "Unknown User");
    }
  }, []);

  // Fetch documents from the API with token
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const storedUserDetails = localStorage.getItem("userDetails");
        const parsedUserDetails = JSON.parse(storedUserDetails);
        console.log("User id =", parsedUserDetails.user.id);
        const response = await fetch(
          `http://localhost:8080/${parsedUserDetails.user.id}/documents`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedUserDetails.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await response.json();
        console.log(
          "Documents of user " + parsedUserDetails.user.id + " =",
          data.documents
        );
        setDocuments(data.documents[0]);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [userId]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setContent(document.content); // Set the editor content to the document's content
    setTitle(document.title); // Set the title to the document's title
  };

  const handleUpdateDocument = async () => {
    if (!selectedDocument) {
      alert("Please select a document first");
      return;
    }

    try {
      const storedUserDetails = localStorage.getItem("userDetails");
      const parsedUserDetails = JSON.parse(storedUserDetails);

      let requestBody = JSON.stringify({
        owner: parsedUserDetails.user.id,
        title: title,
        content: content,
      });

      // Make API call to save the document content
      const response = await fetch(
        `http://localhost:8080/documents/${selectedDocument.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUserDetails.token}`,
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save document");
      }
      const data = await response.json();
      console.log("Parsed response data:", data);
      alert(data.message);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  // Creating new document with a name
  const handleCreateNewButton = () => {
    setShowModal((prevState) => {
      console.log("Previous modal state:", prevState);
      return true; // Ensure that this line always sets it to true
    });
  };

  let handleCreateDocument = () => {
    console.log({ showModal });
    const storedUserDetails = localStorage.getItem("userDetails");
    const parsedUserDetails = JSON.parse(storedUserDetails);
    console.log("New document name:", newDocumentName);
    let requestBody = JSON.stringify({
      title: newDocumentName,
      owner: parsedUserDetails.user.id,
    });

    fetch("http://localhost:8080/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsedUserDetails.token}`,
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => {
        let message = data.message;
        alert(message ? message : data["user message"]);
        console.log("Create new:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setShowModal(false); // Hide the modal after saving
  };

  return (
    <div>
      {/* <div className={`home-container ${showModal ? "blur-background" : ""}`}> */}
        {/* Toolbar */}
        <header className="toolbar">
          <div className="toolbar-actions">
            <button>File</button>
            <button>Edit</button>
            <button>View</button>
            <button>Insert</button>
            <button>Format</button>
            <button>Tools</button>
          </div>
          <div className="share-user">
            <button className="btn-area">Share</button>
            <div className="user-profile">
              <span>{userName}</span>
              <img src="https://via.placeholder.com/40" alt="User Profile" />
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="main-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Documents</h3>
            <ul>
              {documents.length > 0 ? (
                documents.map((document, index) => (
                  <li key={index} onClick={() => handleDocumentClick(document)}>
                    {document.title}
                  </li>
                ))
              ) : (
                <li>No documents available!</li>
              )}
            </ul>
          </aside>

          <div className="temp">
            <div className="layout-header">
              <input
                type="text"
                className="title-change-area"
                value={title}
                onChange={handleTitleChange}
                disabled={!selectedDocument}
              />
              <button
                type="button"
                className="btn-area"
                onClick={handleCreateNewButton}
              >
                + CREATE NEW
              </button>
            </div>

            {/* Document Editor */}
            <div className="editor">
              <textarea
                placeholder="Start writing here..."
                value={
                  selectedDocument
                    ? content
                    : "Please select a document or create a new one!"
                }
                onChange={handleContentChange}
                disabled={!selectedDocument}
                className="document-textarea"
              />
              {/* Button container aligned to the right below the text area */}
              <div className="save-button-container">
                <button onClick={handleUpdateDocument} className="save-button">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Document</h3>
            <input
              type="text"
              placeholder="Enter document name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              className="document-name-input"
            />
            <button
              onClick={() => {
                console.log("Create button clicked");
                handleCreateDocument();
              }}
              className="create-cancel-btn"
            >
              Create
            </button>
            <button
              onClick={() => {
                console.log("Cancel button clicked");
                setShowModal(false);
              }}
              className="create-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
