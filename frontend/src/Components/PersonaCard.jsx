import { PlusCircle, MoreVertical } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const PersonaCard = ({ name, image, lastUpdated }) => {
  return (
    <div className="card position-relative" style={{ width: "18rem" }}>
      <img
        src={image}
        className="card-img-top"
        alt={name}
        style={{
          width: "100%",
          height: "200px", 
          objectFit: "cover", 
        }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{name}</h5>
        </div>
        <p className="card-text text-muted">Last updated: {lastUpdated}</p>
      </div>
     
    </div>
  );
};

export default PersonaCard;
