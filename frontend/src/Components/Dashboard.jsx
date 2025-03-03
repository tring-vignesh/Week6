import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setPersonas } from "../store/personaSlice";
import Personalist from "./Personalist";


const GET_USER_PERSONAS = gql`
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

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  
  const { data, loading, error } = useQuery(GET_USER_PERSONAS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getUserPersonas) {
      dispatch(setPersonas(data.getUserPersonas));
    }
  }, [data, dispatch]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-4">Error: {error.message}</p>;

  return <Personalist />;
}
