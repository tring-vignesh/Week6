  import { gql } from "graphql-tag";
  const typeDefs = gql`
  scalar Upload
  type User
  {
      id:ID!
      name:String!
      email:String!
  }

  type Persona {
      id: ID!
      name: String
      quote: String
      description: String
      motivation: String
      pain_points: String
      jobs_needs: String
      activites: String
      persona_image: String
      user_id: ID!
    }
  type Query
  {
      getUsers:[User]
      getUserPersonas: [Persona]
      getPersona(id: ID!): Persona
  }

  type Auth {
        token: String!
        user: User!
    }
    input PersonaInput {
    name: String! 
    quote: String
    description: String
    motivation: String
    pain_points: String
    jobs_needs: String
    activites: String
    
  }
  type Mutation
  {
      signup(name:String!,email:String!,password:String!):Auth

      signin(email:String!,password:String!):Auth

      addPersona(
      input:PersonaInput!,
      persona_image: Upload
      ): Persona

      updatePersona(
        id:ID!
        input: PersonaInput!
      ): Persona

      
      deletePersona(id: ID!): String
  }


  `;
  export { typeDefs };