import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation, gql } from "@apollo/client";
import { setPersonas, deletePersona } from "../store/personaSlice.js";
import PersonaCard from "./PersonaCard.jsx";
import { PlusCircle } from "lucide-react";

const GET_PERSONAS = gql`
  query GetUserPersonas {
    getUserPersonas {
      id
      name
      quote
      description
      motivation
      pain_points
      jobs_needs
      activites
      persona_image
      user_id
    }
  }
`;

const DELETE_PERSONA = gql`
  mutation DeletePersona($id: ID!) {
    deletePersona(id: $id)
  }
`;

const Personalist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const personas = useSelector((state) => state.personas.personas) || [];

  const { data, loading, error } = useQuery(GET_PERSONAS, {
    fetchPolicy: "network-only",
  });

  const [deletePersonaMutation] = useMutation(DELETE_PERSONA);

  useEffect(() => {
    if (data?.getUserPersonas) {
      dispatch(setPersonas(data.getUserPersonas));
    }
  }, [data, dispatch]);

  if (loading) return <p>Loading personas...</p>;
  if (error) return <p>Error loading personas: {error.message}</p>;

  const editPersona = (index) => {
    navigate(`/editpersona/${index}`);
  };

  const addPersona = () => {
    navigate("/addpersona");
  };

  const handleDelete = async (id, index) => {
    try {
      await deletePersonaMutation({ variables: { id } });
      dispatch(deletePersona(id));
    } catch (err) {
      console.error("Error deleting persona:", err);
    }
  };

  return (
    <div className="d-flex flex-wrap gap-3 p-3">
      {personas.map((persona) => (
        <div key={persona.id } onClick={() => editPersona(persona.id)}>
          <PersonaCard
            name={persona.name || "Unnamed Persona"}
            image={persona.persona_image || ""}
            lastUpdated={persona.lastUpdated || "Just now"}
            
            onDelete={() => handleDelete(persona.id)}
          />
        </div>
      ))}


      <div
        className="card d-flex align-items-center justify-content-center p-4"
        style={{ width: "18rem", cursor: "pointer" }}
        onClick={addPersona}
      >
        <PlusCircle size={40} />
        <p className="mt-2 text-secondary">Add a Persona</p>
      </div>
    </div>
  );
};

export default Personalist;
