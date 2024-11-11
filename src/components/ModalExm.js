import React, { useState, useEffect } from "react";
import "../style/Modal.css";
import "../style/home.css";

export default function ModalExm() {
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userName, setUserName] = useState(""); // Set profile name
  const [documents, setDocuments] = useState([]); // Hold the document array by fetching API
  const [title, setTitle] = useState("No Document Selected!"); // Track title change
  const [selectedDocument, setSelectedDocument] = useState(null); // Track the selected document
  const [content, setContent] = useState(""); // Track content change
  const [isViewClicked, setIsViewClicked] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const parsedUserDetails = JSON.parse(storedUserDetails);
      console.log("userDetails =", parsedUserDetails);
      setUserName(parsedUserDetails.user.name || "Unknown User");
    }

    const fetchDocuments = async () => {
      try {
        const storedUserDetails = localStorage.getItem("userDetails");
        const parsedUserDetails = JSON.parse(storedUserDetails);

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
  }, []);

  const createDocumentFunction = () => {
    alert("Changes Saved!");
    setIsCreateNewModalOpen(false);
  };

  const selectedDocumentFunction = (document) => {
    setSelectedDocument(document);
    setContent(document.content); // Set the editor content to the document's content
    setTitle(document.title); // Set the title to the document's title
  };

  const updateDocumentFunction = async () => {
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

  const shareDocumentFunction = async () => {
    if (!selectedDocument) {
      alert("Please select a document first");
      return;
    }

    try {
      const storedUserDetails = localStorage.getItem("userDetails");
      const parsedUserDetails = JSON.parse(storedUserDetails);
      let accessType = [];
      if(isViewClicked) accessType.push("VIEWER");
      if (isEditClicked) accessType.push("EDITOR");
      if (isCommentClicked) accessType.push("COMMENTER");

      let requestBody = JSON.stringify({
        owner: parsedUserDetails.user.id,
        recipientEmail: recipientEmail,
        accessType: accessType,
      });
      console.log("requestBody:", requestBody);

      // Make API call to share the document
      const response = await fetch(
        `http://localhost:8080/documents/${selectedDocument.id}/share`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUserDetails.token}`,
          },
          body: requestBody,
        }
      );
      const data = await response.json();
      console.log("Parsed response data:", data);
      alert(data.message? data.message : data["user message"]);

    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  return (
    <div className="App">
      {/* <button onClick={openModal}>Open Modal</button> */}
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
          <button
            className={`btn-area ${!selectedDocument ? "disabled" : ""}`}
            onClick={() => setIsShareModalOpen(true)}
          >
            Share
          </button>
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
                <li
                  key={index}
                  onClick={() => selectedDocumentFunction(document)}
                >
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
              onChange={(e) => setTitle(e.target.value)}
              disabled={!selectedDocument}
            />
            <button
              type="button"
              className="btn-area"
              onClick={() => setIsCreateNewModalOpen(true)}
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
              onChange={(e) => setContent(e.target.value)}
              disabled={!selectedDocument}
              className="document-textarea"
            />
            {/* Button container aligned to the right below the text area */}
            <div className="save-button-container">
              <button
                className={`save-button ${!selectedDocument ? "disabled" : ""}`}
                onClick={updateDocumentFunction}
                disabled={!selectedDocument}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCreateNewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Document</h2>
            <label>Enter Document name:</label>
            <input
              placeholder="Document title..."
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
            />
            <div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setIsCreateNewModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={createDocumentFunction}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {isShareModalOpen && selectedDocument && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Share Document</h2>
            <label>Recipient Email:</label>
            <input
              placeholder="eg: doinic.torreto@gmail.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <div className="access-layer">
              <label>Give access:</label>
              <div className="access-type-div">
                <button
                  className={`${
                    !isViewClicked
                      ? "btn btn-secondary btn-sm"
                      : "btn btn-primary btn-sm"
                  }`}
                  type="button"
                  onClick={() => {
                    setIsViewClicked((prev) => !prev);
                    console.log("view:", isViewClicked);
                  }}
                >
                  View
                </button>
                <button
                  className={`${
                    !isEditClicked
                      ? "btn btn-secondary btn-sm"
                      : "btn btn-primary btn-sm"
                  }`}
                  type="button"
                  onClick={() => {
                    setIsEditClicked((prev) => !prev);
                    console.log("view:", isEditClicked);
                  }}
                >
                  Edit
                </button>
                <button
                  className={`${
                    !isCommentClicked
                      ? "btn btn-secondary btn-sm"
                      : "btn btn-primary btn-sm"
                  }`}
                  type="button"
                  onClick={() => {
                    setIsCommentClicked((prev) => !prev);
                    console.log("view:", isCommentClicked);
                  }}
                >
                  Comment
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setIsShareModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={shareDocumentFunction}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}