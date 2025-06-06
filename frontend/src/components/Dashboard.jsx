import DgDashboard from "./dashboards/DgDashboard";
import DepartmentDashboard from "./dashboards/DepartmentDashboard";
import TeamDashboard from "./dashboards/TeamDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  switch (user.role_id) {
    case 1: // Directeur général
      return <DgDashboard />;
    case 2: // Chef de département
      return <DepartmentDashboard />;
    case 3: // Chef d’équipe
      return <TeamDashboard />;
    case 4: // Employé
      return <EmployeeDashboard />;
    default:
      return <p>Rôle inconnu.</p>;
  }
};

export default Dashboard;
