import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { addPersona } from "../store/personaSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ADD_PERSONA = gql`
  mutation AddPersona($input: PersonaInput!, $persona_image: Upload) {
    addPersona(input: $input, persona_image: $persona_image) {
      id
      name
      persona_image
    }
  }
`;

export default function AddPersona() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [persona, setPersona] = useState({
    name: "",
    quote: "",
    description: "",
    motivation: "",
    pain_points: "",
    jobs_needs: "",
    activites: "",
  });

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addPersonaMutation] = useMutation(ADD_PERSONA);

  const handleChange = (e) => {
    setPersona({ ...persona, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (field, value) => {
    setPersona({ ...persona, [field]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
      e.target.value = "";
    }
  };

  const handleSavePersona = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await addPersonaMutation({
        variables: {
          input: { ...persona },
          persona_image: file, 
        },
      });

      dispatch(addPersona(data.addPersona));
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding persona:", err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg w-100 h-100 overflow-auto">
        <img
          src={previewImage || "https://via.placeholder.com/1200x300.png?text=Persona+Image"}
          className="card-img-top"
          style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }}
          alt="Persona Background"
        />
        <div className="p-3">
          <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
            Change Image
          </button>
          <div className="mt-4 p-3 rounded">
            <h5 className="text-black">Persona Name</h5>
            <input
              type="text"
              className="form-control border-0 fw-bold fs-4 p-0"
              style={{ outline: "none", background: "transparent", boxShadow: "none" }}
              value={persona.name}
              onChange={handleChange}
              name="name"
              placeholder="Enter name"
            />
          </div>
        </div>

        <div className="card-body">
          <div className="row g-4">
            {["quote", "description", "motivation"].map((field) => (
              <div className="col-md-4" key={field}>
                <label className="form-label fw-bold">{field.replace("_", " ").toUpperCase()}</label>
                <textarea
                  className="form-control border-0"
                  name={field}
                  rows="5"
                  style={{ resize: "none", outline: "none", background: "transparent", boxShadow: "none" }}
                  value={persona[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            {["pain_points", "jobs_needs", "activites"].map((field) => (
              <div className="col-md-4" key={field}>
                <label className="form-label fw-bold">{field.replace("_", " ").toUpperCase()}</label>
                <ReactQuill
                  theme="snow"
                  value={persona[field]}
                  onChange={(value) => handleQuillChange(field, value)}
                  style={{ height: "100px" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between mt-5">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
            CLOSE
          </button>
          <button className="btn btn-success btn-lg" onClick={handleSavePersona}>
            CREATE
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Persona Image</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                {previewImage && <img src={previewImage} className="img-fluid mb-3" alt="Preview" />}
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
