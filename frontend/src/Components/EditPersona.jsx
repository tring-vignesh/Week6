  import { useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { useSelector, useDispatch } from "react-redux";
  import { useMutation, useQuery, gql } from "@apollo/client";
  import { updatePersona, deletePersona } from "../store/personaSlice";
  import "bootstrap/dist/css/bootstrap.min.css";
  import ReactQuill from "react-quill";
  import "react-quill/dist/quill.snow.css";

  const GET_PERSONA = gql`
    query GetPersona($id: ID!) {
      getPersona(id: $id) {
        id
        name
        quote
        description
        motivation
        pain_points
        jobs_needs
        activites
        persona_image
       
      }
    }
  `;

  const UPDATE_PERSONA = gql`
    mutation updatePersona($id: ID!, $input: PersonaInput!) {
      updatePersona(id: $id, input: $input) {
        name
        quote
        description
        motivation
        pain_points
        jobs_needs
        activites
        persona_image
       
      }
    }
  `;

  const DELETE_PERSONA = gql`
    mutation DeletePersona($id: ID!) {
      deletePersona(id: $id)
    }
  `;

  export default function EditPersona() {
    const { index } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const personas = useSelector((state) => state.personas.personas);
    const personaFromRedux = personas.find((p) => p.id === index);
    
    const { data, loading, error } = useQuery(GET_PERSONA, {
      variables: { id: index },
      skip: personaFromRedux !== undefined, 
    });

    const [updatePersonaMutation] = useMutation(UPDATE_PERSONA);
    const [deletePersonaMutation] = useMutation(DELETE_PERSONA);

    const [persona, setPersona] = useState(personaFromRedux || null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (data?.getPersona) {
        setPersona(data.getPersona);
      }
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching persona: {error.message}</div>;

    const handleChange = (e) => {
      setPersona({ ...persona, [e.target.name]: e.target.value });
    };

    const handleQuillChange = (field, value) => {
      setPersona({ ...persona, [field]: value });
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file.");
        e.target.value = "";
      }
    };

    const handleImageSubmit = () => {
      if (previewImage) {
        setPersona((prev) => ({ ...prev, persona_image: previewImage }));
      }
      setShowModal(false);
    };

    const handleUpdatePersona = async () => {
      try {
        const { __typename, user_id, id, ...cleanedPersona } = persona;
      
        const { data } = await updatePersonaMutation({
          variables: { id: index, input: cleanedPersona },
        });

        dispatch(updatePersona({ index, updatedPersona: data.updatePersona }));
        navigate("/dashboard");
      } catch (err) {
        console.error("Error updating persona:", err);
      }
    };

    const handleDeletePersona = async () => {
      try {
        await deletePersonaMutation({ variables: { id: index } });
        dispatch(deletePersona(index));
        navigate("/dashboard");
      } catch (err) {
        console.error("Error deleting persona:", err);
      }
    };

    if (!persona) return <div>Loading...</div>;

    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg w-100 h-100 overflow-auto">
          <img
            src={persona.persona_image}
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
                value={persona.name || "Unnamed"}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              />
            </div>
          </div>

          <div className="card-body">
            <div className="row g-4">
              {[{ label: "Notable Quote", name: "quote" }, { label: "Description", name: "description" }, { label: "Motivation", name: "motivation" }].map(({ label, name }) => (
                <div className="col-md-4" key={name}>
                  <label className="form-label fw-bold">{label}</label>
                  <textarea
                    className="form-control border-0"
                    name={name}
                    rows="5"
                    style={{ resize: "none", outline: "none", background: "transparent", boxShadow: "none" }}
                    value={persona[name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${label}`}
                  />
                </div>
              ))}
              {[{ label: "Pain Points", name: "pain_points" }, { label: "Jobs / Needs", name: "jobs_needs" }, { label: "Activities", name: "activites" }].map(({ label, name }) => (
                <div className="col-md-4" key={name}>
                  <label className="form-label fw-bold">{label}</label>
                  <ReactQuill theme="snow" value={persona[name] || ""} onChange={(value) => handleQuillChange(name, value)} style={{ height: "100px" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="card-footer d-flex justify-content-between mt-5">
            <button className="btn btn-danger btn-lg" onClick={handleDeletePersona}>DELETE</button>
            <div>
              <button className="btn btn-success btn-lg me-2" onClick={handleUpdatePersona}>UPDATE</button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>CLOSE</button>
            </div>
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
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleImageSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
