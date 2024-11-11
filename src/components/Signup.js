import React, { useState } from "react";
import '../style/signup.css';
import axios from "axios";

export default function Signup() {
  // State to manage form inputs
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [repeatPassword, setRepeatPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Function to handle form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (password !== repeatPassword) {
  //     alert('Passwords do not match!');
  //     return;
  //   }

  //   let userData = JSON.stringify({
  //     name: name,
  //     username: email,
  //     password: password
  //   });

  //   console.log("UserData:", userData);

  //   fetch('http://localhost:8080/api/users/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: userData
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Success:', data);
  //     let error = "";
  //     for (const key in data) {
  //         if (data.hasOwnProperty(key)) {
  //           error += `${key}: ${data[key]}` + "\n";
  //           if(key === "user message") {
  //             break;
  //           }
  //         }
  //     }
  //     alert(error)
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    axios
      .post("http://localhost:8080/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("User added successfully:", response.data);
        alert("User added successfully");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        alert("Error adding user");
      });
  };

  return (
    <>
      <section
        className="vh-100 bg-image"
        style={{
          backgroundImage:
            "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
        }}
      >
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">
                      Create an account
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="form3Example1cg"
                          className="form-control form-control-lg"
                          placeholder="eg: Jahn Doe"
                          onChange={handleInputChange}
                          value={user.name}
                          name="name"
                          required
                        />
                        <label className="form-label" htmlFor="form3Example1cg">
                          Your Name
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form3Example3cg"
                          className="form-control form-control-lg"
                          placeholder="eg: jahn.doe@gmail.com"
                          onChange={handleInputChange}
                          value={user.username}
                          name="username"
                          required
                        />
                        <label className="form-label" htmlFor="form3Example3cg">
                          Your Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form3Example4cg"
                          className="form-control form-control-lg"
                          placeholder="eg: Jahn.Doe@2024#UK"
                          onChange={handleInputChange}
                          value={user.password}
                          name="password"
                          required
                        />
                        <label className="form-label" htmlFor="form3Example4cg">
                          Password
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form3Example4cdg"
                          className="form-control form-control-lg"
                          placeholder="eg: Jahn.Doe@2024#UK"
                          onChange={handleInputChange}
                          value={user.repeatPassword}
                          name="repeatPassword"
                          required
                        />
                        <label
                          className="form-label"
                          htmlFor="form3Example4cdg"
                        >
                          Repeat your password
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <h6>Image</h6>
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          onChange={handleImageChange}
                        />
                      </div>

                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value=""
                          id="form2Example3cg"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form2Example3g"
                        >
                          I agree to all statements in{" "}
                          <a href="#!" className="text-body">
                            <u>Terms of service</u>
                          </a>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Have already an account?{" "}
                        <a href="#!" className="fw-bold text-body">
                          <u>Login here</u>
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
